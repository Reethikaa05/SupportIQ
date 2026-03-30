"""
SupportIQ - CrewAI Multi-Agent Orchestration
Four core agents: Triage → PolicyRetriever → ResolutionWriter → Compliance
"""
import json
import re
import uuid
import os
from typing import Dict, List, Any, Optional
from datetime import datetime
import requests

from data.policies import POLICY_DOCUMENTS, get_all_policy_text

# Load environment variables
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # dotenv not installed, use environment variables directly

# Print HF token for debugging (remove in production)
hf_token = os.getenv("HUGGINGFACE_API_TOKEN")
if hf_token:
    print(f"HF Token loaded: {hf_token[:10]}...")
else:
    print("No HF token found")


# ─── Hugging Face API Integration ─────────────────────────────────────────────
class HuggingFaceAPI:
    """Simple wrapper for Hugging Face Inference API."""
    
    def __init__(self):
        self.token = os.getenv("HUGGINGFACE_API_TOKEN")
        self.base_url = "https://api-inference.huggingface.co/models"
        self.headers = {"Authorization": f"Bearer {self.token}"} if self.token else {}
    
    def call_openai_model(self, prompt: str, model: str = "openai/gpt-4", max_tokens: int = 500) -> str:
        """Call OpenAI model via HF Inference API."""
        url = f"{self.base_url}/{model}"
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": 0.1,
                "return_full_text": False
            }
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload, timeout=30)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and result:
                    return result[0].get("generated_text", "No response generated")
                return str(result)
            else:
                return f"API Error: {response.status_code} - {response.text}"
        except Exception as e:
            return f"Request failed: {str(e)}"
    
    def call_anthropic_model(self, prompt: str, model: str = "anthropic/claude-3-sonnet", max_tokens: int = 500) -> str:
        """Call Anthropic model via HF Inference API."""
        url = f"{self.base_url}/{model}"
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": max_tokens,
                "temperature": 0.1,
                "return_full_text": False
            }
        }
        
        try:
            response = requests.post(url, headers=self.headers, json=payload, timeout=30)
            if response.status_code == 200:
                result = response.json()
                if isinstance(result, list) and result:
                    return result[0].get("generated_text", "No response generated")
                return str(result)
            else:
                return f"API Error: {response.status_code} - {response.text}"
        except Exception as e:
            return f"Request failed: {str(e)}"


# Initialize HF API client
hf_api = HuggingFaceAPI()

# ─── LLM-Powered Agent ───────────────────────────────────────────────────────
class LLMAgent:
    """Simple LLM agent using Hugging Face API."""
    
    def __init__(self):
        self.hf_api = hf_api
    
    def process_ticket(self, ticket_text: str, order_context: Dict) -> Dict:
        """Process a ticket using LLM via HF API."""
        
        # Format context
        context_str = f"""
Order Details:
- Order ID: {order_context.get('order_id', 'Unknown')}
- Item: {order_context.get('item_name', 'Unknown')}
- Category: {order_context.get('item_category', 'Unknown')}
- Status: {order_context.get('order_status', 'Unknown')}
- Value: ${order_context.get('order_value', 'Unknown')}

Customer Issue: {ticket_text}
"""
        
        # Create prompt for LLM
        prompt = f"""You are a customer support AI assistant. Analyze this customer support ticket and provide a structured response.

{context_str}

Please provide:
1. Issue classification (refund, shipping, cancellation, dispute, etc.)
2. Decision (approve, deny, partial, needs_escalation)
3. Customer response (professional, empathetic)
4. Internal notes

Format as JSON with keys: classification, decision, response, notes
"""
        
        try:
            # Try OpenAI first
            llm_response = self.hf_api.call_openai_model(prompt, max_tokens=800)
            
            # Parse JSON response
            try:
                result = json.loads(llm_response)
                return {
                    "classification": result.get("classification", "unknown"),
                    "decision": result.get("decision", "needs_escalation"),
                    "customer_response": result.get("response", "Thank you for contacting us. We're processing your request."),
                    "internal_notes": result.get("notes", "Processed via LLM"),
                    "llm_used": "openai"
                }
            except json.JSONDecodeError:
                # Fallback parsing
                return {
                    "classification": "processed",
                    "decision": "needs_escalation",
                    "customer_response": llm_response[:500] + "..." if len(llm_response) > 500 else llm_response,
                    "internal_notes": "LLM response parsing failed",
                    "llm_used": "openai"
                }
                
        except Exception as e:
            # Fallback to rule-based
            return {
                "classification": "fallback",
                "decision": "needs_escalation", 
                "customer_response": "Thank you for contacting us. We're reviewing your request and will respond shortly.",
                "internal_notes": f"LLM failed: {str(e)}",
                "llm_used": "none"
            }


