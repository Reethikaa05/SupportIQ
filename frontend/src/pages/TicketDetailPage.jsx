import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../hooks/useApi'
import { ArrowLeft, FileText, Shield, Copy, Check, ExternalLink, Brain, Search } from 'lucide-react'

function Section({ title, children }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
      <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700 }}>{title}</h3>
      </div>
      <div style={{ padding: '16px 20px' }}>{children}</div>
    </div>
  )
}

function CopyBtn({ text }) {
  const [c, setC] = useState(false)
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setC(true); setTimeout(() => setC(false), 2000) }}
      style={{ background: 'none', border: '1px solid var(--border)', borderRadius: 6, padding: '4px 10px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
      {c ? <><Check size={12} color="#22C55E" /> Copied</> : <><Copy size={12} /> Copy</>}
    </button>
  )
}

export default function TicketDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/tickets/${id}`).then(r => setTicket(r.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />)}
    </div>
  )

  if (!ticket) return (
    <div style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>Ticket not found.</div>
  )

  const decisionColors = {
    approve: '#22C55E', deny: '#EF4444', partial: '#F5A623', needs_escalation: '#9D7FFF'
  }
  const dc = decisionColors[ticket.decision] || '#9D7FFF'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Back */}
      <button onClick={() => navigate('/tickets')} style={{
        background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, alignSelf: 'flex-start',
      }}>
        <ArrowLeft size={15} /> Back to Tickets
      </button>

      {/* Header */}
      <div className="fade-up" style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-md)', padding: '20px 24px',
        display: 'flex', alignItems: 'flex-start', gap: 20,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, flexShrink: 0,
          background: `${dc}15`, border: `1px solid ${dc}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 800, color: dc,
        }}>
          {ticket.decision === 'approve' ? '✓' : ticket.decision === 'deny' ? '✗' : '↑'}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'monospace' }}>#{ticket.ticket_id?.slice(0, 12)}</span>
            <span className={`badge badge-${ticket.decision === 'needs_escalation' ? 'escalation' : ticket.decision}`}>
              {ticket.decision?.replace('_', ' ').toUpperCase()}
            </span>
            {ticket.classification?.type && (
              <span style={{ fontSize: 11, background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 100, padding: '2px 10px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {ticket.classification.type}
              </span>
            )}
          </div>
          <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{ticket.ticket_text}</p>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontFamily: 'var(--font-display)', fontWeight: 800, color: dc }}>
            {Math.round((ticket.confidence_score || 0) * 100)}%
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>confidence</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Customer Response */}
        <Section title="Customer Response Draft">
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
            <CopyBtn text={ticket.customer_response} />
          </div>
          <div style={{
            background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 8,
            padding: '14px 16px', fontSize: 13, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--text-secondary)',
          }}>
            {ticket.customer_response}
          </div>
        </Section>

        {/* Rationale */}
        <Section title="Policy Rationale">
          <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
            {ticket.rationale}
          </div>
        </Section>

        {/* Citations */}
        <Section title={`Policy Citations (${ticket.citations?.length ?? 0})`}>
          {ticket.citations?.length === 0 && <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>No citations.</div>}
          {ticket.citations?.map((c, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', background: 'var(--bg-input)', border: '1px solid var(--border)',
              borderRadius: 8, marginBottom: 8,
            }}>
              <FileText size={14} color="var(--accent)" />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{c.doc}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.section}</div>
              </div>
              {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)' }}><ExternalLink size={13} /></a>}
            </div>
          ))}
        </Section>

        {/* Internal Notes */}
        <Section title="Internal Notes">
          <div style={{
            background: 'rgba(123,92,245,0.05)', border: '1px solid rgba(123,92,245,0.15)',
            borderRadius: 8, padding: '14px 16px',
            fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', fontFamily: 'monospace', lineHeight: 1.8,
          }}>
            {ticket.internal_notes}
          </div>
        </Section>
      </div>

      {/* Agent pipeline + order context */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <Section title="Agent Pipeline Used">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {(ticket.agents_used || ['TriageAgent', 'PolicyRetrieverAgent', 'ResolutionWriterAgent', 'ComplianceAgent']).map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: 'var(--bg-input)', borderRadius: 8 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 6px #22C55E' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: 'monospace' }}>{a}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: '#22C55E' }}>✓ done</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Order Context">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {Object.entries(ticket.order_context || {}).filter(([, v]) => v).map(([k, v]) => (
              <div key={k}>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{k.replace(/_/g, ' ')}</div>
                <div style={{ fontSize: 12, color: 'var(--text-primary)' }}>{String(v)}</div>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
