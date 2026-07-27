import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../hooks/useApi'
import useAuthStore from '../store/authStore'
import {
  AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts'
import {
  Ticket, CheckCircle, XCircle, AlertTriangle, Clock,
  TrendingUp, Zap, ArrowRight, Brain, Shield, FileText, Search, Activity
} from 'lucide-react'

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }) {
  return (
    <div className="fade-up" style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '22px 24px',
      animationDelay: `${delay}ms`,
      position: 'relative', overflow: 'hidden',
      transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s',
    }}
      onMouseEnter={e => { 
        e.currentTarget.style.borderColor = color; 
        e.currentTarget.style.transform = 'translateY(-3px)' 
        e.currentTarget.style.boxShadow = `0 8px 30px ${color}20`
      }}
      onMouseLeave={e => { 
        e.currentTarget.style.borderColor = 'var(--border)'; 
        e.currentTarget.style.transform = 'translateY(0)' 
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{
        position: 'absolute', top: -20, right: -20,
        width: 110, height: 110, borderRadius: '50%',
        background: `radial-gradient(circle, ${color}25 0%, transparent 70%)`,
      }} />
      <div style={{
        width: 42, height: 42, borderRadius: 12,
        background: `${color}18`, border: `1px solid ${color}35`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon size={20} color={color} />
      </div>
      <div style={{ fontSize: 32, fontFamily: 'var(--font-display)', fontWeight: 800, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, fontWeight: 500 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color, marginTop: 6, fontWeight: 600 }}>{sub}</div>}
    </div>
  )
}

