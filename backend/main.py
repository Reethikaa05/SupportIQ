"""
SupportIQ - E-Commerce AI Support Resolution System
Backend API - FastAPI Application
"""
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import uvicorn
import json
import asyncio
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from agents.crew_orchestrator import SupportResolutionCrew
from data.mock_db import db, User, Ticket

# ─── Config ────────────────────────────────────────────────────────────────────
SECRET_KEY = "supportiq-purple-merit-secret-2025"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 8

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

app = FastAPI(title="SupportIQ API", version="1.0.0", description="NexGen Support - E-Commerce AI Support")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Pydantic Models ───────────────────────────────────────────────────────────
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    company: Optional[str] = "NexGen Support"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class OrderContext(BaseModel):
    order_id: str
    order_date: str
    delivery_date: Optional[str] = None
    item_category: str
    fulfillment_type: str  # first-party | marketplace
    shipping_region: str
    order_status: str  # placed | shipped | delivered | returned
    payment_method: Optional[str] = "credit_card"
    order_value: Optional[float] = None
    item_name: Optional[str] = None

class TicketRequest(BaseModel):
    ticket_text: str
    order_context: OrderContext
    priority: Optional[str] = "normal"

class TicketResponse(BaseModel):
    ticket_id: str
    classification: Dict[str, Any]
    clarifying_questions: List[str]
    decision: str
    rationale: str
    citations: List[Dict[str, str]]
    customer_response: str
    internal_notes: str
    confidence_score: float
    processing_time_ms: int
    agents_used: List[str]
    status: str

# ─── Auth Helpers ──────────────────────────────────────────────────────────────
def verify_password(plain: str, hashed: str) -> bool:
    import hashlib
    return hashlib.sha256(plain.encode()).hexdigest() == hashed

def hash_password(password: str) -> str:
    import hashlib
    return hashlib.sha256(password.encode()).hexdigest()

def create_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.get_user_by_email(email)
    if user is None:
        raise credentials_exception
    return user

# ─── Auth Routes ───────────────────────────────────────────────────────────────
@app.post("/api/auth/register", response_model=Token)
async def register(user_data: UserCreate):
    if db.get_user_by_email(user_data.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    user = db.create_user(
        name=user_data.name,
        email=user_data.email,
        hashed_password=hash_password(user_data.password),
        company=user_data.company
    )
    
    token = create_token(
        {"sub": user.email},
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email, "company": user.company, "role": user.role}
    }

@app.post("/api/auth/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    
    token = create_token(
        {"sub": user.email},
        timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    
    db.update_last_login(user.email)
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {"id": user.id, "name": user.name, "email": user.email, "company": user.company, "role": user.role}
    }

@app.get("/api/auth/me")
async def me(current_user: User = Depends(get_current_user)):
    return {"id": current_user.id, "name": current_user.name, "email": current_user.email, "company": current_user.company, "role": current_user.role}

# ─── Ticket Routes ─────────────────────────────────────────────────────────────
@app.post("/api/tickets/resolve", response_model=TicketResponse)
async def resolve_ticket(
    request: TicketRequest,
    current_user: User = Depends(get_current_user)
):
    import time
    start = time.time()
    
    try:
        crew = SupportResolutionCrew()
        result = await crew.resolve(
            ticket_text=request.ticket_text,
            order_context=request.order_context.model_dump()
        )
        
        elapsed = int((time.time() - start) * 1000)
        result["processing_time_ms"] = elapsed
        
        # Save ticket to DB
        ticket = db.create_ticket(
            user_id=current_user.id,
            ticket_text=request.ticket_text,
            order_context=request.order_context.model_dump(),
            result=result,
            priority=request.priority
        )
        result["ticket_id"] = ticket.id
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Resolution failed: {str(e)}")

@app.get("/api/tickets")
async def get_tickets(current_user: User = Depends(get_current_user)):
    tickets = db.get_user_tickets(current_user.id)
    return tickets

@app.get("/api/tickets/{ticket_id}")
async def get_ticket(ticket_id: str, current_user: User = Depends(get_current_user)):
    ticket = db.get_ticket(ticket_id)
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket

# ─── Dashboard / Analytics Routes ─────────────────────────────────────────────
@app.get("/api/dashboard/stats")
async def dashboard_stats(current_user: User = Depends(get_current_user)):
    return db.get_dashboard_stats(current_user.id)

@app.get("/api/dashboard/recent-activity")
async def recent_activity(current_user: User = Depends(get_current_user)):
    return db.get_recent_activity(current_user.id)

# ─── Health ────────────────────────────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "SupportIQ", "company": "NexGen Support"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
