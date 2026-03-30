import { useState } from 'react'
import api from '../hooks/useApi'
import toast from 'react-hot-toast'
import {
  Zap, ChevronDown, ChevronUp, Send, RotateCcw,
  CheckCircle, XCircle, AlertTriangle, Clock, Shield,
  Brain, Search, FileText, Copy, Check, ExternalLink
} from 'lucide-react'

const SAMPLE_TICKETS = [
  { label: 'Melted cookies — refund', text: 'My order arrived late and the cookies are melted. I want a full refund and to keep the item.', category: 'perishable', status: 'delivered', fulfillment: 'first-party' },
  { label: 'Missing package (marked delivered)', text: 'My package shows delivered but I never received it. Tracking says it arrived 2 days ago but there is nothing at my door.', category: 'electronics', status: 'delivered', fulfillment: 'first-party' },
  { label: 'Wrong item received', text: 'I ordered a blue t-shirt size M and received a red one size L. I want a replacement.', category: 'apparel', status: 'delivered', fulfillment: 'first-party' },
  { label: 'Opened hygiene product — return', text: 'I opened the shampoo and realized I am allergic to the ingredients. I want to return it for a refund.', category: 'hygiene', status: 'delivered', fulfillment: 'first-party' },
  { label: 'Cancel shipped order', text: 'I want to cancel my order immediately. I placed it yesterday. Please stop it.', category: 'apparel', status: 'shipped', fulfillment: 'first-party' },
  { label: 'Expired coupon claim', text: 'I tried to use coupon code SAVE20 but it says expired. Can you still honor it? I just missed the deadline by one day.', category: 'general', status: 'placed', fulfillment: 'first-party' },
  { label: 'Unauthorized order — fraud', text: 'I did not place this order. Someone used my account to buy $350 worth of electronics. This is fraud!', category: 'electronics', status: 'placed', fulfillment: 'first-party' },
  { label: 'Marketplace seller — damaged item', text: 'I bought from a third-party seller on your platform and received a damaged laptop screen. The seller is not responding.', category: 'electronics', status: 'delivered', fulfillment: 'marketplace' },
]

