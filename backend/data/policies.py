"""
SupportIQ Policy Corpus - NexGen Support
Synthetic policy documents for e-commerce support system
"""

POLICY_DOCUMENTS = [
    {
        "id": "returns_refunds_v3",
        "title": "Returns & Refunds Policy v3.2",
        "url": "https://internal.supportiq.ai/policies/returns-refunds",
        "content": """
## Returns & Refunds Policy v3.2 — NexGen Support
### Last Updated: January 2025

#### §1. Standard Return Window
Customers may return most items within 30 days of delivery for a full refund. Items must be unused, in original packaging, and accompanied by proof of purchase.

#### §2. Extended Return Windows
- Electronics: 15 days from delivery (strict)
- Apparel & Footwear: 45 days from delivery
- Books & Media: 30 days, unopened only
- Furniture & Large Items: 14 days, must be unassembled

#### §3. Refund Processing
- Credit card refunds: 3–5 business days
- Debit card refunds: 5–7 business days
- Store credit: Issued immediately
- Gift card purchases: Refunded as store credit only

#### §4. Non-Returnable Categories
The following items are FINAL SALE and cannot be returned or refunded under any standard policy:
- Perishable food and beverage items (unless defective or damaged in transit)
- Hygiene and personal care products (once opened or seal broken)
- Downloadable software and digital content
- Customized or personalized products
- Hazardous materials and flammable goods
- Underwear, swimwear, and earrings (for hygiene reasons)
- Live plants and animals

#### §4.1 Exception Process for Non-Returnable Items
Exceptions may be granted by a senior support agent or manager for:
- Items damaged during shipping (photographic evidence required)
- Items that are materially different from their description
- Documented product defects present upon receipt
Exception requests must be submitted within 7 days of delivery.

#### §4.2 Damaged Perishables Policy
For perishable items damaged in transit (melted, crushed, spoiled):
- Full refund is APPROVED when: delivery occurred more than 24 hours late, OR temperature-sensitive packaging failure is documented
- Partial refund (50%) when: damage occurred during normal delivery window
- Customer does NOT need to return perishable items (sanitary disposal allowed)
- Photo documentation required and must be submitted within 48 hours of delivery

#### §5. Opened Item Policy
- Electronics opened: 15% restocking fee applies
- Software/games opened: Non-returnable
- Apparel opened/tried on: Fully returnable within 45 days
- Food/beverage opened: Non-returnable (see §4.2 for damaged goods exception)

#### §6. Refund Without Return
Full refunds without requiring item return may be issued for:
- Items valued under $15 where return shipping cost exceeds item value
- Clearly defective items documented by photos
- Safety recall items
- Items lost in transit

#### §7. Marketplace Seller Returns
For items sold by third-party marketplace sellers:
- Standard return window is seller-defined (minimum 14 days by platform policy)
- Refunds processed by seller within 5 business days of return receipt
- Platform Guarantee covers customers if seller fails to process refund after 10 business days
- Damaged/defective marketplace items follow §4.1 exception process
""",
        "category": "returns"
    },
    {
        "id": "cancellation_policy_v4",
        "title": "Order Cancellation Policy v4.0",
        "url": "https://internal.supportiq.ai/policies/cancellations",
        "content": """
## Order Cancellation Policy v4.0
### Last Updated: December 2024

#### §1. Pre-Shipment Cancellation
Orders may be cancelled at no charge within 1 hour of placement for all item categories. After 1 hour but before shipment:
- Standard items: Cancellation allowed, full refund within 5 business days
- Custom/personalized items: Cannot be cancelled after 30 minutes
- Perishables being prepared: May incur 10% preparation fee

#### §2. Post-Shipment Cancellation
Once an order has shipped (tracking number assigned):
- Standard cancellation: Not possible. Customer must use returns process upon delivery.
- Emergency cancellation (fraud/unauthorized order): Escalate to fraud team immediately
- Intercept requests: Carrier intercept attempted at customer cost ($8.99 flat fee). Not guaranteed.

#### §3. Pre-Order Cancellation
Pre-orders may be cancelled with full refund at any time before the item ships, regardless of pre-order duration. Promotional pre-order discounts are forfeited if order is later re-placed.

#### §4. Subscription Cancellation
- Cancel anytime in account settings
- Access continues until end of current billing period
- No partial-month refunds for subscription services
- Annual subscribers may request prorated refund within first 30 days

#### §5. Cancellation Due to Stock Issues
If an item is cancelled by the platform due to out-of-stock:
- Full refund within 24 hours
- Customer receives 10% discount on next purchase (auto-applied coupon)
- Priority access to back-in-stock notification

#### §6. Seller-Initiated Cancellations (Marketplace)
Third-party sellers cancelling orders must:
- Notify customer within 24 hours
- Full refund issued by platform within 48 hours if seller fails to act
- Seller penalty points applied per violation of cancellation SLA
""",
        "category": "cancellations"
    },
    {
        "id": "shipping_delivery_v5",
        "title": "Shipping & Delivery Policy v5.1",
        "url": "https://internal.supportiq.ai/policies/shipping-delivery",
        "content": """
## Shipping & Delivery Policy v5.1
### Last Updated: February 2025

#### §1. Standard Shipping Timeframes
- Domestic (continental US): 3–7 business days
- Alaska/Hawaii: 7–14 business days
- Canada: 7–10 business days
- EU/UK: 10–21 business days (customs delays possible)
- Rest of World: 14–30 business days

#### §2. Expedited Shipping Options
- Express (2-day): Available for most items, $12.99 or free over $75
- Overnight: Available for non-perishable, non-oversized items, $24.99
- Same-day: Available in select metro areas, $8.99 (order by 11 AM local time)

#### §3. Shipping Guarantees
Express and Overnight shipping options carry a delivery guarantee. If guaranteed delivery is missed:
- Full refund of shipping charges
- $10 courtesy credit added to account
- Note: Weather events and carrier force majeure void this guarantee

#### §4. Lost Package Policy
A package is considered lost if:
- Tracking shows no movement for 7+ business days (domestic)
- Tracking shows no movement for 14+ business days (international)
- Marked "delivered" but customer confirms non-receipt

#### §5. Missing Delivery Claims (Marked Delivered, Not Received)
Process for "delivered but not received" claims:
1. Customer must wait 24 hours after "delivered" scan (porch pirates, neighbor delivery)
2. Customer must check with neighbors, building management, household members
3. File claim via support within 72 hours of delivery scan
4. Investigation window: 3–5 business days
5. Resolution options: replacement shipment OR full refund (customer choice)
6. Police report may be required for orders over $200

#### §6. Lost Package Resolution
Upon confirmation of loss:
- Full replacement shipped at no charge (same item if in stock)
- Full refund if replacement not desired or item out of stock
- Perishable lost packages: Refund only (no replacement)

#### §7. Damaged in Transit
- Photographic documentation required within 48 hours of delivery
- Carrier damage claim filed by platform on customer's behalf
- Replacement or refund within 5–7 business days of claim filing
- Original damaged item kept by customer (no return required) for items under $50

#### §8. Regional Shipping Restrictions
- Certain items (alcohol, tobacco, knives, firearms accessories) restricted by region
- CA Prop 65 warning compliance required for applicable products shipped to California
- Hawaii and Alaska: Additional surcharges apply to oversized items
- APO/FPO addresses: Standard military shipping rates, 10–21 day window

#### §9. Marketplace Seller Shipping
- Seller must ship within stated handling time (1–5 business days)
- If seller exceeds handling time by 3+ days without update, automatic cancellation offered
- Tracking must be uploaded by seller within 24 hours of shipment
- Platform SLA enforcement: Seller penalized for repeated late shipments
""",
        "category": "shipping"
    },
    {
        "id": "promotions_coupons_v2",
        "title": "Promotions & Coupon Terms v2.3",
        "url": "https://internal.supportiq.ai/policies/promotions",
        "content": """
## Promotions & Coupon Terms v2.3
### Last Updated: November 2024

#### §1. General Coupon Terms
- One coupon per order unless explicitly stated otherwise
- Coupons cannot be combined with other promotional offers
- Coupons apply to item subtotal only (not shipping, taxes, or fees)
- Minimum order thresholds must be met post-discount

#### §2. Coupon Stacking Rules
- Platform-issued coupons + seller coupons: NOT combinable
- Loyalty points + one coupon: Allowed
- Sale price + coupon code: Generally NOT allowed unless explicitly stated "applies to sale items"
- First-time buyer discount + referral code: NOT combinable (use higher value)

#### §3. Expired Coupon Policy
- Expired coupons are NOT honored
- Coupons expiring on the day of use: Valid until 11:59 PM customer's local timezone
- No extensions granted except in cases of documented system outages

#### §4. Coupon Abuse and Fraud
- Multiple accounts to claim single-use coupons: Account ban + order cancellation
- Unauthorized sharing of employee/internal codes: Immediate invalidation
- Suspected coupon fraud: Escalate to fraud team, do not manually apply codes

#### §5. Price Matching
- Price match available within 7 days of purchase for identical items from authorized retailers
- Marketplace seller prices: NOT eligible for price match
- Black Friday/Cyber Monday prices: Price match window reduced to 24 hours
- International prices: NOT eligible for price match
- Items must be in-stock at competitor at time of claim

#### §6. Promotional Credits and Store Credit
- Store credits expire 12 months from issuance
- Complimentary credits (goodwill gestures, late delivery): Expire 90 days from issuance
- Referral credits: Applied after referred customer's first completed purchase
- Credits non-transferable between accounts

#### §7. Flash Sales and Limited-Time Offers
- Flash sale prices apply only during the stated sale window
- Carts with flash-sale items: Prices lock for 15 minutes at checkout initiation
- If checkout not completed within 15 minutes, cart re-prices at current rate
- Flash sale items typically excluded from additional coupon use

#### §8. Regional Promotion Restrictions
- Alcohol-related promotions: Not valid in dry counties/states
- California customers: Certain sweepstakes excluded per CA lottery laws
- EU customers: GDPR-compliant opt-in required before promotional communications
""",
        "category": "promotions"
    },
    {
        "id": "disputes_policy_v3",
        "title": "Disputes, Damaged & Incorrect Items Policy v3.0",
        "url": "https://internal.supportiq.ai/policies/disputes",
        "content": """
## Disputes, Damaged & Incorrect Items Policy v3.0
### Last Updated: January 2025

#### §1. Incorrect Item Received
If a customer receives an item different from what was ordered:
- No return required for items under $30 (keep item + full refund or replacement)
- Return required for items $30+: Prepaid return label provided
- Replacement ships within 1–2 business days of confirmation
- Resolution time: 24–48 hours

#### §2. Missing Items in Order
- Customer must report within 7 days of delivery
- Investigation window: 2–3 business days
- Resolution: Replacement shipped or proportional refund issued
- Partial orders delivered in multiple shipments: Check tracking for remaining packages before filing

#### §3. Damaged Item on Arrival
- Report within 48 hours of delivery
- Photographic evidence required (item and packaging)
- Minor cosmetic damage (scratch on non-visible surface): 10–20% partial refund
- Major damage (broken, cracked, non-functional): Full replacement or refund
- Return not required for clearly damaged items under $75

#### §4. Defective Item
- Defect reported within 30 days: Full replacement or refund
- Defect reported after 30 days: Manufacturer warranty path; support cannot authorize full refunds
- Warranty claims: Customer directed to manufacturer support
- Platform intervenes in manufacturer disputes for items purchased within 90 days

#### §5. Chargeback / Payment Dispute Policy
If a customer files a chargeback without contacting support:
- Platform may attempt to resolve via bank/issuer dispute process
- Accounts with pending chargebacks: Order placement restricted until resolved
- Customers encouraged to contact support before filing chargebacks
- Fraudulent chargebacks: Account permanent ban

#### §6. Item Not as Described (INAD)
- Customer must report within 30 days of delivery
- Photograph evidence required
- If INAD confirmed: Full refund + prepaid return label
- Seller liable for INAD on marketplace: Chargeback to seller account

#### §7. High-Value Dispute Process (Orders over $500)
- Mandatory investigation period: 5–7 business days
- Senior agent review required
- Police report may be required for theft/loss claims
- Resolution options subject to senior management approval

#### §8. Dispute Escalation Path
Standard disputes → Support Agent → Senior Agent → Manager (if unresolved in 3 days) → Legal/Compliance (for fraud or chargeback cases over $1,000)
""",
        "category": "disputes"
    },
    {
        "id": "marketplace_policy_v2",
        "title": "Marketplace Seller Policy v2.1",
        "url": "https://internal.supportiq.ai/policies/marketplace",
        "content": """
## Marketplace Seller Policy v2.1
### Last Updated: October 2024

#### §1. Seller Responsibilities
Marketplace sellers are independently responsible for:
- Accurate product listings and descriptions
- Timely order fulfillment within stated handling time
- Customer service for their orders
- Return processing per platform minimum standards

#### §2. Platform Guarantee (A-to-Z Protection)
Customers are protected by the Platform Guarantee when:
- Item is significantly different from description
- Item never arrived (seller-shipped)
- Seller is unresponsive for 48+ hours
- Refund not issued within policy window

When Platform Guarantee is triggered:
- Customer receives full refund funded by platform
- Seller charged back by platform
- Seller dispute window: 10 business days

#### §3. Seller Return Policy Override
Sellers may set stricter return windows than platform minimum (14 days):
- Seller-specific terms are visible on product page
- Customers agree to seller terms at checkout
- Platform may override seller terms in favor of customer for damaged/INAD claims

#### §4. Seller-Fulfilled vs Platform-Fulfilled
- Platform-fulfilled (FBP): All standard platform policies apply
- Seller-fulfilled: Seller return/shipping policies apply with platform minimums as floor

#### §5. Contacting Third-Party Sellers
- Initial contact via platform messaging (response SLA: 48 hours)
- If no response in 48 hours: Platform intervenes
- Support agents cannot access seller inventory or force seller actions
- Escalation to seller compliance team for repeated violations

#### §6. High-Risk Seller Categories
Additional buyer protections apply for:
- Electronics (strict DOA/defect window)
- Health supplements (no return if opened)
- International sellers (extended investigation window)
""",
        "category": "marketplace"
    },
    {
        "id": "regional_policy_us_v1",
        "title": "US Regional Policy Variations v1.2",
        "url": "https://internal.supportiq.ai/policies/regional-us",
        "content": """
## US Regional Policy Variations v1.2
### Last Updated: December 2024

#### §1. California-Specific Rules
- CA Proposition 65: Chemical warnings required; non-compliant items may be recalled
- CA Right of Return (CRRA): Extended consumer protections for defective electronics (1 year DOA)
- CA Automatic Renewal Law: Subscription cancellations must be processed within 5 business days
- CA consumers may request "do not sell my data" which affects account personalization

#### §2. New York-Specific Rules
- NY Gift Card Law: Gift cards cannot expire for 9 years; no inactivity fees in first 2 years
- NYC Consumer Protection: 20% penalty on sellers for deceptive return policies in NYC
- NY Lemon Law: Electronics DOA protection for 30 days (stricter than platform standard)

#### §3. Florida-Specific Rules
- FL Alcohol Shipping: Allowed for licensed sellers only, with age verification required
- FL Hurricane Season Flexibility: Extended return windows during declared state emergencies
- FL Homestead items: Certain household goods have additional buyer protections

#### §4. Texas-Specific Rules
- TX Sales Tax on Digital Goods: Applied at standard rate
- TX Agricultural items: Expedited customs/inspection for cross-border food items
- TX Knife Laws: Blade length restrictions affect what can be shipped

#### §5. International Shipping Restrictions by State
- Hawaii/Alaska: No same-day delivery; additional freight surcharges apply
- Puerto Rico: Treated as domestic; US shipping rates apply
- US Virgin Islands: International shipping rates apply

#### §6. APO/FPO Military Addresses
- Standard shipping only; no expedited options
- Estimated delivery: 10–21 days
- Full platform policies apply; returns processed through standard military mail
""",
        "category": "regional"
    },
    {
        "id": "fraud_security_v2",
        "title": "Fraud & Security Policy v2.0",
        "url": "https://internal.supportiq.ai/policies/fraud-security",
        "content": """
## Fraud & Security Policy v2.0
### Last Updated: January 2025

#### §1. Unauthorized Order Claims
If a customer reports an unauthorized order:
1. Immediate hold placed on shipment if not yet shipped
2. Account temporarily suspended pending investigation
3. Password reset link sent
4. Investigation: 1–3 business days
5. Confirmed fraud: Full refund; account restored or new account created

#### §2. Account Compromise Protocol
- Customer reports account breach: Immediate password reset + session invalidation
- Orders placed under compromised account within 24 hours: Eligible for reversal
- Beyond 24 hours: Case-by-case review by fraud team

#### §3. Suspicious Activity Flags
Support agents must escalate (do NOT resolve directly) if:
- Order placed from new device + new address + high-value item (>$300) in same session
- Multiple failed payment attempts followed by success
- Shipping address mismatch with billing address on first order over $200
- Customer requests refund to different payment method than original

#### §4. Agent Authority Limits
Support agents are NOT authorized to:
- Override fraud flags manually
- Issue refunds to different payment methods than original
- Reactivate banned accounts
- Access or share customer payment details
- Apply more than $50 in goodwill credits without manager approval

#### §5. Data Privacy
- Never repeat or confirm full credit card numbers, SSNs, or passwords via chat/email
- Partial card confirmation (last 4 digits only) is acceptable
- Customer identity verification required before account-level changes
- Data deletion requests processed within 30 days per GDPR/CCPA
""",
        "category": "fraud"
    },
    {
        "id": "hygiene_items_policy_v1",
        "title": "Hygiene & Personal Care Items Policy v1.3",
        "url": "https://internal.supportiq.ai/policies/hygiene-items",
        "content": """
## Hygiene & Personal Care Items Policy v1.3
### Last Updated: September 2024

#### §1. Definition of Hygiene Items
The following are classified as hygiene/personal care for policy purposes:
- Skincare (moisturizers, serums, cleansers, sunscreen)
- Haircare (shampoo, conditioner, treatments, styling tools)
- Dental care (toothbrushes, floss, mouthwash)
- Feminine hygiene products
- Razors and shaving products
- Perfume and cologne (once opened)
- Makeup and cosmetics (once opened or seal broken)
- Contact lenses and cases
- Ear/nasal care products

#### §2. Hygiene Items — Return Rules
SEALED/UNOPENED hygiene items:
- Returnable within 30 days of delivery
- Original sealed packaging required
- Full refund upon inspection

OPENED hygiene items:
- Generally NON-RETURNABLE for health and safety reasons
- Exception: Proven allergic reaction (medical documentation encouraged but not required)
- Exception: Product arrived leaking, damaged, or contaminated
- Exception: Item was materially different from description

#### §3. Allergic Reaction Policy
Customer reports allergic reaction to a product:
- Agent may approve exchange for alternative product OR store credit (no cash refund without documentation)
- If reaction is severe, advise customer to seek medical attention immediately
- Do NOT provide medical advice
- Incident logged for product safety review

#### §4. Cosmetics and Makeup — Opened Items
- Foundations, concealers, lipsticks: Non-returnable once opened
- Palette purchased with seal (sealed box): Returnable if seal intact
- Eyeshadow palettes: Non-returnable once opened (hygiene risk)
- Brushes and tools: Returnable if unused and in original packaging

#### §5. Marketplace Sellers — Hygiene Items
- Marketplace sellers must clearly disclose return policies for hygiene items on listing
- If seller policy is not disclosed, platform default (§2) applies
- Platform will not force sellers to accept returns on opened hygiene items
""",
        "category": "hygiene"
    },
    {
        "id": "electronics_policy_v3",
        "title": "Electronics Returns & Warranty Policy v3.1",
        "url": "https://internal.supportiq.ai/policies/electronics",
        "content": """
## Electronics Returns & Warranty Policy v3.1
### Last Updated: November 2024

#### §1. Electronics Return Window
- Standard: 15 days from delivery (not order date)
- Factory sealed (unopened): 30 days from delivery
- Opened and used: 15 days MAXIMUM, 15% restocking fee applies
- Marketplace electronics: Seller-specific, minimum 14 days from platform policy

#### §2. Dead on Arrival (DOA) Policy
An item is DOA if it cannot be powered on or functionally operates within the first 48 hours:
- DOA claim must be filed within 7 days of delivery
- No restocking fee applies to DOA items
- Full replacement or full refund (customer choice)
- Return shipping label provided at no cost

#### §3. Software Activation — Non-Returnable
- Items with activated software/product keys: Non-returnable
- Software keys delivered digitally: Non-returnable once displayed
- Exception: DOA or purchase error (wrong region, incompatible)

#### §4. Data Erasure Responsibility
- Customers are responsible for data deletion before returning electronics
- Platform not liable for any personal data left on returned devices
- Returns processed regardless; data disclaimer signed at return initiation

#### §5. Extended Warranty and Protection Plans
- Extended warranty claims: Processed via warranty provider, not standard support
- Support may assist in directing customer to warranty claim process
- Platform cannot override warranty decisions

#### §6. Refurbished Electronics
- Refurbished items: 90-day warranty from delivery
- Return window: 14 days (shorter than new electronics)
- DOA policy: Same as new (§2)
- Cosmetic condition disclosed at time of sale; cosmetic issues non-returnable

#### §7. Large Electronics (TVs, Appliances)
- Delivery inspection required: Note damage on delivery receipt
- Post-delivery damage claims accepted within 24 hours only
- White-glove delivery included for items over $500
- Return pickup scheduled; customer must be present
""",
        "category": "electronics"
    },
    {
        "id": "subscription_policy_v1",
        "title": "Subscription & Membership Policy v1.4",
        "url": "https://internal.supportiq.ai/policies/subscriptions",
        "content": """
## Subscription & Membership Policy v1.4
### Last Updated: October 2024

#### §1. Membership Tiers
- Standard: Monthly ($9.99/mo) or Annual ($89.99/yr)
- Premium: Monthly ($19.99/mo) or Annual ($179.99/yr)
- Enterprise: Custom pricing, contract-based

#### §2. Cancellation Rights
- Cancel anytime via account settings or by contacting support
- Monthly: Access until end of current billing month; no prorated refund
- Annual: 
  - Within first 30 days: Full refund if no premium services used
  - After 30 days: No refund; access continues until annual term ends
  - Exception: Service unavailability exceeding 72 hours; prorated refund available

#### §3. Auto-Renewal Disclosure
- Auto-renewal is ON by default
- Email reminder sent 30 days before annual renewal
- 7-day window after annual renewal charge to cancel with full refund

#### §4. Free Trial Terms
- Free trial: 30 days (credit card required)
- Cancel before day 30: No charge
- No partial trial refunds for early cancellation after charge

#### §5. Subscription Abuse
- Account sharing beyond 3 devices: Subscription terminated without refund
- Multiple accounts using same payment method: Investigation triggered

#### §6. Pausing Subscriptions
- Pause available for up to 3 months (Standard and Premium only)
- Pause available once per year
- Annual subscriptions: Pause extends term by pause duration
""",
        "category": "subscriptions"
    },
    {
        "id": "international_policy_v2",
        "title": "International Orders & Customs Policy v2.0",
        "url": "https://internal.supportiq.ai/policies/international",
        "content": """
## International Orders & Customs Policy v2.0
### Last Updated: December 2024

#### §1. International Return Policy
- Standard return window: 30 days from delivery
- Customer responsible for return shipping costs (international)
- Customs duties on returns: Customer's responsibility
- Platform will NOT reimburse import duties/taxes on returns

#### §2. Customs and Import Duties
- Import duties/taxes: Customer's responsibility upon delivery
- Platform is not responsible for customs delays
- Refused deliveries due to customs: Return to sender; customer refund minus original shipping + handling fee ($15)
- Prohibited items per destination country: Order cancelled pre-shipment with full refund

#### §3. EU Customer Rights (EU DSR)
- EU customers have statutory 14-day right of withdrawal (all items, including digital)
- Exceptions allowed by EU law: Sealed audio/video/software once unsealed; custom goods; perishables
- Refund within 14 days of receiving returned goods (or proof of return)
- Shipping refunded for EU withdrawal returns (cheapest standard option only)

#### §4. UK Post-Brexit Rules
- UK treated as international; customs duty threshold: £135
- Items under £135: Duty paid at checkout (DDP)
- Items over £135: Customer pays duty at delivery
- VAT: Collected at point of sale for all UK orders

#### §5. Canada
- Duty threshold: CAD $20 (de minimis)
- Most orders under CAD $150: Duties handled by platform
- HST/GST applied at checkout based on province

#### §6. Australia
- GST applied to all orders (10%)
- Consumer guarantees: Australian Consumer Law provides additional rights beyond platform policy
- DOA/defective: Australian law may provide longer remedies than standard 15-day window

#### §7. Restricted Countries
- Sanctions compliance: Orders to sanctioned countries automatically rejected
- Agent cannot override sanctions restrictions under any circumstances
- Restricted categories vary by destination; check compliance table before promising delivery
""",
        "category": "international"
    },
]

def get_all_policy_text():
    """Return all policies as a flat list of (id, title, url, chunk) tuples."""
    chunks = []
    for doc in POLICY_DOCUMENTS:
        sections = doc["content"].strip().split("\n\n")
        for i, section in enumerate(sections):
            if section.strip():
                chunks.append({
                    "chunk_id": f"{doc['id']}_chunk_{i}",
                    "doc_id": doc["id"],
                    "title": doc["title"],
                    "url": doc["url"],
                    "category": doc["category"],
                    "text": section.strip()
                })
    return chunks
