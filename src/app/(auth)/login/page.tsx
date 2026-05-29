'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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

  return (
    <div className="animate-scale-in">
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            width: 48, height: 48,
            background: 'var(--gradient-brand)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.5rem',
          }}>📖</div>
          <span style={{
            fontSize: 'var(--font-size-2xl)',
            fontWeight: 800,
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>StudyCom</span>
        </Link>
      </div>

      {/* Card */}
      <div className="card-static" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem', textAlign: 'center' }}>
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
            color: 'var(--brand-danger)',
            fontSize: 'var(--font-size-sm)',
            marginBottom: '1.5rem',
          }}>
            {error}
          </div>
        )}

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

          <div className="input-group" style={{ marginBottom: '1.5rem' }}>
            <label className="input-label" htmlFor="password">Password</label>
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
            style={{ width: '100%', padding: '0.875rem', fontSize: 'var(--font-size-base)' }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>
        </form>

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
        }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: 'var(--brand-primary-light)', fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
