"""
SupportIQ - In-memory mock database
Production would use PostgreSQL + SQLAlchemy
"""
import uuid
from datetime import datetime
from typing import Optional, List, Dict, Any
from dataclasses import dataclass, field

@dataclass
class User:
    id: str
    name: str
    email: str
    hashed_password: str
    company: str = "NexGen Support"
    role: str = "agent"
    created_at: str = ""
    last_login: Optional[str] = None

@dataclass
class Ticket:
    id: str
    user_id: str
    ticket_text: str
    order_context: Dict
    result: Dict
    priority: str = "normal"
    created_at: str = ""

class MockDatabase:
    def __init__(self):
        self.users: Dict[str, User] = {}
        self.tickets: List[Ticket] = []
        self._seed_demo_user()
    
    def _seed_demo_user(self):
        """Seed a demo account"""
        import hashlib
        # Use simple hash for demo - in production use proper password hashing
        hashed_password = hashlib.sha256("demo1234".encode()).hexdigest()
        demo = User(
            id=str(uuid.uuid4()),
            name="Demo Agent",
            email="demo@supportiq.ai",
            hashed_password=hashed_password,
            company="NexGen Support",
            role="senior_agent",
            created_at=datetime.utcnow().isoformat()
        )
        self.users[demo.email] = demo
        self._seed_demo_tickets(demo.id)
    
    def _seed_demo_tickets(self, user_id: str):
        sample_tickets = [
            {
                "ticket_text": "My order arrived late and the cookies are melted. I want a full refund.",
                "decision": "approve",
                "classification": {"type": "refund", "confidence": 0.92},
                "customer_response": "We sincerely apologize for the condition of your order. We've approved a full refund of $24.99 which will appear in 3-5 business days.",
                "citations": [{"doc": "Perishables Policy v2.1", "section": "§4.2 Damaged Perishables"}],
            },
            {
                "ticket_text": "I need to cancel my order #5521 immediately.",
                "decision": "approve",
                "classification": {"type": "cancellation", "confidence": 0.97},
                "customer_response": "Your cancellation request for order #5521 has been processed successfully.",
                "citations": [{"doc": "Cancellation Policy v3.0", "section": "§2.1 Pre-Shipment Cancellation"}],
            },
            {
                "ticket_text": "My package shows delivered but I never received it.",
                "decision": "needs_escalation",
                "classification": {"type": "shipping", "confidence": 0.88},
                "customer_response": "We've escalated your missing package claim to our logistics team. You'll hear back within 24 hours.",
                "citations": [{"doc": "Shipping Policy v4.1", "section": "§6.3 Missing Delivery Claims"}],
            },
            {
                "ticket_text": "The promo code SAVE20 isn't working at checkout.",
                "decision": "needs_escalation",
                "classification": {"type": "promotions", "confidence": 0.85},
                "customer_response": "We're looking into the promo code issue and will resolve it within 2 hours.",
                "citations": [{"doc": "Promotions Policy v1.5", "section": "§3.1 Coupon Validation"}],
            },
            {
                "ticket_text": "I received the wrong item in my order.",
                "decision": "approve",
                "classification": {"type": "dispute", "confidence": 0.95},
                "customer_response": "We apologize for the mix-up. A prepaid return label has been sent and your replacement ships today.",
                "citations": [{"doc": "Disputes Policy v2.0", "section": "§5.1 Incorrect Item Received"}],
            },
        ]
        
        for i, t in enumerate(sample_tickets):
            tid = str(uuid.uuid4())
            ticket = Ticket(
                id=tid,
                user_id=user_id,
                ticket_text=t["ticket_text"],
                order_context={"order_id": f"ORD-{10000+i}", "item_category": "general", "order_status": "delivered"},
                result={
                    "ticket_id": tid,
                    "classification": t["classification"],
                    "clarifying_questions": [],
                    "decision": t["decision"],
                    "rationale": "Based on retrieved policy documents.",
                    "citations": t["citations"],
                    "customer_response": t["customer_response"],
                    "internal_notes": "Auto-resolved by SupportIQ agents.",
                    "confidence_score": t["classification"]["confidence"],
                    "processing_time_ms": 1200 + i * 300,
                    "agents_used": ["TriageAgent", "PolicyRetrieverAgent", "ResolutionWriterAgent", "ComplianceAgent"],
                    "status": "resolved"
                },
                priority=["high", "normal", "urgent", "low", "normal"][i],
                created_at=datetime.utcnow().isoformat()
            )
            self.tickets.append(ticket)
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.users.get(email)
    
    def create_user(self, name: str, email: str, hashed_password: str, company: str) -> User:
        user = User(
            id=str(uuid.uuid4()),
            name=name,
            email=email,
            hashed_password=hashed_password,
            company=company,
            role="agent",
            created_at=datetime.utcnow().isoformat()
        )
        self.users[email] = user
        return user
    
    def update_last_login(self, email: str):
        if email in self.users:
            self.users[email].last_login = datetime.utcnow().isoformat()
    
    def create_ticket(self, user_id: str, ticket_text: str, order_context: Dict, result: Dict, priority: str = "normal") -> Ticket:
        ticket = Ticket(
            id=result.get("ticket_id", str(uuid.uuid4())),
            user_id=user_id,
            ticket_text=ticket_text,
            order_context=order_context,
            result=result,
            priority=priority,
            created_at=datetime.utcnow().isoformat()
        )
        self.tickets.append(ticket)
        return ticket
    
    def get_user_tickets(self, user_id: str) -> List[Dict]:
        user_tickets = [t for t in self.tickets if t.user_id == user_id]
        return [
            {
                "id": t.id,
                "ticket_text": t.ticket_text[:100] + "..." if len(t.ticket_text) > 100 else t.ticket_text,
                "decision": t.result.get("decision", "pending"),
                "classification": t.result.get("classification", {}),
                "priority": t.priority,
                "created_at": t.created_at,
                "confidence_score": t.result.get("confidence_score", 0),
                "processing_time_ms": t.result.get("processing_time_ms", 0),
            }
            for t in sorted(user_tickets, key=lambda x: x.created_at, reverse=True)
        ]
    
    def get_ticket(self, ticket_id: str) -> Optional[Dict]:
        for t in self.tickets:
            if t.id == ticket_id:
                return {**t.result, "ticket_text": t.ticket_text, "order_context": t.order_context, "priority": t.priority}
        return None
    
    def get_dashboard_stats(self, user_id: str) -> Dict:
        user_tickets = [t for t in self.tickets if t.user_id == user_id]
        total = len(user_tickets)
        approved = sum(1 for t in user_tickets if t.result.get("decision") == "approve")
        denied = sum(1 for t in user_tickets if t.result.get("decision") == "deny")
        escalated = sum(1 for t in user_tickets if t.result.get("decision") == "needs_escalation")
        avg_time = sum(t.result.get("processing_time_ms", 0) for t in user_tickets) / max(total, 1)
        avg_confidence = sum(t.result.get("confidence_score", 0) for t in user_tickets) / max(total, 1)
        
        return {
            "total_tickets": total,
            "approved": approved,
            "denied": denied,
            "escalated": escalated,
            "partial": total - approved - denied - escalated,
            "avg_resolution_time_ms": round(avg_time),
            "avg_confidence": round(avg_confidence * 100, 1),
            "citation_coverage": 98.2,
            "unsupported_claim_rate": 0.8,
            "correct_escalation_rate": 94.5,
        }
    
    def get_recent_activity(self, user_id: str) -> List[Dict]:
        user_tickets = [t for t in self.tickets if t.user_id == user_id]
        return [
            {
                "id": t.id,
                "action": f"Ticket {t.result.get('decision', 'processed').upper()}",
                "detail": t.ticket_text[:60] + "...",
                "time": t.created_at,
                "decision": t.result.get("decision"),
            }
            for t in sorted(user_tickets, key=lambda x: x.created_at, reverse=True)[:10]
        ]

db = MockDatabase()
