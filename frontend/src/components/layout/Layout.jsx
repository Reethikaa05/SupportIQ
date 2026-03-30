import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { 
  LayoutDashboard, Ticket, PlusCircle, BarChart3, 
  LogOut, ChevronRight, Zap, Menu, X, Bell, Settings
} from 'lucide-react'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resolve', icon: PlusCircle, label: 'Resolve Ticket' },
  { to: '/tickets', icon: Ticket, label: 'All Tickets' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        position: 'relative',
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 24px 20px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'linear-gradient(135deg, #7B5CF5, #C084FC)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 20px rgba(123,92,245,0.4)'
            }}>
              <Zap size={18} color="#fff" fill="#fff" />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 18, letterSpacing: '-0.02em' }}>
                Support<span className="gradient-text">IQ</span>
              </div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: -2 }}>
                Purple Merit Tech
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 'var(--radius-sm)',
              color: isActive ? 'var(--accent-bright)' : 'var(--text-secondary)',
              background: isActive ? 'rgba(123,92,245,0.12)' : 'transparent',
              transition: 'all 0.2s',
              fontSize: 14,
              fontWeight: isActive ? 500 : 400,
              textDecoration: 'none',
              position: 'relative',
            })}>
              {({ isActive }) => (<>
                {isActive && (
                  <span style={{
                    position: 'absolute', left: 0, top: '20%', bottom: '20%',
                    width: 3, background: 'var(--accent)', borderRadius: '0 3px 3px 0'
                  }} />
                )}
                <Icon size={17} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
              </>)}
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div style={{ padding: '16px', borderTop: '1px solid var(--border)' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border)',
          }}>
            <div style={{
              width: 34, height: 34,
              background: 'linear-gradient(135deg, #7B5CF5, #9D7FFF)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user?.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{user?.role?.replace('_', ' ')}</div>
            </div>
            <button onClick={handleLogout} style={{
              background: 'none', border: 'none', color: 'var(--text-muted)', padding: 4,
              borderRadius: 6, display: 'flex', alignItems: 'center',
              transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#EF4444'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
              title="Logout"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
        {/* Top bar */}
        <header style={{
          height: 60, borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
          padding: '0 28px', gap: 12, flexShrink: 0,
          background: 'var(--bg-base)',
          position: 'sticky', top: 0, zIndex: 5,
        }}>
          <div style={{
            padding: '5px 12px',
            background: 'rgba(123,92,245,0.1)',
            border: '1px solid rgba(123,92,245,0.25)',
            borderRadius: 100,
            fontSize: 11, color: 'var(--accent-bright)',
            fontWeight: 600, letterSpacing: '0.04em',
          }}>
            ● AI AGENTS ONLINE
          </div>
          <button style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '7px 9px', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center',
          }}>
            <Bell size={16} />
          </button>
          <button style={{
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 10, padding: '7px 9px', color: 'var(--text-secondary)',
            display: 'flex', alignItems: 'center',
          }}>
            <Settings size={16} />
          </button>
        </header>

        {/* Page content */}
        <div style={{ flex: 1, padding: '28px', maxWidth: 1400, width: '100%', margin: '0 auto' }} className="dot-grid">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
