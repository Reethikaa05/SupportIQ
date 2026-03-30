import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../hooks/useApi'
import { ArrowRight, Search, Filter, Clock, Zap } from 'lucide-react'

function DecisionBadge({ decision }) {
  const map = {
    approve: { label: 'Approved', cls: 'badge-approve' },
    deny: { label: 'Denied', cls: 'badge-deny' },
    partial: { label: 'Partial', cls: 'badge-partial' },
    needs_escalation: { label: 'Escalated', cls: 'badge-escalation' },
  }
  const { label, cls } = map[decision] || { label: 'Pending', cls: 'badge-pending' }
  return <span className={`badge ${cls}`}>{label}</span>
}

function PriorityDot({ priority }) {
  const colors = { urgent: '#EF4444', high: '#F5A623', normal: '#22C55E', low: 'var(--text-muted)' }
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: colors[priority] || 'var(--text-muted)',
      boxShadow: `0 0 5px ${colors[priority] || 'transparent'}`,
    }} />
  )
}

export default function TicketsPage() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/tickets').then(r => setTickets(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = tickets.filter(t => {
    const matchSearch = t.ticket_text.toLowerCase().includes(search.toLowerCase()) ||
      t.classification?.type?.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'all' || t.decision === filter
    return matchSearch && matchFilter
  })

  const FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'approve', label: 'Approved' },
    { key: 'deny', label: 'Denied' },
    { key: 'needs_escalation', label: 'Escalated' },
    { key: 'partial', label: 'Partial' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>All Tickets</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{tickets.length} total tickets in your workspace</p>
        </div>
        <button onClick={() => navigate('/resolve')} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'linear-gradient(135deg, #7B5CF5, #9D7FFF)',
          border: 'none', borderRadius: 'var(--radius-sm)',
          color: '#fff', padding: '10px 18px', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', boxShadow: '0 4px 16px rgba(123,92,245,0.3)',
        }}>
          <Zap size={14} fill="#fff" /> New Ticket
        </button>
      </div>

      {/* Search & filter bar */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: 360 }}>
          <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search tickets..."
            style={{
              width: '100%', padding: '10px 12px 10px 36px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
              fontSize: 13, outline: 'none',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '7px 14px', borderRadius: 100, fontSize: 12, fontWeight: filter === f.key ? 600 : 400,
              background: filter === f.key ? 'rgba(123,92,245,0.15)' : 'var(--bg-card)',
              color: filter === f.key ? 'var(--accent-bright)' : 'var(--text-secondary)',
              border: filter === f.key ? '1px solid rgba(123,92,245,0.3)' : '1px solid var(--border)',
              cursor: 'pointer',
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '2fr 120px 120px 80px 110px 90px 40px',
          padding: '12px 20px', borderBottom: '1px solid var(--border)',
          fontSize: 11, color: 'var(--text-muted)', fontWeight: 600,
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          <span>Ticket</span><span>Type</span><span>Decision</span><span>Priority</span><span>Confidence</span><span>Time</span><span></span>
        </div>

        {loading && [...Array(5)].map((_, i) => (
          <div key={i} style={{ padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div className="skeleton" style={{ height: 14, width: '60%', borderRadius: 4 }} />
          </div>
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
            No tickets found.{search && ' Try a different search.'}
          </div>
        )}

        {!loading && filtered.map((t, i) => (
          <div key={t.id}
            onClick={() => navigate(`/tickets/${t.id}`)}
            style={{
              display: 'grid', gridTemplateColumns: '2fr 120px 120px 80px 110px 90px 40px',
              padding: '14px 20px',
              borderBottom: i < filtered.length - 1 ? '1px solid var(--border)' : 'none',
              cursor: 'pointer', transition: 'background 0.15s', alignItems: 'center',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 3 }}>
                {t.ticket_text}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {new Date(t.created_at).toLocaleDateString()} · #{t.id?.slice(0, 8)}
              </div>
            </div>
            <div>
              <span style={{
                fontSize: 11, background: 'var(--bg-surface)', border: '1px solid var(--border)',
                borderRadius: 100, padding: '3px 10px', color: 'var(--text-secondary)', textTransform: 'capitalize',
              }}>{t.classification?.type || 'unknown'}</span>
            </div>
            <div><DecisionBadge decision={t.decision} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <PriorityDot priority={t.priority} />
              <span style={{ fontSize: 12, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{t.priority}</span>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: (t.confidence_score || 0) > 0.8 ? '#22C55E' : '#F5A623' }}>
                {Math.round((t.confidence_score || 0) * 100)}%
              </div>
              <div style={{ height: 3, background: 'var(--bg-surface)', borderRadius: 2, marginTop: 4 }}>
                <div style={{ height: '100%', width: `${(t.confidence_score || 0) * 100}%`, background: (t.confidence_score || 0) > 0.8 ? '#22C55E' : '#F5A623', borderRadius: 2 }} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)', fontSize: 12 }}>
              <Clock size={11} />{((t.processing_time_ms || 0) / 1000).toFixed(1)}s
            </div>
            <ArrowRight size={14} color="var(--text-muted)" />
          </div>
        ))}
      </div>
    </div>
  )
}
