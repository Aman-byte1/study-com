'use client'

import Link from 'next/link'

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
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
    </div>
  )
}

// ============================================
// ANIMATED CHECKMARK SVG
// ============================================
function AnimatedCheckmark() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.5" y="0.5" width="19" height="19" stroke="var(--brand-primary)" strokeWidth="1" />
      <path d="M5 10L8.5 13.5L15 7" stroke="var(--brand-primary)" strokeWidth="1.5" strokeLinecap="square" fill="none" className="animate-draw-line" strokeDasharray="20" strokeDashoffset="0" />
    </svg>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-container" style={{ overflow: 'hidden' }}>
      {/* Floating decorative elements */}
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 0,
        top: '15%', left: '5%', width: '12px', height: '12px',
        border: '1px solid var(--brand-primary)', opacity: 0.08,
        transform: 'rotate(45deg)',
        animation: 'floatDrift 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 0,
        bottom: '20%', right: '8%', width: '8px', height: '8px',
        background: 'var(--brand-primary)', opacity: 0.05,
        borderRadius: '50%',
        animation: 'floatDrift 10s ease-in-out infinite 2s',
      }} />
      <div style={{
        position: 'fixed', pointerEvents: 'none', zIndex: 0,
        top: '40%', right: '3%', width: '20px', height: '1px',
        background: 'var(--brand-primary)', opacity: 0.06,
        animation: 'floatDrift 12s ease-in-out infinite 4s',
      }} />

      {/* Sidebar Branding (Desktop only) */}
      <aside className="auth-sidebar grid-pattern">
        {/* Decorative gradient orbs */}
        <div style={{
          position: 'absolute', top: '-20%', right: '-20%',
          width: '500px', height: '500px',
          background: 'radial-gradient(circle, rgba(216, 168, 56, 0.04) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%',
          width: '400px', height: '400px',
          background: 'radial-gradient(circle, rgba(61, 90, 80, 0.04) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        {/* Top Header */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo />
          </Link>
        </div>

        {/* Middle Content */}
        <div style={{ position: 'relative', zIndex: 10, margin: '4rem 0' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--brand-primary)', letterSpacing: '0.1em' }}>
            PORTAL SIGN-IN
          </span>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 500,
            lineHeight: 1.15,
            marginBottom: '1.75rem',
            letterSpacing: '-0.01em',
            fontFamily: 'var(--font-heading)',
            marginTop: '0.5rem'
          }}>
            Accelerate Your Academic <span style={{ color: 'var(--brand-primary)', fontStyle: 'italic' }}>Success</span>
          </h1>
          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            marginBottom: '2.5rem',
            maxWidth: '440px',
          }}>
            Join over 12,000+ Grade 9-12 students studying with certified tutors and preparing for the national entrance exam (EUEE) with custom dashboards.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              'Syllabus-aligned video lessons & notes',
              'Interactive past-exam EUEE testing simulators',
              'Collaborative student, parent & tutor accounts'
            ].map((feature, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <AnimatedCheckmark />
                </div>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', margin: 0, fontFamily: 'var(--font-mono)' }}>
            © 2026 STUDYCOM. INCORPORATED UNDER MINISTRY CURRICULUM BLUEPRINTS.
          </p>
        </div>
      </aside>

      {/* Auth Form Area */}
      <main className="auth-content dots-pattern">
        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
