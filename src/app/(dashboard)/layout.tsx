'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Notification } from '@/lib/types'

const navItems = {
  student: [
    { label: 'Dashboard', icon: '🏠', href: '/student' },
    { label: 'My Courses', icon: '📚', href: '/student/courses' },
    { label: 'Schedule', icon: '📅', href: '/student/schedule' },
    { label: 'Assignments', icon: '📝', href: '/student/assignments' },
    { label: 'Quizzes', icon: '❓', href: '/student/quizzes' },
    { label: 'Exam Prep', icon: '🎯', href: '/student/exam-prep' },
    { label: 'Messages', icon: '💬', href: '/student/messages' },
  ],
  parent: [
    { label: 'Dashboard', icon: '🏠', href: '/parent' },
    { label: 'Progress', icon: '📊', href: '/parent/progress' },
    { label: 'Schedule', icon: '📅', href: '/parent/schedule' },
    { label: 'Grades', icon: '🏆', href: '/parent/grades' },
  ],
  tutor: [
    { label: 'Dashboard', icon: '🏠', href: '/tutor' },
    { label: 'My Courses', icon: '📚', href: '/tutor/courses' },
    { label: 'Upload Content', icon: '📤', href: '/tutor/upload' },
    { label: 'Assignments', icon: '📝', href: '/tutor/assignments' },
    { label: 'Quizzes', icon: '❓', href: '/tutor/quizzes' },
    { label: 'Students', icon: '🎓', href: '/tutor/students' },
    { label: 'Schedule', icon: '📅', href: '/tutor/schedule' },
    { label: 'Messages', icon: '💬', href: '/tutor/messages' },
  ],
  admin: [
    { label: 'Dashboard', icon: '🏠', href: '/admin' },
    { label: 'Users', icon: '👥', href: '/admin/users' },
    { label: 'Courses', icon: '📚', href: '/admin/courses' },
    { label: 'Content', icon: '📁', href: '/admin/content' },
    { label: 'Schedules', icon: '📅', href: '/admin/schedules' },
    { label: 'Analytics', icon: '📊', href: '/admin/analytics' },
  ],
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifs, setShowNotifs] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [greeting, setGreeting] = useState('Welcome')
  const pathname = usePathname()
  const router = useRouter()

  const loadProfile = useCallback(async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (data) setProfile(data)

    // Load notifications
    const { data: notifs } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10)

    if (notifs) setNotifications(notifs)
  }, [router])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  useEffect(() => {
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 17) setGreeting('Good afternoon')
    else setGreeting('Good evening')
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const getBreadcrumbs = () => {
    const paths = pathname.split('/').filter(Boolean)
    return paths.map((path, idx) => {
      const href = '/' + paths.slice(0, idx + 1).join('/')
      let label = path.charAt(0).toUpperCase() + path.slice(1)
      if (label === 'Student') label = 'Home'
      if (label === 'Tutor') label = 'Home'
      if (label === 'Parent') label = 'Home'
      if (label === 'Admin') label = 'Home'

      const isLast = idx === paths.length - 1
      return (
        <span key={href} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)' }}>
          {idx > 0 && <span style={{ color: 'var(--text-tertiary)', margin: '0 2px' }}>/</span>}
          {isLast ? (
            <span style={{ color: 'var(--brand-primary)', fontWeight: 600 }}>{label.toUpperCase()}</span>
          ) : (
            <Link href={href} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{label.toUpperCase()}</Link>
          )}
        </span>
      )
    })
  }

  if (!profile) {
    return (
      <div className="loading-center" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
      </div>
    )
  }

  const items = navItems[profile.role] || navItems.student
  const unreadCount = notifications.filter(n => !n.is_read).length
  const initials = profile.full_name ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'
  const firstName = profile.full_name ? profile.full_name.split(' ')[0] : 'User'

  return (
    <div>
      {/* Sidebar */}
      <aside className="sidebar dots-pattern">
        <div className="sidebar-logo">
          <svg width="28" height="28" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="38" height="38" fill="var(--bg-secondary)" stroke="var(--brand-primary)" strokeWidth="1.5" />
            <path d="M12 26V12H20V26" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="square" />
            <path d="M26 26V15H20" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="square" />
          </svg>
          <span style={{
            fontSize: 'var(--font-size-lg)',
            fontWeight: 600,
            fontFamily: 'var(--font-heading)',
            letterSpacing: '-0.02em',
            color: 'var(--text-primary)'
          }}>
            Study<span style={{ color: 'var(--brand-primary)', fontStyle: 'italic' }}>Com</span>
          </span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title" style={{ fontFamily: 'var(--font-mono)' }}>Navigation</div>
          </div>
          {items.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setSidebarOpen(false)}
                style={{
                  borderRadius: 0,
                  borderLeft: isActive ? '2px solid var(--brand-primary)' : '2px solid transparent',
                  background: isActive ? 'rgba(216, 168, 56, 0.04)' : 'transparent',
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                <span className="sidebar-link-icon">{item.icon}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.02em' }}>{item.label.toUpperCase()}</span>
              </Link>
            )
          })}
        </nav>

        <div className="sidebar-footer">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.85rem',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-primary)',
          }}>
            <div className="avatar avatar-sm" style={{
              background: 'var(--bg-primary)',
              color: 'var(--brand-primary)',
              border: '1px solid var(--brand-primary)',
              fontWeight: 700,
              borderRadius: 0
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.full_name}
              </div>
              <div style={{ display: 'inline-flex', marginTop: '2px' }}>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  background: 'rgba(216, 168, 56, 0.1)',
                  color: 'var(--brand-primary)',
                  padding: '1px 6px',
                  borderRadius: 0,
                  fontFamily: 'var(--font-mono)'
                }}>
                  {profile.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 299,
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Top Bar */}
      <header className="topbar">
        <div className="topbar-left">
          <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              {getBreadcrumbs()}
            </div>
            <h2 className="topbar-title" style={{ margin: 0, fontSize: 'var(--font-size-lg)', fontWeight: 500, fontFamily: 'var(--font-heading)' }}>
              {greeting}, <span style={{ fontStyle: 'italic', color: 'var(--brand-primary)' }}>{firstName}</span>
            </h2>
          </div>
        </div>

        <div className="topbar-right">
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button className="notification-btn" onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false) }}>
              🔔
              {unreadCount > 0 && <span className="notification-dot" style={{ background: 'var(--brand-primary)' }} />}
            </button>
            {showNotifs && (
              <div className="notification-dropdown" style={{ borderRadius: 0 }}>
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)', fontWeight: 600, fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                  NOTIFICATIONS
                  {unreadCount > 0 && <span className="badge badge-primary" style={{ marginLeft: '0.5rem', borderRadius: 0 }}>{unreadCount}</span>}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notification-item ${!n.is_read ? 'unread' : ''}`} style={{ borderBottom: '1px solid var(--border-secondary)' }}>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)', marginBottom: '0.25rem' }}>{n.title}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{n.message}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '0.25rem', fontFamily: 'var(--font-mono)' }}>
                          {new Date(n.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* User Menu */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowUserMenu(!showUserMenu); setShowNotifs(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-primary)',
              }}
            >
              <div className="avatar avatar-sm" style={{
                background: 'var(--bg-secondary)',
                color: 'var(--brand-primary)',
                border: '1px solid var(--brand-primary)',
                fontWeight: 700,
                borderRadius: 0
              }}>{initials}</div>
            </button>
            {showUserMenu && (
              <div className="user-dropdown" style={{ borderRadius: 0 }}>
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-secondary)' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{profile.full_name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', fontFamily: 'var(--font-mono)' }}>{profile.role.toUpperCase()}</div>
                </div>
                <div style={{ padding: '0.25rem' }}>
                  <button className="user-dropdown-item" onClick={handleLogout} style={{ borderRadius: 0, fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                    🚪 SIGN OUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {children}
      </main>

      {/* Mobile Bottom Nav Bar */}
      <nav className="mobile-bottom-nav">
        <div className="mobile-bottom-nav-inner">
          {items.slice(0, 5).map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                style={{ color: isActive ? 'var(--brand-primary)' : 'var(--text-tertiary)' }}
              >
                {item.icon}
                <span style={{ fontFamily: 'var(--font-mono)' }}>{item.label.toUpperCase()}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Click outside to close dropdowns */}
      {(showNotifs || showUserMenu) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99 }}
          onClick={() => { setShowNotifs(false); setShowUserMenu(false) }}
        />
      )}
    </div>
  )
}
