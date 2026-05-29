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

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
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
  const initials = profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">📖</div>
          <span className="sidebar-logo-text">StudyCom</span>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Menu</div>
          </div>
          {items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-link-icon">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem',
            padding: '0.75rem', borderRadius: 'var(--radius-lg)',
            background: 'var(--bg-glass)',
          }}>
            <div className="avatar avatar-sm">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {profile.full_name}
              </div>
              <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>
                {profile.role}
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
            background: 'rgba(0,0,0,0.5)',
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
          <h1 className="topbar-title">
            {items.find(i => i.href === pathname)?.label || 'Dashboard'}
          </h1>
        </div>

        <div className="topbar-right">
          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button className="notification-btn" onClick={() => { setShowNotifs(!showNotifs); setShowUserMenu(false) }}>
              🔔
              {unreadCount > 0 && <span className="notification-dot" />}
            </button>
            {showNotifs && (
              <div className="notification-dropdown">
                <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-primary)', fontWeight: 600 }}>
                  Notifications
                  {unreadCount > 0 && <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>{unreadCount}</span>}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-tertiary)' }}>
                    No notifications yet
                  </div>
                ) : (
                  notifications.map(n => (
                    <div key={n.id} className={`notification-item ${!n.is_read ? 'unread' : ''}`}>
                      <div>
                        <div style={{ fontWeight: 500, fontSize: 'var(--font-size-sm)', marginBottom: '0.25rem' }}>{n.title}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{n.message}</div>
                        <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>
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
              <div className="avatar avatar-sm">{initials}</div>
            </button>
            {showUserMenu && (
              <div className="user-dropdown">
                <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-secondary)' }}>
                  <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{profile.full_name}</div>
                  <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)' }}>{profile.role}</div>
                </div>
                <div style={{ padding: '0.25rem' }}>
                  <button className="user-dropdown-item" onClick={handleLogout}>
                    🚪 Sign Out
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
