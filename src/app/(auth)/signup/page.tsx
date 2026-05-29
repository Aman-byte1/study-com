'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/lib/types'

const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
  { value: 'student', label: 'Student', icon: '🎓', description: 'Learn, watch lessons, take quizzes' },
  { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧', description: 'Monitor your child\'s progress' },
  { value: 'tutor', label: 'Tutor', icon: '👩‍🏫', description: 'Teach, upload content, grade work' },
]

const gradeOptions = [9, 10, 11, 12]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState<UserRole>('student')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [gradeLevel, setGradeLevel] = useState(9)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()

    // Sign up
    const { data, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        role,
        full_name: fullName,
        phone: phone || null,
        grade_level: role === 'student' ? gradeLevel : null,
      })

      if (profileError) {
        setError(profileError.message)
        setLoading(false)
        return
      }

      router.push(`/${role}`)
    }
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

      <div className="card-static" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', marginBottom: '0.5rem', textAlign: 'center' }}>
          Create Account
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: 'var(--font-size-sm)' }}>
          {step === 1 ? 'Choose your role to get started' : 'Fill in your details'}
        </p>

        {/* Progress */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          {[1, 2].map(s => (
            <div key={s} style={{
              flex: 1, height: 4,
              borderRadius: 'var(--radius-full)',
              background: s <= step ? 'var(--gradient-brand)' : 'var(--bg-glass)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

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

        {step === 1 ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {roles.map(r => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: role === r.value ? 'rgba(108, 92, 231, 0.1)' : 'var(--bg-glass)',
                    border: `1px solid ${role === r.value ? 'var(--brand-primary)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '2rem' }}>{r.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: '0.125rem' }}>{r.label}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{r.description}</div>
                  </div>
                  {role === r.value && (
                    <span style={{ marginLeft: 'auto', color: 'var(--brand-primary)', fontSize: '1.25rem' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '0.875rem', fontSize: 'var(--font-size-base)' }}
            >
              Continue →
            </button>
          </>
        ) : (
          <form onSubmit={handleSignup}>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                type="text"
                className="input"
                placeholder="Enter your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label" htmlFor="signupEmail">Email Address</label>
              <input
                id="signupEmail"
                type="email"
                className="input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label" htmlFor="signupPassword">Password</label>
              <input
                id="signupPassword"
                type="password"
                className="input"
                placeholder="Min. 6 characters"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label className="input-label" htmlFor="phone">Phone (optional)</label>
              <input
                id="phone"
                type="tel"
                className="input"
                placeholder="+251..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
            </div>

            {role === 'student' && (
              <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                <label className="input-label" htmlFor="gradeLevel">Grade Level</label>
                <select
                  id="gradeLevel"
                  className="input select"
                  value={gradeLevel}
                  onChange={e => setGradeLevel(Number(e.target.value))}
                >
                  {gradeOptions.map(g => (
                    <option key={g} value={g}>Grade {g}</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(1)}
                style={{ padding: '0.875rem 1.5rem' }}
              >
                ← Back
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                style={{ flex: 1, padding: '0.875rem', fontSize: 'var(--font-size-base)' }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Creating account...
                  </span>
                ) : 'Create Account'}
              </button>
            </div>
          </form>
        )}

        <p style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--brand-primary-light)', fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