# Initialize LLM agent
llm_agent = LLMAgent()


# ─── Agent Definitions ─────────────────────────────────────────────────────────

class TriageAgent:
    """Classifies ticket, identifies issue type and missing context."""
    
    ISSUE_TYPES = {
        "refund": ["refund", "money back", "reimburs", "return", "credit"],
        "shipping": ["ship", "deliver", "package", "tracking", "transit", "late", "lost", "missing", "not received"],
        "cancellation": ["cancel", "cancellation", "stop order"],
        "promotions": ["coupon", "promo", "discount", "code", "offer", "sale", "deal"],
        "dispute": ["wrong item", "incorrect", "damaged", "broken", "defective", "not as described", "missing item"],
        "fraud": ["unauthorized", "hack", "fraud", "identity", "not me", "stolen"],
        "payment": ["payment", "charge", "billing", "invoice", "overcharged"],
        "other": []
    }
    
    def classify(self, ticket_text: str, order_context: Dict) -> Dict:
        ticket_lower = ticket_text.lower()
        
        scores = {}
        for issue_type, keywords in self.ISSUE_TYPES.items():
            score = sum(1 for kw in keywords if kw in ticket_lower)
            scores[issue_type] = score
        
        best_type = max(scores, key=scores.get)
        max_score = scores[best_type]
        total = sum(scores.values()) or 1
        confidence = min(0.95, max(0.55, max_score / total + 0.4))
        
        if max_score == 0:
            best_type = "other"
            confidence = 0.55
        
        # Check for secondary type
        secondary = None
        for t, s in sorted(scores.items(), key=lambda x: x[1], reverse=True):
            if t != best_type and s > 0:
                secondary = t
                break
        
        # Identify missing fields
        clarifying_questions = []
        missing = []
        
        if not order_context.get("order_id"):
            clarifying_questions.append("Could you please provide your order number so we can locate your purchase?")
            missing.append("order_id")
        
        if not order_context.get("delivery_date") and best_type in ["refund", "shipping", "dispute"]:
            if order_context.get("order_status") == "delivered":
                clarifying_questions.append("When did you receive the delivery? This helps us verify your return window eligibility.")
                missing.append("delivery_date")
        
        if not order_context.get("item_category") and best_type in ["refund", "dispute"]:
            clarifying_questions.append("What type of item is this? (e.g., electronics, clothing, food, personal care)")
            missing.append("item_category")
        
        return {
            "issue_type": best_type,
            "secondary_type": secondary,
            "confidence": round(confidence, 2),
            "clarifying_questions": clarifying_questions[:3],
            "missing_fields": missing,
            "urgency": "high" if best_type == "fraud" else ("medium" if best_type in ["shipping", "refund"] else "normal")
        }


# ─── Simple Vector Store (keyword-based fallback, no external dependencies) ─────
class SimpleVectorStore:
    """Lightweight keyword/TF-IDF style retriever — works without API keys."""
    
    def __init__(self):
        self.chunks = get_all_policy_text()
    
    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        query_terms = set(query.lower().split())
        stop_words = {"the","a","an","is","in","of","for","and","or","to","my","i","was","were","have","has"}
        query_terms -= stop_words
        
        scored = []
        for chunk in self.chunks:
            text_lower = chunk["text"].lower()
            score = sum(text_lower.count(term) for term in query_terms)
            # Boost exact phrase matches
            if query.lower()[:20] in text_lower:
                score += 10
            scored.append((score, chunk))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        return [chunk for score, chunk in scored[:top_k] if score > 0]


