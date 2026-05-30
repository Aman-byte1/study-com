'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function MobileLogo() {
  return (
    <div className="auth-mobile-logo">
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="38" height="38" fill="var(--bg-secondary)" stroke="var(--brand-primary)" strokeWidth="1.5" />
          <path d="M10 26C14 26 19 24 19 12C19 24 24 26 28 26" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="square" />
          <path d="M10 14C14 14 19 12 19 10C19 12 24 14 28 14" stroke="var(--text-primary)" strokeWidth="1.5" strokeLinecap="square" />
          <line x1="19" y1="11" x2="19" y2="28" stroke="var(--brand-primary)" strokeWidth="2" />
          <circle cx="19" cy="7" r="1.5" fill="var(--brand-primary)" />
        </svg>
        <span style={{
          fontSize: 'var(--font-size-xl)',
          fontWeight: 600,
          fontFamily: 'var(--font-heading)',
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
        }}>
          Study<span style={{ color: 'var(--brand-primary)', fontStyle: 'italic' }}>Com</span>
        </span>
      </Link>
    </div>
  )
}

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  
  const searchParams = useSearchParams()
  const message = searchParams.get('message')
  const urlError = searchParams.get('error')

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
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 500, marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
          Welcome Back
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: 'var(--font-size-sm)' }}>
          Sign in to continue your learning journey
        </p>

        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(207, 75, 75, 0.1)',
            border: '1px solid rgba(207, 75, 75, 0.3)',
            color: '#cf4b4b',
            fontSize: 'var(--font-size-sm)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {!error && urlError === 'profile-not-found' && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(207, 75, 75, 0.1)',
            border: '1px solid rgba(207, 75, 75, 0.3)',
            color: '#cf4b4b',
            fontSize: 'var(--font-size-sm)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}>
            Account authenticated, but no profile was found. Please sign up to register your account role.
          </div>
        )}

        {!error && urlError === 'profile-creation-failed' && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(207, 75, 75, 0.1)',
            border: '1px solid rgba(207, 75, 75, 0.3)',
            color: '#cf4b4b',
            fontSize: 'var(--font-size-sm)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}>
            Profile creation failed: {searchParams.get('details') || 'An unexpected database error occurred.'}
          </div>
        )}

        {!error && message === 'check-email' && (
          <div style={{
            padding: '0.75rem 1rem',
            background: 'rgba(61, 90, 80, 0.1)',
            border: '1px solid rgba(61, 90, 80, 0.3)',
            color: 'var(--brand-secondary-light)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}>
            Registration successful! Please check your email inbox and click the validation link to verify and activate your account.
          </div>
        )}

        {/* Social Logins */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button type="button" className="btn-social" onClick={handleGoogleLogin} style={{ borderRadius: 0 }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.616z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.93 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.894 11.426 0 9 0 5.482 0 2.438 2.07 1.008 5.011l3.007 2.332C4.72 5.213 6.704 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="auth-divider" style={{ fontFamily: 'var(--font-mono)' }}>or continue with email</div>

        <form onSubmit={handleLogin}>
          <div className="input-group" style={{ marginBottom: '1.25rem' }}>
            <label className="input-label" htmlFor="email" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>EMAIL ADDRESS</label>
            <input
              id="email"
              type="email"
              className="input"
              placeholder="you@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              style={{ borderRadius: 0 }}
            />
          </div>

          <div className="input-group" style={{ marginBottom: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
              <label className="input-label" htmlFor="password" style={{ margin: 0, fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>PASSWORD</label>
              <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--brand-primary)', cursor: 'pointer', fontWeight: 500, fontFamily: 'var(--font-mono)' }}>
                FORGOT?
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
              style={{ borderRadius: 0 }}
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
          <Link href="/signup" style={{ color: 'var(--brand-primary)', fontWeight: 600, textDecoration: 'none' }}>
            Create one
          </Link>
        </p>
      </div>

      {/* Trusted Logos */}
      <div style={{ marginTop: '2.5rem' }}>
        <div className="trusted-logos-title" style={{ fontFamily: 'var(--font-mono)' }}>TRUSTED BY STUDENTS AT</div>
        <div className="trusted-logos-strip">
          <span className="trusted-logo" style={{ fontFamily: 'var(--font-mono)' }}>ST. JOSEPH</span>
          <span className="trusted-logo" style={{ fontFamily: 'var(--font-mono)' }}>LIDETA</span>
          <span className="trusted-logo" style={{ fontFamily: 'var(--font-mono)' }}>HILLSIDE</span>
          <span className="trusted-logo" style={{ fontFamily: 'var(--font-mono)' }}>HAWASSA</span>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="loading-center"><div className="spinner" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
