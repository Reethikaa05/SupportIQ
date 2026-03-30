import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, User, Building, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register } = useAuthStore()
  const navigate = useNavigate()

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    setLoading(true)
    try {
      await register(form.name, form.email, form.password, form.company || 'NexGen Support')
      toast.success('Workspace created! Welcome to SupportIQ.')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px 12px 42px',
    background: 'var(--bg-input)', border: '1px solid var(--border-strong)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-base)' }}>
      {/* Left panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', background: 'linear-gradient(135deg, #0A0C14 0%, #10122A 100%)',
        position: 'relative', overflow: 'hidden',
      }} className="dot-grid">
        <div style={{
          position: 'absolute', bottom: '10%', right: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(123,92,245,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative', maxWidth: 480 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
            <div style={{
              width: 44, height: 44, background: 'linear-gradient(135deg, #7B5CF5, #C084FC)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(123,92,245,0.5)'
            }}>
              <Zap size={22} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24 }}>
                Support<span className="gradient-text">IQ</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                NexGen Support
              </div>
            </div>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 46, fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            Your AI Support<br /><span className="gradient-text">Workspace Awaits</span>
          </h1>
          <p style={{ fontSize: 17, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
            Set up your team's intelligent support resolution system in minutes. Powered by CrewAI multi-agent orchestration.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { n: '4', l: 'AI Agents' },
              { n: '12+', l: 'Policy Docs' },
              { n: '98%', l: 'Citation Rate' },
              { n: '<2s', l: 'Avg Resolution' },
            ].map(({ n, l }) => (
              <div key={l} style={{
                background: 'rgba(123,92,245,0.08)', border: '1px solid rgba(123,92,245,0.15)',
                borderRadius: 12, padding: '16px 20px',
              }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 800, color: 'var(--accent-bright)' }}>{n}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - form */}
      <div style={{
        width: 480, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px', background: 'var(--bg-surface)', borderLeft: '1px solid var(--border)',
      }}>
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 700, marginBottom: 8 }}>
            Create your account
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Start resolving tickets with AI-powered precision
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {[
            { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Jane Smith' },
            { key: 'email', label: 'Work Email', icon: Mail, type: 'email', placeholder: 'jane@company.com' },
            { key: 'company', label: 'Company', icon: Building, type: 'text', placeholder: 'NexGen Support' },
          ].map(({ key, label, icon: Icon, type, placeholder }) => (
            <div key={key}>
              <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
                {label}
              </label>
              <div style={{ position: 'relative' }}>
                <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={type} value={form[key]} placeholder={placeholder}
                  onChange={e => set(key, e.target.value)}
                  required={key !== 'company'}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
                />
              </div>
            </div>
          ))}

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPw ? 'text' : 'password'} value={form.password} placeholder="Min 6 characters"
                onChange={e => set('password', e.target.value)} required
                style={{ ...inputStyle, paddingRight: 42 }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{
                position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', padding: 0,
              }}>
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 8, padding: '13px',
              background: loading ? 'rgba(123,92,245,0.5)' : 'linear-gradient(135deg, #7B5CF5, #9D7FFF)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: '#fff', fontSize: 15, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 20px rgba(123,92,245,0.35)',
            }}
          >
            {loading
              ? <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : <>Create Workspace <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 24 }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--accent-bright)', fontWeight: 500 }}>Sign in</Link>
        </p>
      </div>
    </div>
  )
}