function AgentStep({ icon: Icon, name, status, delay }) {
  const colors = { done: '#22C55E', active: '#7B5CF5', pending: 'var(--text-muted)' }
  const color = colors[status]
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, animationDelay: `${delay}ms` }} className="fade-in">
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        background: `${color}18`, border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        transition: 'all 0.3s',
      }}>
        {status === 'active'
          ? <div style={{ width: 14, height: 14, border: `2px solid ${color}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          : <Icon size={14} color={color} />
        }
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12, fontWeight: 500, color: status === 'pending' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{name}</div>
      </div>
      {status === 'done' && <CheckCircle size={13} color="#22C55E" />}
    </div>
  )
}

function DecisionBanner({ decision }) {
  const map = {
    approve: { bg: 'rgba(34,197,94,0.08)', border: '#22C55E', icon: CheckCircle, color: '#22C55E', label: 'APPROVED', sub: 'Resolution approved per policy' },
    deny: { bg: 'rgba(239,68,68,0.08)', border: '#EF4444', icon: XCircle, color: '#EF4444', label: 'DENIED', sub: 'Does not meet policy criteria' },
    partial: { bg: 'rgba(245,166,35,0.08)', border: '#F5A623', icon: AlertTriangle, color: '#F5A623', label: 'PARTIAL', sub: 'Partial resolution available' },
    needs_escalation: { bg: 'rgba(123,92,245,0.08)', border: '#9D7FFF', icon: AlertTriangle, color: '#9D7FFF', label: 'ESCALATED', sub: 'Requires senior agent review' },
  }
  const cfg = map[decision] || map.needs_escalation
  const Icon = cfg.icon
  return (
    <div style={{
      background: cfg.bg, border: `1px solid ${cfg.border}40`,
      borderRadius: 'var(--radius-sm)', padding: '14px 18px',
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      <Icon size={22} color={cfg.color} />
      <div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: cfg.color }}>{cfg.label}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{cfg.sub}</div>
      </div>
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000) }}
      style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 10px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
      {copied ? <><Check size={12} color="#22C55E" /> Copied</> : <><Copy size={12} /> Copy</>}
    </button>
  )
}

export default function ResolveTicketPage() {
  const [ticketText, setTicketText] = useState('')
  const [ctx, setCtx] = useState({
    order_id: 'ORD-78432', order_date: '2025-01-10', delivery_date: '2025-01-14',
    item_category: 'perishable', fulfillment_type: 'first-party',
    shipping_region: 'CA, USA', order_status: 'delivered', payment_method: 'credit_card',
    order_value: 24.99, item_name: 'Artisan Cookie Box',
  })
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [agentSteps, setAgentSteps] = useState({ triage: 'pending', retriever: 'pending', writer: 'pending', compliance: 'pending' })
  const [showCtx, setShowCtx] = useState(false)
  const [activeSection, setActiveSection] = useState('response')

  const setCtxField = (k, v) => setCtx(c => ({ ...c, [k]: v }))

  const loadSample = (s) => {
    setTicketText(s.text)
    setCtxField('item_category', s.category)
    setCtxField('order_status', s.status)
    setCtxField('fulfillment_type', s.fulfillment)
    setResult(null)
  }

  const simulate = async () => {
    setLoading(true)
    setResult(null)
    setAgentSteps({ triage: 'active', retriever: 'pending', writer: 'pending', compliance: 'pending' })
    await new Promise(r => setTimeout(r, 600))
    setAgentSteps({ triage: 'done', retriever: 'active', writer: 'pending', compliance: 'pending' })
    await new Promise(r => setTimeout(r, 700))
    setAgentSteps({ triage: 'done', retriever: 'done', writer: 'active', compliance: 'pending' })
    await new Promise(r => setTimeout(r, 500))
    setAgentSteps({ triage: 'done', retriever: 'done', writer: 'done', compliance: 'active' })
    await new Promise(r => setTimeout(r, 400))

    try {
      const res = await api.post('/tickets/resolve', { ticket_text: ticketText, order_context: ctx })
      setResult(res.data)
      setAgentSteps({ triage: 'done', retriever: 'done', writer: 'done', compliance: 'done' })
      toast.success('Resolution complete!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Resolution failed — is the backend running?')
      setAgentSteps({ triage: 'pending', retriever: 'pending', writer: 'pending', compliance: 'pending' })
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    background: 'var(--bg-input)', border: '1px solid var(--border-strong)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: 13, outline: 'none',
  }

  const tabStyle = (active) => ({
    padding: '7px 16px', borderRadius: 6, fontSize: 13, fontWeight: active ? 600 : 400,
    background: active ? 'rgba(123,92,245,0.15)' : 'transparent',
    color: active ? 'var(--accent-bright)' : 'var(--text-muted)',
    border: active ? '1px solid rgba(123,92,245,0.3)' : '1px solid transparent',
    cursor: 'pointer',
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Resolve Ticket</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Submit a customer support ticket and get an AI-generated, policy-grounded resolution in seconds.</p>
      </div>

      {/* Sample tickets */}
      <div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick samples</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SAMPLE_TICKETS.map(s => (
            <button key={s.label} onClick={() => loadSample(s)} style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 100, padding: '5px 14px', fontSize: 12, color: 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent-bright)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20, alignItems: 'start' }}>
        {/* Left - input */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Ticket text */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20 }}>
            <label style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500, marginBottom: 10, display: 'block' }}>
              Customer Ticket
            </label>
            <textarea
              value={ticketText} onChange={e => setTicketText(e.target.value)}
              placeholder="Paste or type the customer's support message here..."
              rows={6}
              style={{
                ...inputStyle, resize: 'vertical', lineHeight: 1.6,
                borderColor: ticketText ? 'rgba(123,92,245,0.4)' : 'var(--border-strong)',
              }}
            />
          </div>

          {/* Order context */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <button onClick={() => setShowCtx(!showCtx)} style={{
              width: '100%', padding: '14px 20px', background: 'none', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              color: 'var(--text-primary)', cursor: 'pointer',
            }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Order Context (JSON)</span>
              {showCtx ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {showCtx && (
              <div style={{ padding: '0 20px 20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, borderTop: '1px solid var(--border)' }}>
                {Object.entries(ctx).map(([k, v]) => (
                  <div key={k}>
                    <label style={{ fontSize: 11, color: 'var(--text-muted)', display: 'block', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {k.replace(/_/g, ' ')}
                    </label>
                    <input value={v ?? ''} onChange={e => setCtxField(k, e.target.value)} style={{ ...inputStyle, fontSize: 12 }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            onClick={simulate} disabled={loading || !ticketText.trim()}
            style={{
              padding: '14px',
              background: !ticketText.trim() ? 'var(--bg-card)' : 'linear-gradient(135deg, #7B5CF5, #9D7FFF)',
              border: !ticketText.trim() ? '1px solid var(--border)' : 'none',
              borderRadius: 'var(--radius-sm)', color: !ticketText.trim() ? 'var(--text-muted)' : '#fff',
              fontSize: 15, fontWeight: 600, cursor: (!ticketText.trim() || loading) ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: ticketText.trim() ? '0 4px 24px rgba(123,92,245,0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {loading
              ? <><div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> Processing through agents...</>
              : <><Zap size={17} fill="currentColor" /> Run Agent Pipeline</>
            }
          </button>
        </div>

        {/* Right - agent panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>Agent Pipeline</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <AgentStep icon={Brain} name="Triage Agent" status={agentSteps.triage} delay={0} />
              <div style={{ width: 1, height: 12, background: 'var(--border)', marginLeft: 15 }} />
              <AgentStep icon={Search} name="Policy Retriever" status={agentSteps.retriever} delay={100} />
              <div style={{ width: 1, height: 12, background: 'var(--border)', marginLeft: 15 }} />
              <AgentStep icon={FileText} name="Resolution Writer" status={agentSteps.writer} delay={200} />
              <div style={{ width: 1, height: 12, background: 'var(--border)', marginLeft: 15 }} />
              <AgentStep icon={Shield} name="Compliance Agent" status={agentSteps.compliance} delay={300} />
            </div>
          </div>

          {result && (
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 16 }}>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 10 }}>Quick Stats</div>
              {[
                { label: 'Confidence', value: `${Math.round((result.confidence_score || 0) * 100)}%`, color: '#22C55E' },
                { label: 'Processing', value: `${result.processing_time_ms}ms`, color: '#7B5CF5' },
                { label: 'Citations', value: result.citations?.length ?? 0, color: '#F5A623' },
                { label: 'Agents', value: result.agents_used?.length ?? 4, color: '#9D7FFF' },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '7px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color }}>{value}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="fade-up" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
          <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Resolution Output</h3>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
              {['response', 'rationale', 'citations', 'internal'].map(tab => (
                <button key={tab} onClick={() => setActiveSection(tab)} style={tabStyle(activeSection === tab)}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <DecisionBanner decision={result.decision} />
              {result.clarifying_questions?.length > 0 && (
                <div style={{ background: 'rgba(245,166,35,0.08)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: 'var(--radius-sm)', padding: '8px 14px' }}>
                  <div style={{ fontSize: 12, color: '#F5A623', fontWeight: 600, marginBottom: 6 }}>Clarifying Questions Needed</div>
                  {result.clarifying_questions.map((q, i) => (
                    <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', paddingLeft: 10, borderLeft: '2px solid rgba(245,166,35,0.4)' }}>{q}</div>
                  ))}
                </div>
              )}
            </div>

            {activeSection === 'response' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Customer Response Draft</div>
                  <CopyButton text={result.customer_response} />
                </div>
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', padding: '16px 20px',
                  fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.7,
                  whiteSpace: 'pre-wrap',
                }}>
                  {result.customer_response}
                </div>
              </div>
            )}

            {activeSection === 'rationale' && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Policy Rationale</div>
                <div style={{
                  background: 'var(--bg-input)', border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-sm)', padding: '16px 20px',
                  fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7,
                }}>
                  {result.rationale}
                </div>
                {result.compliance && (
                  <div style={{ marginTop: 12, padding: '12px 16px', background: result.compliance.passed ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)', border: `1px solid ${result.compliance.passed ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`, borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: result.compliance.passed ? '#22C55E' : '#EF4444', marginBottom: 4 }}>
                      <Shield size={12} style={{ marginRight: 6, verticalAlign: 'middle' }} />
                      Compliance: {result.compliance.status?.replace(/_/g, ' ').toUpperCase()}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{result.compliance.compliance_notes}</div>
                    {result.compliance.warnings?.map((w, i) => (
                      <div key={i} style={{ fontSize: 12, color: '#F5A623', marginTop: 4 }}>⚠ {w}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === 'citations' && (
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Policy Citations ({result.citations?.length ?? 0})</div>
                {result.citations?.length === 0 && (
                  <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No citations retrieved.</div>
                )}
                {result.citations?.map((c, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-input)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)', padding: '12px 16px', marginBottom: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <FileText size={13} color="var(--accent)" />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{c.doc}</span>
                      <span style={{ fontSize: 11, color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 100 }}>
                        {c.section}
                      </span>
                      {c.url && (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}>
                          <ExternalLink size={12} />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeSection === 'internal' && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Internal Notes</div>
                  <CopyButton text={result.internal_notes} />
                </div>
                <div style={{
                  background: 'rgba(123,92,245,0.05)', border: '1px solid rgba(123,92,245,0.15)',
                  borderRadius: 'var(--radius-sm)', padding: '16px 20px',
                  fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.8,
                  whiteSpace: 'pre-wrap', fontFamily: 'monospace',
                }}>
                  {result.internal_notes}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
