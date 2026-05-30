'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { Profile, Notification } from '@/lib/types'

// ============================================
// CUSTOM HAND-CRAFTED SCHOLARLY SVG ICONS
// ============================================

function LogoIcon({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="38" height="38" fill="var(--bg-secondary)" stroke="var(--brand-primary)" strokeWidth="1.5" />
      <path d="M10 26C14 26 19 24 19 12C19 24 24 26 28 26" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="square" />
      <path d="M10 14C14 14 19 12 19 10C19 12 24 14 28 14" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="square" />
      <line x1="19" y1="11" x2="19" y2="28" stroke="var(--brand-primary)" strokeWidth="2" />
      <circle cx="19" cy="7" r="1.5" fill="var(--brand-primary)" />
    </svg>
  )
}

function DashboardIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  )
}

function CoursesIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="9" y1="6" x2="16" y2="6" />
      <line x1="9" y1="10" x2="16" y2="10" />
    </svg>
  )
}

function ScheduleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="3" y="4" width="18" height="18" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
      <rect x="7" y="14" width="2" height="2" fill="currentColor" stroke="none" />
      <rect x="11" y="14" width="2" height="2" fill="currentColor" stroke="none" />
      <rect x="15" y="14" width="2" height="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function AssignmentsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function QuizzesIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
    </svg>
  )
}

function ExamPrepIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}

function MessagesIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  )
}

function ProgressIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  )
}

function GradesIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.45 1-1 1H4v2h16v-2h-5c-.55 0-1-.45-1-1v-2.34" />
      <path d="M12 2a4 4 0 0 1 4 4v7c0 1-.3 2-.86 2.82C14.34 16.7 13.25 17 12 17s-2.34-.3-3.14-1.18C8.3 15 8 14 8 13V6a4 4 0 0 1 4-4z" />
    </svg>
  )
}

function UploadIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M16 16l-4-4-4 4" />
      <path d="M12 12v9" />
      <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
    </svg>
  )
}

function StudentsIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
    </svg>
  )
}

function UsersIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ContentIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
    </svg>
  )
}

const getIcon = (label: string, size = 18) => {
  switch (label.toLowerCase()) {
    case 'dashboard': return <DashboardIcon size={size} />
    case 'my courses': return <CoursesIcon size={size} />
    case 'schedule': return <ScheduleIcon size={size} />
    case 'assignments': return <AssignmentsIcon size={size} />
    case 'quizzes': return <QuizzesIcon size={size} />
    case 'exam prep': return <ExamPrepIcon size={size} />
    case 'messages': return <MessagesIcon size={size} />
    case 'progress': return <ProgressIcon size={size} />
    case 'grades': return <GradesIcon size={size} />
    case 'upload content': return <UploadIcon size={size} />
    case 'students': return <StudentsIcon size={size} />
    case 'users': return <UsersIcon size={size} />
    case 'content': return <ContentIcon size={size} />
    case 'schedules': return <ScheduleIcon size={size} />
    case 'analytics': return <ProgressIcon size={size} />
    default: return null
  }
}

const navItems = {
  student: [
    { label: 'Dashboard', href: '/student' },
    { label: 'My Courses', href: '/student/courses' },
    { label: 'Schedule', href: '/student/schedule' },
    { label: 'Assignments', href: '/student/assignments' },
    { label: 'Quizzes', href: '/student/quizzes' },
    { label: 'Exam Prep', href: '/student/exam-prep' },
    { label: 'Messages', href: '/student/messages' },
  ],
  parent: [
    { label: 'Dashboard', href: '/parent' },
    { label: 'Progress', href: '/parent/progress' },
    { label: 'Schedule', href: '/parent/schedule' },
    { label: 'Grades', href: '/parent/grades' },
  ],
  tutor: [
    { label: 'Dashboard', href: '/tutor' },
    { label: 'My Courses', href: '/tutor/courses' },
    { label: 'Upload Content', href: '/tutor/upload' },
    { label: 'Assignments', href: '/tutor/assignments' },
    { label: 'Quizzes', href: '/tutor/quizzes' },
    { label: 'Students', href: '/tutor/students' },
    { label: 'Schedule', href: '/tutor/schedule' },
    { label: 'Messages', href: '/tutor/messages' },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Users', href: '/admin/users' },
    { label: 'Courses', href: '/admin/courses' },
    { label: 'Content', href: '/admin/content' },
    { label: 'Schedules', href: '/admin/schedules' },
    { label: 'Analytics', href: '/admin/analytics' },
  ],
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Grain overlay for texture depth
  const showGrain = true
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
      {/* Grain overlay */}
      <div className="grain-overlay" />

      {/* Sidebar */}
      <aside className="sidebar dots-pattern">
        <div className="sidebar-logo">
          <LogoIcon size={28} />
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
                <span className="sidebar-link-icon" style={{ display: 'flex', alignItems: 'center' }}>
                  {getIcon(item.label)}
                </span>
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
                <span style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                  {getIcon(item.label, 20)}
                </span>
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
