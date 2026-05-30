'use client'

import Link from 'next/link'

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg width="40" height="40" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="38" rx="10" fill="url(#logoGradLayout)" />
        <path d="M11 26V13C11 11.8954 11.8954 11 13 11H19C20.1046 11 21 11.8954 21 13V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M27 26V15C27 13.8954 26.1046 13 25 13H21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 22H24" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
        <path d="M14 18H24" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
        <defs>
          <linearGradient id="logoGradLayout" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6c5ce7" />
            <stop offset="1" stopColor="#a29bfe" />
          </linearGradient>
        </defs>
      </svg>
      <span style={{
        fontSize: 'var(--font-size-xl)',
        fontWeight: 800,
        fontFamily: 'var(--font-heading)',
        letterSpacing: '-0.03em',
        background: 'var(--gradient-brand)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>StudyCom</span>
    </div>
  )
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-container">
      {/* Sidebar Branding (Desktop only) */}
      <aside className="auth-sidebar dots-pattern">
        {/* Floating Orbs for depth */}
        <div className="floating-orb-1" style={{
          position: 'absolute', top: '-10%', left: '-10%',
          width: '350px', height: '350px',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />
        <div className="floating-orb-2" style={{
          position: 'absolute', bottom: '-10%', right: '-10%',
          width: '300px', height: '300px',
          background: 'radial-gradient(circle, rgba(0, 206, 201, 0.08) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        {/* Top Header */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Logo />
          </Link>
        </div>

        {/* Middle Content */}
        <div style={{ position: 'relative', zIndex: 10, margin: '4rem 0' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 3.5vw, 3rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: '1.75rem',
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-heading)',
          }}>
            Accelerate Your Academic{' '}
            <span className="animated-gradient-text">Success</span>
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
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(108, 92, 231, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--brand-primary-light)',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}>✓</div>
                <span style={{ fontSize: 'var(--font-size-sm)', fontWeight: 500, color: 'var(--text-secondary)' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', margin: 0 }}>
            © 2026 StudyCom. Designed under Federal Ministry of Education curriculum guidelines.
          </p>
        </div>
      </aside>

      {/* Auth Form Area */}
      <main className="auth-content grid-pattern">
        {/* Floating background orbs for content side */}
        <div className="floating-orb-3" style={{
          position: 'absolute', top: '30%', right: '10%',
          width: '250px', height: '250px',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.08) 0%, transparent 60%)',
          borderRadius: '50%', filter: 'blur(50px)',
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '440px' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