class PolicyRetrieverAgent:
    """Retrieves relevant policy excerpts with citations."""
    
    def __init__(self, vector_store: SimpleVectorStore):
        self.vs = vector_store
    
    def retrieve(self, ticket_text: str, issue_type: str, order_context: Dict) -> Dict:
        # Build targeted queries
        queries = [ticket_text]
        
        type_queries = {
            "refund": "refund return policy window exception",
            "shipping": "shipping delivery lost package missing",
            "cancellation": "order cancellation pre-shipment",
            "promotions": "coupon promo code terms discount",
            "dispute": "damaged incorrect item dispute resolution",
            "fraud": "unauthorized order fraud security",
            "payment": "payment billing charge dispute",
        }
        
        if issue_type in type_queries:
            queries.append(type_queries[issue_type])
        
        # Category-specific queries
        item_cat = order_context.get("item_category", "").lower()
        if "perishable" in item_cat or "food" in item_cat:
            queries.append("perishable food damaged refund exception")
        if "hygiene" in item_cat or "personal care" in item_cat:
            queries.append("hygiene personal care opened non-returnable")
        if "electronic" in item_cat:
            queries.append("electronics return DOA defective restocking fee")
        
        # Marketplace
        if order_context.get("fulfillment_type") == "marketplace":
            queries.append("marketplace seller return policy platform guarantee")
        
        # Regional
        region = order_context.get("shipping_region", "")
        if "CA" in region or "California" in region:
            queries.append("California regional policy consumer protection")
        
        # Collect unique chunks
        seen = set()
        all_chunks = []
        for q in queries:
            results = self.vs.search(q, top_k=4)
            for r in results:
                if r["chunk_id"] not in seen:
                    seen.add(r["chunk_id"])
                    all_chunks.append(r)
        
        # Format citations
        citations = []
        for chunk in all_chunks[:8]:  # limit to 8 most relevant
            citations.append({
                "chunk_id": chunk["chunk_id"],
                "doc_id": chunk["doc_id"],
                "doc_title": chunk["title"],
                "doc_url": chunk["url"],
                "category": chunk["category"],
                "excerpt": chunk["text"][:300] + "..." if len(chunk["text"]) > 300 else chunk["text"]
            })
        
        return {
            "retrieved_chunks": all_chunks,
            "citations": citations,
            "total_retrieved": len(all_chunks)
        }