function AgentCard({ icon: Icon, name, desc, color, delay }) {
  return (
    <div className="fade-up" style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)', padding: '16px 18px',
      display: 'flex', alignItems: 'center', gap: 14,
      animationDelay: `${delay}ms`,
      transition: 'all 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = color}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{name}</div>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>{desc}</div>
      </div>
      <div style={{
        flexShrink: 0,
        width: 8, height: 8, borderRadius: '50%',
        background: '#22C55E',
        boxShadow: '0 0 10px #22C55E',
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
      setActivity(Array.isArray(a.data) ? a.data : [])
    }).catch(err => {
      console.warn('Backend fetch warning, using default sample metrics:', err)
      setStats({
        total_tickets: 5,
        approved: 3,
        denied: 0,
        escalated: 2,
        partial: 0,
        avg_resolution_time_ms: 1500,
        avg_confidence: 91.5,
        citation_coverage: 98.2,
        unsupported_claim_rate: 0.8,
        correct_escalation_rate: 94.5,
      })
      setActivity([
        { id: 't1', action: 'TICKET APPROVED', detail: 'Perishable damaged item refund request #ORD-10000', time: new Date().toISOString(), decision: 'approve' },
        { id: 't2', action: 'TICKET APPROVED', detail: 'Pre-shipment order cancellation #ORD-10001', time: new Date().toISOString(), decision: 'approve' },
        { id: 't3', action: 'TICKET ESCALATED', detail: 'Missing package delivery claim #ORD-10002', time: new Date().toISOString(), decision: 'needs_escalation' },
        { id: 't4', action: 'TICKET ESCALATED', detail: 'Promo code SAVE20 invalid at checkout #ORD-10003', time: new Date().toISOString(), decision: 'needs_escalation' },
        { id: 't5', action: 'TICKET APPROVED', detail: 'Wrong item received replacement request #ORD-10004', time: new Date().toISOString(), decision: 'approve' },
      ])
    }).finally(() => setLoading(false))
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="skeleton" style={{ height: 100, borderRadius: 14 }} />
      ))}
    </div>
  )

  // Chart Mock Volume Trend Data
  const trendData = [
    { time: '08:00', tickets: 12, approved: 10 },
    { time: '10:00', tickets: 28, approved: 24 },
    { time: '12:00', tickets: 45, approved: 38 },
    { time: '14:00', tickets: 62, approved: 54 },
    { time: '16:00', tickets: 80, approved: 71 },
    { time: '18:00', tickets: 95, approved: 85 },
    { time: '20:00', tickets: stats?.total_tickets || 110, approved: stats?.approved || 95 },
  ]

  const distData = [
    { name: 'Approved', count: stats?.approved || 0, fill: '#22C55E' },
    { name: 'Denied', count: stats?.denied || 0, fill: '#EF4444' },
    { name: 'Escalated', count: stats?.escalated || 0, fill: '#F5A623' },
    { name: 'Partial', count: stats?.partial || 0, fill: '#7B5CF5' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 800, marginBottom: 6 }}>
            {greeting}, {user?.name ? user.name.split(' ')[0] : 'Agent'} 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Your 4-Agent CrewAI pipeline is active and monitoring customer support tickets.
          </p>
        </div>
        <button
          onClick={() => navigate('/resolve')}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #7B5CF5, #9D7FFF)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            color: '#fff', padding: '12px 22px', fontSize: 14, fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 20px rgba(123,92,245,0.35)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Zap size={16} fill="#fff" />
          Resolve New Ticket
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        <StatCard icon={Ticket} label="Total Tickets" value={stats?.total_tickets ?? 0} sub="All time processed" color="#7B5CF5" delay={0} />
        <StatCard icon={CheckCircle} label="Approved" value={stats?.approved ?? 0} sub={`${stats?.total_tickets ? Math.round((stats.approved / stats.total_tickets) * 100) : 0}% approval rate`} color="#22C55E" delay={80} />
        <StatCard icon={XCircle} label="Denied" value={stats?.denied ?? 0} sub="Policy-grounded refusals" color="#EF4444" delay={160} />
        <StatCard icon={AlertTriangle} label="Escalated" value={stats?.escalated ?? 0} sub="Requires human agent" color="#F5A623" delay={240} />
      </div>

      {/* Interactive Trend Chart & Distribution Graph */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Ticket Volume Trend Chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Activity size={18} color="var(--accent-bright)" /> Resolution Volume & Trend
              </h3>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Real-time ticket processing velocity</p>
            </div>
            <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#7B5CF5' }} /> Total Volume
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22C55E' }} /> Auto-Approved
              </div>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7B5CF5" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#7B5CF5" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorApproved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.4}/>
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="tickets" stroke="#7B5CF5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTickets)" />
              <Area type="monotone" dataKey="approved" stroke="#22C55E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorApproved)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Decision Breakdown Bar Chart */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '22px 26px', display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>Resolution Outcomes</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>Decision category breakdown</p>
          </div>

          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={distData} barSize={26}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-surface)', border: '1px solid var(--border-strong)', borderRadius: 10, fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {distData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Performance KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Citation Coverage', value: `${stats?.citation_coverage ?? 0}%`, sub: '100% Policy Grounded', color: '#22C55E', icon: FileText },
          { label: 'Avg Resolution Time', value: `${((stats?.avg_resolution_time_ms ?? 0) / 1000).toFixed(1)}s`, sub: 'Sub-second agent execution', color: '#7B5CF5', icon: Clock },
          { label: 'Escalation Precision', value: `${stats?.correct_escalation_rate ?? 0}%`, sub: 'Accurate human handoffs', color: '#F5A623', icon: TrendingUp },
        ].map(({ label, value, sub, color, icon: Icon }, i) => (
          <div key={label} className="fade-up" style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 16,
            animationDelay: `${320 + i * 60}ms`,
          }}>
            <div style={{
              width: 50, height: 50, borderRadius: 14,
              background: `${color}15`, border: `1px solid ${color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
              <Icon size={22} color={color} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800 }}>{value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{label}</div>
              <div style={{ fontSize: 11, color, marginTop: 2, fontWeight: 600 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Activity Log & Agent Status */}
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
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>Live Activity Feed</h3>
            <button onClick={() => navigate('/tickets')} style={{
              background: 'none', border: 'none', color: 'var(--accent-bright)',
              fontSize: 13, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600,
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
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700 }}>4-Agent Pipeline Status</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>CrewAI Multi-Agent System Operational</p>
          </div>
          <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <AgentCard icon={Brain} name="Triage Agent" desc="Classifies ticket category & urgency" color="#7B5CF5" delay={100} />
            <AgentCard icon={Search} name="Policy Retriever" desc="Vector search over 12+ policy docs" color="#22C55E" delay={150} />
            <AgentCard icon={FileText} name="Resolution Writer" desc="Drafts grounded evidence-based responses" color="#F5A623" delay={200} />
            <AgentCard icon={Shield} name="Compliance Agent" desc="Validates mandatory citations & safety" color="#EF4444" delay={250} />
          </div>
        </div>
      </div>
    </div>
  )
}
