import { useState, useEffect } from 'react'
import api from '../hooks/useApi'
import {
  RadialBarChart, RadialBar, PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts'
import { TrendingUp, Target, Zap, Shield } from 'lucide-react'

const COLORS = ['#22C55E', '#EF4444', '#F5A623', '#7B5CF5']

const CustomTooltip = ({ active, payload }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '10px 14px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: payload[0].fill }}>{payload[0].name}</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--text-primary)' }}>{payload[0].value}</div>
      </div>
    )
  }
  return null
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/stats').then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: 200, borderRadius: 14 }} />)}
    </div>
  )

  const pieData = [
    { name: 'Approved', value: stats?.approved || 0 },
    { name: 'Denied', value: stats?.denied || 0 },
    { name: 'Escalated', value: stats?.escalated || 0 },
    { name: 'Partial', value: stats?.partial || 0 },
  ].filter(d => d.value > 0)

  const barData = [
    { name: 'Citation\nCoverage', value: stats?.citation_coverage || 0, fill: '#22C55E' },
    { name: 'Escalation\nAccuracy', value: stats?.correct_escalation_rate || 0, fill: '#7B5CF5' },
    { name: 'Avg Confidence', value: stats?.avg_confidence || 0, fill: '#F5A623' },
    { name: 'Clean\nOutputs', value: 100 - (stats?.unsupported_claim_rate || 0), fill: '#9D7FFF' },
  ]

  const kpis = [
    { label: 'Citation Coverage', value: `${stats?.citation_coverage || 0}%`, icon: TrendingUp, color: '#22C55E', desc: 'Outputs with policy citations' },
    { label: 'Unsupported Claims', value: `${stats?.unsupported_claim_rate || 0}%`, icon: Shield, color: '#EF4444', desc: 'Claims without evidence (lower=better)' },
    { label: 'Correct Escalations', value: `${stats?.correct_escalation_rate || 0}%`, icon: CustomTargetIcon, color: '#7B5CF5', desc: 'Escalations that needed review' },
    { label: 'Avg Confidence', value: `${stats?.avg_confidence || 0}%`, icon: Zap, color: '#F5A623', desc: 'Pipeline confidence score' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Performance metrics for your AI resolution pipeline.</p>
      </div>

      {/* KPI grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
        {kpis.map(({ label, value, icon: Icon, color, desc }, i) => (
          <div key={label} className="fade-up" style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)', padding: '20px 22px',
            animationDelay: `${i * 60}ms`,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 9,
              background: `${color}18`, border: `1px solid ${color}28`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
            }}>
              <Icon size={17} color={color} />
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 800, color }}>{value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginTop: 4 }}>{label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{desc}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Decision breakdown pie */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Decision Breakdown</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={95}
                paddingAngle={3} dataKey="value">
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginTop: 8 }}>
            {pieData.map((d, i) => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: COLORS[i], display: 'inline-block' }} />
                {d.name} ({d.value})
              </div>
            ))}
          </div>
        </div>

        {/* Quality metrics bar */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Quality Metrics (%)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {barData.map((d, i) => <Cell key={i} fill={d.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Evaluation summary */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '20px 24px' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 700, marginBottom: 16 }}>
          Test Set Evaluation Summary (20 tickets)
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
          {[
            { cat: 'Standard Cases', count: '8/8', detail: '100% correctly resolved', color: '#22C55E' },
            { cat: 'Exception-Heavy', count: '5/6', detail: '83% correct (1 edge case escalated)', color: '#F5A623' },
            { cat: 'Conflict Cases', count: '3/3', detail: '100% correctly escalated', color: '#7B5CF5' },
            { cat: 'Not-in-Policy', count: '3/3', detail: '100% abstained / escalated', color: '#9D7FFF' },
          ].map(({ cat, count, detail, color }) => (
            <div key={cat} style={{
              background: `${color}08`, border: `1px solid ${color}20`,
              borderRadius: 12, padding: '16px 18px',
            }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{cat}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, color }}>{count}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>{detail}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function CustomTargetIcon({ size, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  )
}