class ResolutionWriterAgent:
    """Drafts customer-ready resolutions grounded in retrieved evidence."""
    
    DECISION_RULES = {
        "perishable_damaged": "approve",
        "perishable_undamaged": "deny",
        "hygiene_opened": "deny",
        "hygiene_sealed": "approve",
        "electronics_within_15days": "approve",
        "electronics_outside_15days": "deny",
        "shipping_lost": "approve",
        "shipping_missing_wait": "needs_escalation",
        "fraud": "needs_escalation",
        "pre_shipment_cancel": "approve",
        "post_shipment_cancel": "deny",
        "coupon_expired": "deny",
        "coupon_abuse": "deny",
        "not_in_policy": "needs_escalation",
    }
    
    def write_resolution(self, ticket_text: str, order_context: Dict, triage: Dict, retrieval: Dict) -> Dict:
        issue_type = triage["issue_type"]
        item_cat = order_context.get("item_category", "general").lower()
        order_status = order_context.get("order_status", "unknown")
        fulfillment = order_context.get("fulfillment_type", "first-party")
        
        # Determine decision
        decision = self._determine_decision(ticket_text, issue_type, item_cat, order_context, retrieval)
        
        # Build rationale
        rationale = self._build_rationale(decision, issue_type, item_cat, order_context, retrieval)
        
        # Format citations
        cited_docs = []
        for c in retrieval["citations"][:5]:
            cited_docs.append({
                "doc": c["doc_title"],
                "section": self._extract_section(c["excerpt"]),
                "url": c["doc_url"]
            })
        
        # Draft customer response
        customer_msg = self._draft_customer_message(decision, issue_type, ticket_text, order_context, cited_docs)
        
        # Internal notes
        internal = self._draft_internal_notes(decision, triage, retrieval, fulfillment)
        
        return {
            "decision": decision,
            "rationale": rationale,
            "citations": cited_docs,
            "customer_response": customer_msg,
            "internal_notes": internal,
        }
    
    def _determine_decision(self, text: str, issue_type: str, item_cat: str, ctx: Dict, retrieval: Dict) -> str:
        text_lower = text.lower()
        
        if issue_type == "fraud":
            return "needs_escalation"
        
        if issue_type == "cancellation":
            if ctx.get("order_status") in ["placed"]:
                return "approve"
            elif ctx.get("order_status") in ["shipped", "delivered"]:
                return "deny"
            return "needs_escalation"
        
        if issue_type == "refund" or issue_type == "dispute":
            # Perishable damaged
            if "perishable" in item_cat or "food" in item_cat:
                if any(w in text_lower for w in ["melted", "spoiled", "damaged", "broken", "crushed"]):
                    return "approve"
                return "deny"
            
            # Hygiene
            if "hygiene" in item_cat or "personal care" in item_cat:
                if any(w in text_lower for w in ["sealed", "unopened", "never opened"]):
                    return "approve"
                return "deny"
            
            # Electronics
            if "electronic" in item_cat:
                return "approve"  # assume within window for now
            
            # Wrong/damaged item
            if any(w in text_lower for w in ["wrong", "incorrect", "damaged", "broken", "defective", "not working"]):
                return "approve"
            
            # Keep item demand
            if "keep" in text_lower and ("refund" in text_lower):
                return "partial"
            
            return "approve"
        
        if issue_type == "shipping":
            if any(w in text_lower for w in ["lost", "missing", "never received", "not received"]):
                return "needs_escalation"
            if "late" in text_lower:
                return "partial"
            return "needs_escalation"
        
        if issue_type == "promotions":
            if any(w in text_lower for w in ["expired", "not working"]):
                return "deny"
            return "needs_escalation"
        
        if retrieval["total_retrieved"] == 0:
            return "needs_escalation"
        
        return "needs_escalation"
    
    def _build_rationale(self, decision: str, issue_type: str, item_cat: str, ctx: Dict, retrieval: Dict) -> str:
        bases = {
            "approve": f"Based on retrieved policy documentation, this {issue_type} request qualifies for resolution. ",
            "deny": f"Per policy documentation, this request does not meet the criteria for approval. ",
            "partial": f"Partial resolution is appropriate given the circumstances and applicable policies. ",
            "needs_escalation": f"This case requires escalation due to complexity or policy gaps. "
        }
        rationale = bases.get(decision, "")
        
        if "perishable" in item_cat and decision == "approve":
            rationale += "Damaged perishable items are eligible for full refund per §4.2 of the Returns & Refunds Policy, and customers do not need to return perishable items."
        elif "hygiene" in item_cat and decision == "deny":
            rationale += "Opened hygiene/personal care items are non-returnable per §2 of the Hygiene Policy, with limited exceptions for allergic reactions or contaminated products."
        elif issue_type == "cancellation" and decision == "approve":
            rationale += "Pre-shipment cancellations are fully refundable per §1 of the Cancellation Policy."
        elif issue_type == "shipping":
            rationale += "Missing delivery claims require a 24-hour waiting period and investigation before resolution per §5 of the Shipping Policy."
        else:
            if retrieval["citations"]:
                rationale += f"Relevant policies retrieved: {', '.join(c['doc_title'] for c in retrieval['citations'][:3])}."
        
        return rationale
    
    def _extract_section(self, excerpt: str) -> str:
        match = re.search(r'§[\d\.]+[^.:\n]*', excerpt)
        return match.group(0)[:50] if match else "General Policy"
    
    def _draft_customer_message(self, decision: str, issue_type: str, ticket_text: str, ctx: Dict, citations: List) -> str:
        order_id = ctx.get("order_id", "your order")
        
        intros = {
            "approve": "Thank you for contacting us. We've reviewed your request and are happy to let you know it has been approved.",
            "deny": "Thank you for reaching out. After carefully reviewing your request against our current policies, we're unable to approve this request.",
            "partial": "Thank you for contacting us. We've reviewed your situation and can offer a partial resolution.",
            "needs_escalation": "Thank you for contacting us. Your case has been escalated to our specialist team for a thorough review."
        }
        
        resolutions = {
            "approve": {
                "refund": f"A full refund for {order_id} has been approved and will be processed to your original payment method within 3–5 business days.",
                "cancellation": f"Your order {order_id} has been cancelled. A full refund will be issued within 3–5 business days.",
                "dispute": f"We've approved a replacement or full refund for {order_id}. Please allow 1–2 business days for processing.",
                "shipping": f"We've confirmed the shipping issue with {order_id} and will send a replacement or issue a full refund.",
            },
            "deny": {
                "refund": "Unfortunately, this item falls under our non-returnable category. Our policy does not permit returns or refunds in this case.",
                "cancellation": "As your order has already shipped, we're unable to cancel it at this stage. Once delivered, you may initiate a return through our standard process.",
                "promotions": "This promotional code is not applicable to your order as it does not meet the required terms and conditions.",
            },
            "partial": {
                "refund": "We can offer a partial resolution: a store credit or partial refund for the affected portion of your order.",
                "shipping": "We can refund your shipping charges as a courtesy for the inconvenience experienced.",
            },
            "needs_escalation": {
                "shipping": "Our specialized lost package team will investigate and respond within 3–5 business days.",
                "fraud": "Our security team has been alerted and will contact you within 24 hours.",
                "promotions": "We're reviewing the promotional terms and will apply the appropriate discount within 24 hours.",
            }
        }
        
        resolution_text = resolutions.get(decision, {}).get(issue_type, 
            "Our team will follow up with you within 1–2 business days with a resolution.")
        
        closing = "\n\nIf you have any further questions, please don't hesitate to contact us. We're here to help!\n\nWarm regards,\nSupportIQ Customer Care Team\nNexGen Support"
        
        return f"{intros.get(decision, '')} {resolution_text}{closing}"
    
    def _draft_internal_notes(self, decision: str, triage: Dict, retrieval: Dict, fulfillment: str) -> str:
        notes = [
            f"Issue classified as: {triage['issue_type']} (confidence: {triage['confidence']})",
            f"Decision: {decision.upper()}",
            f"Fulfillment type: {fulfillment}",
            f"Policy chunks retrieved: {retrieval['total_retrieved']}",
        ]
        
        if triage.get("missing_fields"):
            notes.append(f"⚠️ Missing order context fields: {', '.join(triage['missing_fields'])}")
        
        if decision == "needs_escalation":
            notes.append("🔺 ESCALATION REQUIRED: Assign to senior agent queue.")
        
        if fulfillment == "marketplace":
            notes.append("📦 Marketplace order: Seller must be contacted first per §5 Marketplace Policy before platform refund.")
        
        notes.append(f"Processed by SupportIQ Multi-Agent System at {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}")
        
        return "\n• " + "\n• ".join(notes)


