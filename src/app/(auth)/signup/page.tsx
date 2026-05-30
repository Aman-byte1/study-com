'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { UserRole } from '@/lib/types'

const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
  { value: 'student', label: 'Student', icon: '🎓', description: 'Access video lessons, quizzes, & track homework' },
  { value: 'parent', label: 'Parent', icon: '👨‍👩‍👧', description: 'Monitor study schedules & watch score progress' },
  { value: 'tutor', label: 'Tutor', icon: '👩‍🏫', description: 'Create resources, assign work, & guide students' },
]

const gradeOptions = [9, 10, 11, 12]

function MobileLogo() {
  return (
    <div className="auth-mobile-logo">
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
        <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="38" height="38" rx="10" fill="url(#logoGradMobileSU)" />
          <path d="M11 26V13C11 11.8954 11.8954 11 13 11H19C20.1046 11 21 11.8954 21 13V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M27 26V15C27 13.8954 26.1046 13 25 13H21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M14 22H24" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
          <path d="M14 18H24" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
          <defs>
            <linearGradient id="logoGradMobileSU" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
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

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'transparent' }
    let score = 0
    if (pass.length >= 6) score++
    if (pass.length >= 10) score++
    if (/[0-9]/.test(pass)) score++
    if (/[A-Z]/.test(pass)) score++
    if (/[^a-zA-Z0-9]/.test(pass)) score++
    
    if (score <= 2) return { score, label: 'Weak', color: '#ff6b6b' }
    if (score === 3) return { score, label: 'Fair', color: '#fdcb6e' }
    if (score === 4) return { score, label: 'Good', color: '#74b9ff' }
    return { score, label: 'Strong', color: '#00b894' }
  }

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
      // If email confirmation is enabled, session will be null and client-side writes to profiles will fail under RLS
      if (!data.session) {
        router.push('/login?message=check-email')
        return
      }

      // Create profile (user is immediately authenticated since confirmation is off)
      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id,
        role,
        full_name: fullName,
        phone: phone || null,
        grade_level: role === 'student' ? gradeLevel : null,
      })

      if (profileError) {
        if (profileError.code === '42501') {
          router.push('/login?message=check-email')
          return
        }
        setError(profileError.message)
        setLoading(false)
        return
      }

      router.push(`/${role}`)
    }
  }

  const handleGoogleSignup = async () => {
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

  const strength = getPasswordStrength(password)

  return (
    <div className="animate-scale-in">
      <MobileLogo />

      <div className="card-static" style={{ padding: '2.5rem' }}>
        <h2 style={{ fontSize: 'var(--font-size-2xl)', fontWeight: 800, marginBottom: '0.5rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}>
          Create Account
        </h2>
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', marginBottom: '2rem', fontSize: 'var(--font-size-sm)' }}>
          {step === 1 ? 'Choose your role to get started' : 'Fill in your details'}
        </p>

        {/* Progress bar */}
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
            color: '#ff6b6b',
            fontSize: 'var(--font-size-sm)',
            marginBottom: '1.5rem',
            lineHeight: 1.5,
          }}>
            {error}
          </div>
        )}

        {step === 1 ? (
          <>
            {/* Social Logins */}
            <div style={{ marginBottom: '1.5rem' }}>
              <button type="button" className="btn-social" onClick={handleGoogleSignup}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.909c1.702-1.567 2.683-3.874 2.683-6.616z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.909-2.258c-.806.54-1.837.86-3.047.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.93 5.482 18 9 18z" fill="#34A853"/>
                  <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.894 11.426 0 9 0 5.482 0 2.438 2.07 1.008 5.011l3.007 2.332C4.72 5.213 6.704 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Sign up with Google
              </button>
            </div>

            <div className="auth-divider">or signup with email</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {roles.map(r => (
                <button
                  key={r.value}
                  onClick={() => setRole(r.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '1rem 1.25rem',
                    background: role === r.value ? 'rgba(108, 92, 231, 0.08)' : 'var(--bg-glass)',
                    border: `1px solid ${role === r.value ? 'var(--brand-primary)' : 'var(--border-primary)'}`,
                    borderRadius: 'var(--radius-lg)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    width: '100%',
                  }}
                >
                  <span style={{ fontSize: '2rem', lineHeight: 1 }}>{r.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '0.125rem', fontSize: 'var(--font-size-sm)' }}>{r.label}</div>
                    <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{r.description}</div>
                  </div>
                  {role === r.value && (
                    <span style={{ marginLeft: 'auto', color: 'var(--brand-primary-light)', fontSize: '1.25rem' }}>✓</span>
                  )}
                </button>
              ))}
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setStep(2)}
              style={{ width: '100%', padding: '0.875rem', fontSize: 'var(--font-size-base)', fontWeight: 600 }}
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
              {/* Password strength UI */}
              {password && (
                <div style={{ marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.25rem', marginBottom: '0.25rem' }}>
                    {[1, 2, 3, 4, 5].map(idx => (
                      <div
                        key={idx}
                        style={{
                          flex: 1,
                          height: '4px',
                          borderRadius: '2px',
                          background: idx <= strength.score ? strength.color : 'var(--bg-glass)',
                          opacity: idx <= strength.score ? 1 : 0.3,
                          transition: 'all 0.3s ease',
                        }}
                      />
                    ))}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-xs)' }}>
                    <span style={{ color: 'var(--text-tertiary)' }}>Password strength</span>
                    <span style={{ color: strength.color, fontWeight: 600 }}>{strength.label}</span>
                  </div>
                </div>
              )}
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
                style={{ flex: 1, padding: '0.875rem', fontSize: 'var(--font-size-base)', fontWeight: 600 }}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}>
                    <span className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                    Creating...
                  </span>
                ) : 'Register'}
              </button>
            </div>
          </form>
        )}

        <p style={{
          textAlign: 'center',
          marginTop: '1.75rem',
          fontSize: 'var(--font-size-sm)',
          color: 'var(--text-secondary)',
        }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: 'var(--brand-primary-light)', fontWeight: 600, textDecoration: 'none' }}>
            Sign in
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
