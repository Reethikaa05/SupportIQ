import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../hooks/useApi'
import useAuthStore from '../store/authStore'
import {
  Ticket, CheckCircle, XCircle, AlertTriangle, Clock,
  TrendingUp, Zap, ArrowRight, Brain, Shield, FileText, Search
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <div className="fade-up" style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '22px 24px',
      animationDelay: `${delay}ms`,
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.2s, transform 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)' }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 100, height: 100,
        background: `radial-gradient(circle at 80% 20%, ${color}20 0%, transparent 70%)`,
      }} />
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ fontSize: 28, fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color, marginTop: 6, fontWeight: 500 }}>{sub}</div>}
    </div>
  )
}

function AgentCard({ icon: Icon, name, desc, color, delay }) {
  return (
    <div className="fade-up" style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '18px 20px',
      display: 'flex', alignItems: 'flex-start', gap: 14,
      animationDelay: `${delay}ms`,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{name}</div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>{desc}</div>
      </div>
      <div style={{
        marginLeft: 'auto', flexShrink: 0,
        width: 8, height: 8, borderRadius: '50%',
        background: '#22C55E',
        boxShadow: '0 0 8px #22C55E',
        marginTop: 4,
      }} />
    </div>
  )
}

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

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      api.get('/dashboard/stats'),
      api.get('/dashboard/recent-activity'),
    ]).then(([s, a]) => {
      setStats(s.data)
      setActivity(a.data)
    }).finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14 }} />
      ))}
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 800, marginBottom: 6 }}>
            {greeting}, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Your AI agents are online and ready to resolve tickets.
          </p>
        </div>
        <button
          onClick={() => navigate('/resolve')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #7B5CF5, #9D7FFF)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            color: '#fff', padding: '11px 20px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(123,92,245,0.35)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Zap size={15} fill="#fff" />
          Resolve New Ticket
        </button>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard icon={Ticket} label="Total Tickets" value={stats?.total_tickets ?? 0} sub="All time" color="#7B5CF5" delay={0} />
        <StatCard icon={CheckCircle} label="Approved" value={stats?.approved ?? 0} sub={`${stats ? Math.round(stats.approved / stats.total_tickets * 100) : 0}% of total`} color="#22C55E" delay={80} />
        <StatCard icon={XCircle} label="Denied" value={stats?.denied ?? 0} sub="Policy-grounded" color="#EF4444" delay={160} />
        <StatCard icon={AlertTriangle} label="Escalated" value={stats?.escalated ?? 0} sub="Needs senior review" color="#F5A623" delay={240} />
      </div>

      {/* Performance metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Citation Coverage', value: `${stats?.citation_coverage ?? 0}%`, sub: 'Policy sources cited', color: '#22C55E', icon: FileText },
          { label: 'Avg Resolution', value: `${((stats?.avg_resolution_time_ms ?? 0) / 1000).toFixed(1)}s`, sub: 'Agent pipeline speed', color: '#7B5CF5', icon: Clock },
          { label: 'Escalation Accuracy', value: `${stats?.correct_escalation_rate ?? 0}%`, sub: 'Correct escalations', color: '#F5A623', icon: TrendingUp },
        ].map(({ label, value, sub, color, icon: Icon }, i) => (
          <div key={label} className="fade-up" style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            animationDelay: `${320 + i * 60}ms`,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 12,
              background: `${color}15`, border: `1px solid ${color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={20} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
              <div style={{ fontSize: 11, color, marginTop: 2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Recent activity */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', overflow: 'hidden',
        }}>
          <div style={{
            padding: '18px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Recent Activity</h3>
            <button onClick={() => navigate('/tickets')} style={{
              background: 'none', border: 'none', color: 'var(--accent-bright)',
              fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
            }}>
              View all <ArrowRight size={13} />
            </button>
          </div>
          <div>
            {activity.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--text-muted)', fontSize: 14 }}>
                No activity yet. Resolve your first ticket!
              </div>
            ) : activity.map((a, i) => (
              <div key={a.id} style={{
                padding: '14px 24px',
                borderBottom: i < activity.length - 1 ? '1px solid var(--border)' : 'none',
                display: 'flex', alignItems: 'center', gap: 14,
                transition: 'background 0.2s', cursor: 'pointer',
              }}
                onClick={() => navigate(`/tickets/${a.id}`)}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <DecisionBadge decision={a.decision} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {a.detail}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
                    {new Date(a.time).toLocaleDateString()} · {a.action}
                  </div>
                </div>
                <ArrowRight size={13} color="var(--text-muted)" />
              </div>
            ))}
          </div>
        </div>

        {/* Agent status */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', overflow: 'hidden',
        }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Agent Pipeline</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>All 4 agents operational</p>
          </div>
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            <AgentCard icon={Brain} name="Triage Agent" desc="Classifies issue type & urgency" color="#7B5CF5" delay={100} />
            <AgentCard icon={Search} name="Policy Retriever" desc="Vector search over 12+ policy docs" color="#22C55E" delay={150} />
            <AgentCard icon={FileText} name="Resolution Writer" desc="Drafts grounded, cited responses" color="#F5A623" delay={200} />
            <AgentCard icon={Shield} name="Compliance Agent" desc="Validates citations & safety" color="#EF4444" delay={250} />
          </div>
        </div>
      </div>
    </div>
  )
}