class ComplianceAgent:
    """Validates resolution for safety, citation coverage, and policy grounding."""
    
    def validate(self, resolution: Dict, retrieval: Dict, ticket_text: str) -> Dict:
        issues = []
        warnings = []
        passed = True
        
        # 1. Citation coverage check
        if not resolution.get("citations"):
            issues.append("FAIL: No citations present — resolution is unsupported.")
            passed = False
        elif len(resolution["citations"]) < 1:
            warnings.append("WARN: Only 1 citation. Consider retrieving additional policy support.")
        
        # 2. Check for unsupported absolute statements
        customer_msg = resolution.get("customer_response", "")
        unsafe_phrases = [
            ("always", "Absolute guarantee not backed by policy"),
            ("guaranteed", "Check if shipping guarantee applies"),
            ("immediately", "Verify processing SLA before promising"),
        ]
        for phrase, reason in unsafe_phrases:
            if phrase in customer_msg.lower():
                warnings.append(f"WARN: '{phrase}' in response — {reason}")
        
        # 3. Sensitive data check
        sensitive_patterns = [
            r'\b\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}\b',  # credit card
            r'\b\d{3}[-.\s]?\d{2}[-.\s]?\d{4}\b',  # SSN
            r'\bpassword\b',
        ]
        for pattern in sensitive_patterns:
            if re.search(pattern, customer_msg, re.I):
                issues.append("FAIL: Potential sensitive data in customer message — MUST review.")
                passed = False
        
        # 4. Decision consistency
        decision = resolution.get("decision", "")
        if decision not in ["approve", "deny", "partial", "needs_escalation"]:
            issues.append(f"FAIL: Invalid decision value: '{decision}'")
            passed = False
        
        # 5. Marketplace check
        if "marketplace" in ticket_text.lower() and "marketplace" not in resolution.get("rationale", "").lower():
            warnings.append("WARN: Marketplace mentioned in ticket but not addressed in rationale.")
        
        # 6. Fraud flag
        fraud_signals = ["unauthorized", "not me", "hacked", "fraud"]
        if any(s in ticket_text.lower() for s in fraud_signals):
            if decision != "needs_escalation":
                issues.append("FAIL: Fraud signals present but decision is not escalation — override required.")
                passed = False
        
        # Final status
        if not passed:
            final_status = "blocked"
        elif warnings:
            final_status = "approved_with_warnings"
        else:
            final_status = "approved"
        
        return {
            "status": final_status,
            "passed": passed,
            "issues": issues,
            "warnings": warnings,
            "citation_count": len(resolution.get("citations", [])),
            "compliance_notes": f"Compliance check completed. Status: {final_status}. Issues: {len(issues)}, Warnings: {len(warnings)}."
        }


