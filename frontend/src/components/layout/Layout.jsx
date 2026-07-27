import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import useAuthStore from '../../store/authStore'
import { 
  LayoutDashboard, Ticket, PlusCircle, BarChart3, 
  LogOut, ChevronRight, Zap, Bell, Settings, X, CheckCheck, Shield, AlertTriangle, CheckCircle, Info
} from 'lucide-react'
import toast from 'react-hot-toast'

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/resolve', icon: PlusCircle, label: 'Resolve Ticket' },
  { to: '/tickets', icon: Ticket, label: 'All Tickets' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

const INITIAL_NOTIFICATIONS = [
  { id: 1, type: 'approve', title: 'Ticket #ORD-78432 Auto-Approved', desc: 'Policy Retriever & Writer matched Returns §4.2 with 98% confidence.', time: '2m ago', read: false },
  { id: 2, type: 'escalation', title: 'Compliance Safety Flag', desc: 'Ticket #ORD-99321 flagged for missing photo proof on perishables.', time: '15m ago', read: false },
  { id: 3, type: 'system', title: 'CrewAI Multi-Agent Sync', desc: 'All 4 agents (Triage, Retriever, Writer, Compliance) are operational.', time: '1h ago', read: false },
  { id: 4, type: 'info', title: 'Policy Corpus Updated', desc: '12 policy documents updated with US regional variations v1.2.', time: '3h ago', read: false },
]

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS)

  const unreadCount = notifications.filter(n => !n.read).length

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    toast.success('All notifications marked as read')
  }

  const dismissNotif = (id) => {
    setNotifications(notifications.filter(n => n.id !== id))
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
              {(user?.name?.[0] || 'A').toUpperCase()}
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
          position: 'sticky', top: 0, zIndex: 20,
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

          {/* Notifications Trigger */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              style={{
                background: notifOpen ? 'rgba(123,92,245,0.2)' : 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10, padding: '7px 9px', color: notifOpen ? 'var(--accent-bright)' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', position: 'relative', cursor: 'pointer',
                transition: 'all 0.2s',
              }}
              title="Notifications"
            >
              <Bell size={16} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 16, height: 16, borderRadius: '50%',
                  background: '#EF4444', color: '#fff', fontSize: 10,
                  fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(239,68,68,0.6)',
                }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Drawer Modal */}
            {notifOpen && (
              <div className="fade-in" style={{
                position: 'absolute', top: 48, right: 0, width: 360,
                background: 'var(--bg-surface)', border: '1px solid var(--border-strong)',
                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-md)',
                zIndex: 100, overflow: 'hidden', backdropFilter: 'blur(20px)',
              }}>
                <div style={{
                  padding: '14px 16px', borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'rgba(20,24,40,0.8)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Bell size={15} color="var(--accent-bright)" />
                    <span style={{ fontWeight: 700, fontSize: 14 }}>Notifications</span>
                    {unreadCount > 0 && (
                      <span style={{
                        fontSize: 10, background: 'rgba(123,92,245,0.2)', color: 'var(--accent-bright)',
                        padding: '2px 6px', borderRadius: 100, fontWeight: 700,
                      }}>
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{
                          background: 'none', border: 'none', color: 'var(--accent-bright)',
                          fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                        }}
                        title="Mark all as read"
                      >
                        <CheckCheck size={14} />
                      </button>
                    )}
                    <button
                      onClick={() => setNotifOpen(false)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                    >
                      <X size={15} />
                    </button>
                  </div>
                </div>

                <div style={{ maxHeight: 360, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 24, textAlign: 'center', color: 'var(--text-muted)', fontSize: 13 }}>
                      No notifications available.
                    </div>
                  ) : (
                    notifications.map(n => {
                      const icons = {
                        approve: <CheckCircle size={15} color="#22C55E" />,
                        escalation: <AlertTriangle size={15} color="#F5A623" />,
                        system: <Shield size={15} color="#7B5CF5" />,
                        info: <Info size={15} color="#9D7FFF" />,
                      }
                      return (
                        <div key={n.id} style={{
                          padding: '12px 16px', borderBottom: '1px solid var(--border)',
                          background: n.read ? 'transparent' : 'rgba(123,92,245,0.06)',
                          display: 'flex', gap: 12, alignItems: 'flex-start',
                          transition: 'background 0.2s', position: 'relative',
                        }}>
                          <div style={{ marginTop: 2 }}>{icons[n.type] || <Info size={15} color="var(--accent)" />}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: n.read ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                              {n.title}
                            </div>
                            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2, lineHeight: 1.4 }}>
                              {n.desc}
                            </div>
                            <div style={{ fontSize: 10, color: 'var(--accent-bright)', marginTop: 4, fontWeight: 500 }}>
                              {n.time}
                            </div>
                          </div>
                          <button
                            onClick={() => dismissNotif(n.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', padding: 2, cursor: 'pointer' }}
                            title="Dismiss"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      )
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Header Settings Button */}
          <button
            onClick={() => navigate('/settings')}
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, padding: '7px 9px', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            title="Settings"
          >
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
