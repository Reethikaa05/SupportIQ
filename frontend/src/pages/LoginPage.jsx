import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Zap, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('demo@supportiq.ai')
  const [password, setPassword] = useState('demo1234')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      navigate('/dashboard')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', background: 'var(--bg-base)',
      fontFamily: 'var(--font-body)',
    }}>
      {/* Left - hero panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '60px', position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(135deg, #0A0C14 0%, #10122A 100%)',
      }} className="dot-grid">
        {/* Glow orb */}
        <div style={{
          position: 'absolute', top: '20%', left: '30%',
          width: 500, height: 500,
          background: 'radial-gradient(circle, rgba(123,92,245,0.18) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        
        <div style={{ position: 'relative', maxWidth: 480 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 56 }}>
            <div style={{
              width: 44, height: 44,
              background: 'linear-gradient(135deg, #7B5CF5, #C084FC)',
              borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 30px rgba(123,92,245,0.5)'
            }}>
              <Zap size={22} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em' }}>
                Support<span className="gradient-text">IQ</span>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                NexGen Support
              </div>
            </div>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 52, fontWeight: 800, lineHeight: 1.1, marginBottom: 20 }}>
            AI-Powered<br />
            <span className="gradient-text">Support Resolution</span>
          </h1>
          
          <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 48 }}>
            Resolve customer tickets in seconds with multi-agent AI — policy-grounded, citation-backed, and always compliant.
          </p>

          {/* Feature pills */}
          {['4-Agent AI Pipeline', 'Citation-Backed Decisions', 'Zero Hallucination Controls', '98.2% Citation Coverage'].map(f => (
            <div key={f} style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(123,92,245,0.1)', border: '1px solid rgba(123,92,245,0.2)',
              borderRadius: 100, padding: '6px 14px', marginRight: 8, marginBottom: 8,
              fontSize: 13, color: 'var(--accent-bright)'
            }}>
              <span style={{ width: 5, height: 5, background: 'var(--accent)', borderRadius: '50%', flexShrink: 0 }} />
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right - auth form */}
      <div style={{
        width: 460, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '48px 48px', background: 'var(--bg-surface)',
        borderLeft: '1px solid var(--border)',
      }}>
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            Welcome back
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
            Sign in to your SupportIQ workspace
          </p>
        </div>

        {/* Demo hint */}
        <div style={{
          background: 'rgba(123,92,245,0.08)', border: '1px solid rgba(123,92,245,0.2)',
          borderRadius: 'var(--radius-sm)', padding: '10px 14px',
          fontSize: 13, color: 'var(--accent-bright)', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Zap size={14} />
          <span>Demo credentials pre-filled — just click Sign In</span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Email */}
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
              Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="agent@company.com"
                style={{
                  width: '100%', padding: '12px 14px 12px 42px',
                  background: 'var(--bg-input)', border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                  fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--accent)'}
                onBlur={e => e.target.style.borderColor = 'var(--border-strong)'}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{ display: 'block', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                style={{
                  width: '100%', padding: '12px 42px 12px 42px',
                  background: 'var(--bg-input)', border: '1px solid var(--border-strong)',
                  borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                  fontSize: 14, outline: 'none', transition: 'border-color 0.2s',
                }}
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

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            style={{
              marginTop: 8, padding: '13px',
              background: loading ? 'rgba(123,92,245,0.5)' : 'linear-gradient(135deg, #7B5CF5, #9D7FFF)',
              border: 'none', borderRadius: 'var(--radius-sm)',
              color: '#fff', fontSize: 15, fontWeight: 600,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              boxShadow: '0 4px 20px rgba(123,92,245,0.35)',
            }}
          >
            {loading ? (
              <div style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : <>Sign In <ArrowRight size={16} /></>}
          </button>
        </form>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 13, marginTop: 24 }}>
          No account?{' '}
          <Link to="/register" style={{ color: 'var(--accent-bright)', fontWeight: 500 }}>
            Create workspace
          </Link>
        </p>
      </div>
    </div>
  )
}