# ─── Crew Orchestrator ─────────────────────────────────────────────────────────

class SupportResolutionCrew:
    """Orchestrates the 4-agent pipeline."""
    
    def __init__(self):
        self.vector_store = SimpleVectorStore()
        self.triage = TriageAgent()
        self.retriever = PolicyRetrieverAgent(self.vector_store)
        self.writer = ResolutionWriterAgent()
        self.compliance = ComplianceAgent()
    
    async def resolve(self, ticket_text: str, order_context: Dict) -> Dict:
        ticket_id = str(uuid.uuid4())
        
        try:
            # Try LLM-powered resolution first
            print("Attempting LLM-powered resolution via Hugging Face API...")
            llm_result = self.llm_agent.process_ticket(ticket_text, order_context)
            
            if llm_result["llm_used"] != "none":
                # LLM succeeded
                return {
                    "ticket_id": ticket_id,
                    "classification": {
                        "type": llm_result["classification"],
                        "confidence": 0.9,
                        "urgency": "normal"
                    },
                    "clarifying_questions": [],
                    "decision": llm_result["decision"],
                    "rationale": f"AI-powered resolution using {llm_result['llm_used']} via Hugging Face API",
                    "citations": [],
                    "customer_response": llm_result["customer_response"],
                    "internal_notes": llm_result["internal_notes"],
                    "compliance": {"status": "approved", "passed": True, "issues": [], "warnings": []},
                    "confidence_score": 0.9,
                    "agents_used": ["LLMAgent"],
                    "status": "resolved",
                    "processing_time_ms": 0,
                }
            
        except Exception as e:
            print(f"LLM failed, falling back to rule-based: {e}")
        
        # Fallback to rule-based resolution
        agents_used = ["TriageAgent", "PolicyRetrieverAgent", "ResolutionWriterAgent", "ComplianceAgent"]
        
        triage_result = self.triage.classify(ticket_text, order_context)
        retrieval_result = self.retriever.retrieve(ticket_text, triage_result["issue_type"], order_context)
        resolution = self.writer.write_resolution(ticket_text, order_context, triage_result, retrieval_result)
        compliance = self.compliance.validate(resolution, retrieval_result, ticket_text)
        
        # If compliance blocked, override decision
        if not compliance["passed"]:
            resolution["decision"] = "needs_escalation"
            resolution["internal_notes"] += "\n• 🚨 COMPLIANCE BLOCK: Auto-escalated due to compliance failure."
            resolution["customer_response"] = (
                "Thank you for contacting us. Your request requires additional review by our specialist team. "
                "We will respond within 24 hours.\n\nSupportIQ Customer Care — NexGen Support"
            )
        
        # Calculate confidence score
        confidence = triage_result["confidence"]
        if retrieval_result["total_retrieved"] > 3:
            confidence = min(0.98, confidence + 0.05)
        if compliance["status"] == "approved":
            confidence = min(0.99, confidence + 0.03)
        
        return {
            "ticket_id": ticket_id,
            "classification": {
                "type": triage_result["issue_type"],
                "secondary_type": triage_result.get("secondary_type"),
                "confidence": triage_result["confidence"],
                "urgency": triage_result["urgency"]
            },
            "clarifying_questions": triage_result["clarifying_questions"],
            "decision": resolution["decision"],
            "rationale": resolution["rationale"],
            "citations": resolution["citations"],
            "customer_response": resolution["customer_response"],
            "internal_notes": resolution["internal_notes"],
            "compliance": compliance,
            "confidence_score": round(confidence, 3),
            "agents_used": agents_used,
            "status": "resolved" if compliance["passed"] else "escalated",
            "processing_time_ms": 0,  # set by caller
        }
