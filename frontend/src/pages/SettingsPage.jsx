import { useState } from 'react'
import { 
  Settings, Sliders, Shield, Bell, Key, Database, Zap, 
  Check, RefreshCw, Cpu, Server, Lock, Eye, AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('ai')
  const [saving, setSaving] = useState(false)

  // AI Configuration State
  const [aiConfig, setAiConfig] = useState({
    confidenceThreshold: 0.85,
    topKChunks: 4,
    autoEscalationSensitivity: 'Medium',
    guardrailRigor: 'Strict',
    modelProvider: 'CrewAI Multi-Agent (FastAPI)',
    temperature: 0.2,
  })

  // Safety & Guardrails State
  const [safetyConfig, setSafetyConfig] = useState({
    piiRedaction: true,
    pciScanner: true,
    fraudDetectionOverride: true,
    guaranteeFilter: true,
    citationRequired: true,
  })

  // Notifications State
  const [notifConfig, setNotifConfig] = useState({
    emailAlerts: true,
    escalationNotif: true,
    dailySummary: false,
    slackWebhook: 'https://hooks.slack.com/services/supportiq/notifications',
  })

  const handleSave = (section) => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      toast.success(`${section} settings saved successfully!`)
    }, 600)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Page Header */}
      <div className="fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
            System Settings & Controls
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Configure multi-agent parameters, safety guardrails, notifications, and model preferences.
          </p>
        </div>
        <button
          onClick={() => handleSave(activeTab.toUpperCase())}
          disabled={saving}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'linear-gradient(135deg, #7B5CF5, #9D7FFF)',
            border: 'none', borderRadius: 'var(--radius-sm)',
            color: '#fff', padding: '10px 20px', fontSize: 14, fontWeight: 600,
            cursor: saving ? 'wait' : 'pointer',
            boxShadow: '0 4px 20px rgba(123,92,245,0.35)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={e => !saving && (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={e => !saving && (e.currentTarget.style.transform = 'scale(1)')}
        >
          {saving ? <RefreshCw size={15} className="spin" /> : <Check size={15} />}
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 24 }}>
        {/* Navigation Sidebar */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: 12, display: 'flex', flexDirection: 'column', gap: 4,
          height: 'fit-content',
        }}>
          {[
            { id: 'ai', label: 'AI Agent Parameters', icon: Sliders },
            { id: 'safety', label: 'Safety & Guardrails', icon: Shield },
            { id: 'notifications', label: 'Notifications & Webhooks', icon: Bell },
            { id: 'api', label: 'API Keys & Engine', icon: Key },
            { id: 'knowledge', label: 'Policy Corpus Store', icon: Database },
          ].map(({ id, label, icon: Icon }) => {
            const active = activeTab === id
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '11px 14px', borderRadius: 'var(--radius-sm)',
                  border: 'none', background: active ? 'rgba(123,92,245,0.15)' : 'transparent',
                  color: active ? 'var(--accent-bright)' : 'var(--text-secondary)',
                  fontSize: 13, fontWeight: active ? 600 : 400,
                  textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                }}
              >
                <Icon size={16} color={active ? 'var(--accent-bright)' : 'var(--text-muted)'} />
                {label}
              </button>
            )
          })}
        </div>

        {/* Tab Contents */}
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: '24px 28px',
        }}>
          {activeTab === 'ai' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Agent Pipeline Tuning</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Adjust thresholds for triage, retriever, and writer agents.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {/* Confidence Threshold */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontSize: 14, fontWeight: 600 }}>Minimum Confidence Threshold</label>
                    <span style={{ fontSize: 13, color: 'var(--accent-bright)', fontWeight: 700 }}>
                      {(aiConfig.confidenceThreshold * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.01"
                    value={aiConfig.confidenceThreshold}
                    onChange={e => setAiConfig({ ...aiConfig, confidenceThreshold: parseFloat(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    Tickets with confidence below this threshold will automatically flag for human escalation.
                  </div>
                </div>

                {/* Top-K Chunks */}
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                    Policy Retriever Top-K Chunks
                  </label>
                  <select
                    value={aiConfig.topKChunks}
                    onChange={e => setAiConfig({ ...aiConfig, topKChunks: parseInt(e.target.value) })}
                    style={{
                      width: '100%', padding: '10px 14px', background: 'var(--bg-input)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)', fontSize: 14, outline: 'none',
                    }}
                  >
                    <option value={2}>2 Chunks (Fastest / Concise)</option>
                    <option value={4}>4 Chunks (Recommended Standard)</option>
                    <option value={6}>6 Chunks (Comprehensive Coverage)</option>
                  </select>
                </div>

                {/* Guardrail Rigor */}
                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                    Guardrail Enforcement Rigor
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {['Standard', 'Strict', 'Maximum Safe'].map(level => {
                      const sel = aiConfig.guardrailRigor === level
                      return (
                        <div
                          key={level}
                          onClick={() => setAiConfig({ ...aiConfig, guardrailRigor: level })}
                          style={{
                            padding: '14px', borderRadius: 'var(--radius-sm)',
                            border: sel ? '1px solid var(--accent)' : '1px solid var(--border)',
                            background: sel ? 'rgba(123,92,245,0.12)' : 'var(--bg-input)',
                            cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                          }}
                        >
                          <div style={{ fontSize: 13, fontWeight: 600, color: sel ? 'var(--accent-bright)' : 'var(--text-primary)' }}>
                            {level}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                            {level === 'Strict' ? 'Mandatory citation & PII check' : level === 'Standard' ? 'Balanced checks' : 'Zero tolerance policy'}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'safety' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Compliance & Safety Rules</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Configure zero-hallucination guardrails and PII protection filters.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[
                  { key: 'piiRedaction', title: 'PII Data Redaction (Regex Scanner)', desc: 'Automatically redacts SSNs, phone numbers, and address patterns from public responses.' },
                  { key: 'pciScanner', title: 'PCI Credit Card Masking', desc: 'Detects and masks 16-digit payment card numbers in ticket context and logs.' },
                  { key: 'fraudDetectionOverride', title: 'Fraud Signal Auto-Escalation', desc: 'Immediately escalates high-risk order patterns regardless of agent writer decision.' },
                  { key: 'guaranteeFilter', title: 'Absolute Guarantee Neutralizer', desc: 'Softens rigid promotional promises or non-policy verbal guarantees.' },
                  { key: 'citationRequired', title: 'Mandatory Policy Citation Check', desc: 'Rejects agent drafts if 0 policy document sections are referenced.' },
                ].map(({ key, title, desc }) => (
                  <div key={key} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '14px 18px', background: 'var(--bg-input)', border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={safetyConfig[key]}
                      onChange={e => setSafetyConfig({ ...safetyConfig, [key]: e.target.checked })}
                      style={{ width: 18, height: 18, accentColor: 'var(--accent)', cursor: 'pointer' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Notifications & Webhooks</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Receive real-time alerts when tickets are escalated or policy exceptions occur.</p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    { key: 'emailAlerts', title: 'Email Notifications for Critical Escalations', desc: 'Receive instant email when human review is required.' },
                    { key: 'escalationNotif', title: 'In-App Toast Alerts', desc: 'Show toast notifications whenever an agent auto-resolves a ticket.' },
                    { key: 'dailySummary', title: 'Daily Resolution Digest', desc: 'Send daily performance and confidence metrics report.' },
                  ].map(({ key, title, desc }) => (
                    <div key={key} style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '14px 18px', background: 'var(--bg-input)', border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-sm)',
                    }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{title}</div>
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{desc}</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifConfig[key]}
                        onChange={e => setNotifConfig({ ...notifConfig, [key]: e.target.checked })}
                        style={{ width: 18, height: 18, accentColor: 'var(--accent)', cursor: 'pointer' }}
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 8 }}>
                    Slack / Webhook Notification URL
                  </label>
                  <input
                    type="text"
                    value={notifConfig.slackWebhook}
                    onChange={e => setNotifConfig({ ...notifConfig, slackWebhook: e.target.value })}
                    style={{
                      width: '100%', padding: '10px 14px', background: 'var(--bg-input)',
                      border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)',
                      color: 'var(--text-primary)', fontSize: 13, outline: 'none',
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>API Engine & Keys</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>System connection status and multi-agent backend engine.</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 18, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--accent-bright)' }}>
                    <Server size={16} /> Backend Host
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>http://localhost:8000</div>
                  <div style={{ fontSize: 11, color: '#22C55E', marginTop: 4, fontWeight: 600 }}>● FastAPI Connected</div>
                </div>

                <div style={{ padding: 18, background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 600, color: 'var(--accent-bright)' }}>
                    <Cpu size={16} /> Inference Engine
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 700, marginTop: 8 }}>HuggingFace / OpenAI Model</div>
                  <div style={{ fontSize: 11, color: '#22C55E', marginTop: 4, fontWeight: 600 }}>● Active API Token Loaded</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Policy Knowledge Base Status</h3>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>12 Active Policy Documents (~25,000+ words).</p>
              </div>

              <div style={{ padding: 18, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#22C55E', fontWeight: 700, fontSize: 14 }}>
                  <Check size={18} /> Paragraph-Level Semantic Chunking Engine Synced
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 6 }}>
                  Vector index updated automatically. All policy documents undergo section boundary validation before retrieval indexing.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
