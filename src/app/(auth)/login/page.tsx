'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function MobileLogo() {
  return (
    <div className="auth-mobile-logo">
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="38" height="38" rx="10" fill="url(#logoGradMobile)" />
          <path d="M11 26V13C11 11.8954 11.8954 11 13 11H19C20.1046 11 21 11.8954 21 13V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M27 26V15C27 13.8954 26.1046 13 25 13H21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 22H24" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
          <path d="M14 18H24" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
          <defs>
            <linearGradient id="logoGradMobile" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
              <stop stopColor="#6c5ce7" />
              <stop offset="1" stopColor="#a29bfe" />
            </linearGradient>
          </defs>
        </svg>
        <span style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 800,
          background: 'var(--gradient-brand)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>StudyCom</span>
      </Link>
    </div>
  )
}

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Get user role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    const role = profile?.role || 'student'
    router.push(`/${role}`)
  }

  const handleGoogleLogin = async () => {
    setError('')
    setLoading(true)
    const supabase = createClient()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="animate-scale-in">
      <MobileLogo />

      {/* Card */}
      <div className="card-static" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
          Welcome Back
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: 'var(--font-size-sm)' }}>
          Sign in to continue your learning journey
        </p>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(255, 107, 107, 0.1)',
            border: '1px solid rgba(255, 107, 107, 0.3)',
            borderRadius: 'var(--radius-lg)',
            color: '#ff6b6b',
            fontSize: 'var(--font-size-sm)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {/* Social Logins */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button type="button" className="btn-social" onClick={handleGoogleLogin}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.616z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.93 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.894 11.426 0 9 0 5.482 0 2.438 2.07 1.008 5.011l3.007 2.332C4.72 5.213 6.704 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="auth-divider">or continue with email</div>

        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ marginBottom: '1.25rem' }}>
            <label className="input-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="input-label" htmlFor="password" style={{ margin: 0 }}>Password</label>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--brand-primary-light)', cursor: 'pointer', fontWeight: 500 }}>
                Forgot?
              </span>
            </div>
            <input
              id="password"
              type="password"
              className="input"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '0.875rem', fontSize: 'var(--font-size-base)', fontWeight: 600 }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '1.75rem',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
        }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--brand-primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>

      {/* Trusted Logos */}
      <div style={{ marginTop: '2.5rem' }}>
        <div className="trusted-logos-title">Trusted by Students at</div>
        <div className="trusted-logos-strip">
          <span className="trusted-logo">ST. JOSEPH</span>
          <span className="trusted-logo">LIDETA</span>
          <span className="trusted-logo">HILLSIDE</span>
          <span className="trusted-logo">HAWASSA</span>
        </div>
      </div>
    </div>
  )
}
