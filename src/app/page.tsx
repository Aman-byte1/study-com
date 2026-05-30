'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="38" rx="10" fill="url(#logoGrad)" />
        <path d="M11 26V13C11 11.8954 11.8954 11 13 11H19C20.1046 11 21 11.8954 21 13V26" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M27 26V15C27 13.8954 26.1046 13 25 13H21" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M14 22H24" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
        <path d="M14 18H24" stroke="white" strokeWidth="2" strokeOpacity="0.4" />
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="38" y2="38" gradientUnits="userSpaceOnUse">
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

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
        <line x1="7" y1="2" x2="7" y2="22"></line>
        <line x1="17" y1="2" x2="17" y2="22"></line>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <line x1="2" y1="7" x2="7" y2="7"></line>
        <line x1="2" y1="17" x2="7" y2="17"></line>
        <line x1="17" y1="17" x2="22" y2="17"></line>
        <line x1="17" y1="7" x2="22" y2="7"></line>
      </svg>
    ),
    title: 'Curriculum Video Lessons',
    description: 'High-definition video courses from expert Ethiopian educators mapped exactly to the Grades 9-12 national syllabus.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    title: 'Interactive National Prep',
    description: 'Simulate the Ethiopian University Entrance Exam (EUEE) with thousands of past questions and immediate deep analytics.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
    ),
    title: 'AI-Guided Scheduling',
    description: 'A study calendar that auto-adjusts based on your exam dates, current progress levels, and daily availability.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"></path>
        <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"></path>
      </svg>
    ),
    title: 'Progress Insights',
    description: 'Real-time performance graphs and dashboards for students, linking tutors and parents to unified tracking.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
      </svg>
    ),
    title: 'Instant Tutor Chat',
    description: 'Unstuck instantly. Secure 1-on-1 text channel linking you to verified expert instructors for custom guidance.'
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
      </svg>
    ),
    title: 'Curated Study Materials',
    description: 'Downloadable summary notebooks, formulas booklets, and sample test collections created by certified tutors.'
  }
]

const subjects = [
  { name: 'Mathematics', icon: '📐', color: '#6c5ce7' },
  { name: 'Physics', icon: '⚛️', color: '#00cec9' },
  { name: 'Chemistry', icon: '🧪', color: '#fd79a8' },
  { name: 'Biology', icon: '🧬', color: '#00b894' },
  { name: 'English', icon: '🗣️', color: '#74b9ff' },
  { name: 'Civics', icon: '⚖️', color: '#fdcb6e' },
]

const steps = [
  {
    number: '01',
    title: 'Select Your Path',
    description: 'Sign up as a student, parent, or tutor. Customize your grade level and target curriculum in seconds.'
  },
  {
    number: '02',
    title: 'Unlock Premium Content',
    description: 'Study syllabus-aligned lessons, take interactive chapter quizzes, and ask questions to professional tutors.'
  },
  {
    number: '03',
    title: 'Excel in Your Exams',
    description: 'Use real-time analytics to spot weak points. Polish test-taking skills and ace your national EUEE examinations.'
  }
]

const testimonials = [
  {
    quote: "StudyCom completely changed how I prepared for my Grade 12 National Exam. The physics explanation videos by tutor Yohannes were so clear, and I scored 88/100 on my entrance exam!",
    name: "Rediet Kebede",
    role: "Grade 12 Student, Addis Ababa",
    avatar: "RK",
    rating: 5
  },
  {
    quote: "As a parent, I used to worry about whether my daughter was studying. StudyCom allows me to check her quiz scores and scheduling history daily. Her math grade went from C to A.",
    name: "Abebe Demeke",
    role: "Parent of Grade 10 Student, Hawassa",
    avatar: "AD",
    rating: 5
  },
  {
    quote: "Being able to upload my lecture notebooks and assign chapter quizzes to my students on StudyCom is excellent. It connects student progress directly to my tutor dashboard.",
    name: "Tutor Selamawit G.",
    role: "Senior Math Instructor, Adama",
    avatar: "SG",
    rating: 5
  }
]

const stats = [
  { value: '12,500+', label: 'Active Students' },
  { value: '94.2%', label: 'EUEE Pass Rate' },
  { value: '650+', label: 'Video Lessons' },
  { value: '50+', label: 'Expert Educators' },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }} className="grid-pattern">
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '0 2rem',
        height: '76px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(10, 10, 15, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-primary)' : 'none',
        zIndex: 1000,
        transition: 'all var(--transition-base)',
      }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Link href="/login" className="btn btn-ghost" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>
            Log In
          </Link>
          <Link href="/signup" className="btn btn-primary" style={{ padding: '0.625rem 1.25rem' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '8rem 1.5rem 6rem',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div className="floating-orb-1" style={{
          position: 'absolute', top: '15%', left: '8%',
          width: 'min(450px, 80vw)', height: 'min(450px, 80vw)',
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />
        <div className="floating-orb-2" style={{
          position: 'absolute', bottom: '15%', right: '8%',
          width: 'min(400px, 70vw)', height: 'min(400px, 70vw)',
          background: 'radial-gradient(circle, rgba(0, 206, 201, 0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          pointerEvents: 'none'
        }} />

        <div style={{ maxWidth: 850, position: 'relative', zIndex: 1 }} className="animate-fade-in-up">
          <div className="tag" style={{ marginBottom: '1.5rem', color: 'var(--brand-primary-light)', borderColor: 'rgba(108, 92, 231, 0.3)' }}>
            <span style={{ fontSize: '1rem' }}>🇪🇹</span> Ethiopia&apos;s Premium Prep Platform
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6.5vw, 4.5rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            letterSpacing: '-0.04em',
            fontFamily: 'var(--font-heading)',
          }}>
            Ace Your{' '}
            <span className="animated-gradient-text">National Exams</span>
            <br />
            with Certified Tutors
          </h1>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--text-secondary)',
            maxWidth: 620,
            margin: '0 auto 2.75rem',
            lineHeight: 1.75,
          }}>
            Syllabus-aligned video lessons, customizable chapter tests, and live tracking designed to help Grades 9-12 students confidently master the EUEE.
          </p>
          <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '1.05rem', padding: '0.875rem 2rem', boxShadow: 'var(--shadow-glow)' }}>
              Start Learning Free →
            </Link>
            <Link href="#how-it-works" className="btn btn-secondary btn-lg" style={{ fontSize: '1.05rem', padding: '0.875rem 2rem' }}>
              See How It Works
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="bounce-arrow" style={{
          position: 'absolute',
          bottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
          cursor: 'pointer',
          color: 'var(--text-tertiary)',
        }}>
          <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, letterSpacing: '0.1em' }}>SCROLL</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <polyline points="19 12 12 19 5 12"></polyline>
          </svg>
        </div>
      </section>

      {/* Social Proof Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          <div className="ticker-item">
            <span>✨ TRUSTED BY 12,000+ STUDENTS</span>
            <span>🎓 ADDIS ABABA SCHOOLS</span>
            <span>📍 HAWASSA CAMPUSES</span>
            <span>🚀 94.2% COLLEGE ENTRANCE PASS RATE</span>
          </div>
          <div className="ticker-item">
            <span>✨ TRUSTED BY 12,000+ STUDENTS</span>
            <span>🎓 ADDIS ABABA SCHOOLS</span>
            <span>📍 HAWASSA CAMPUSES</span>
            <span>🚀 94.2% COLLEGE ENTRANCE PASS RATE</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section style={{
        padding: '5rem 2rem',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          textAlign: 'center',
        }}>
          {stats.map((stat, i) => (
            <div key={i} className="reveal visible" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{
                fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                fontWeight: 800,
                color: 'var(--brand-primary-light)',
                letterSpacing: '-0.02em',
                lineHeight: 1
              }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '7.5rem 2rem', position: 'relative' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="tag" style={{ color: 'var(--brand-primary-light)', marginBottom: '1rem' }}>SIMPLE SYSTEM</span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: '1rem' }}>How It Works</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              StudyCom is built step-by-step to integrate students, parents, and professional tutors.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            position: 'relative',
          }}>
            {/* Connecting lines on desktop */}
            <div style={{
              position: 'absolute',
              top: '52px',
              left: '10%',
              right: '10%',
              height: '2px',
              background: 'linear-gradient(90deg, rgba(108, 92, 231, 0.4) 0%, rgba(0, 206, 201, 0.4) 100%)',
              zIndex: 1,
              display: 'none',
            }} className="desktop-line" />

            {steps.map((step, i) => (
              <div key={i} className="step-card reveal visible">
                <div className="step-number-container">{step.number}</div>
                <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginBottom: '0.75rem', marginTop: '1rem' }}>{step.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, maxWidth: 300 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '7.5rem 2rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="tag" style={{ color: 'var(--brand-primary-light)', marginBottom: '1rem' }}>ROBUST FEATURES</span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: '1rem' }}>Everything You Need to Succeed</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto' }}>
              Advanced academic infrastructure customized for secondary school students.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.75rem',
          }}>
            {features.map((feature, i) => (
              <div key={i} className="card reveal visible" style={{ cursor: 'default', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{
                  width: 50, height: 50,
                  background: 'rgba(108, 92, 231, 0.1)',
                  color: 'var(--brand-primary-light)',
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {feature.icon}
                </div>
                <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, marginTop: '0.5rem' }}>{feature.title}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.65 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section style={{ padding: '7.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="tag" style={{ color: 'var(--brand-primary-light)', marginBottom: '1rem' }}>CURRICULUM FOCUS</span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: '1rem' }}>Subjects We Cover</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              Full coverage of syllabus checkpoints with thousands of practice and review materials.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1.25rem',
            maxWidth: 1000,
            margin: '0 auto',
          }}>
            {subjects.map((subject, i) => (
              <div
                key={i}
                className="subject-card reveal visible"
                style={{ '--glow-color': subject.color } as React.CSSProperties}
              >
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{subject.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 'var(--font-size-base)' }}>{subject.name}</div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-tertiary)', marginTop: '0.25rem' }}>Grades 9 - 12</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ padding: '7.5rem 2rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-primary)', borderBottom: '1px solid var(--border-primary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
            <span className="tag" style={{ color: 'var(--brand-primary-light)', marginBottom: '1rem' }}>STUDENT REVIEWS</span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 800, marginBottom: '1rem' }}>Loved by Ethiopian Students & Parents</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              Read testimonies from users who reached their academic goals with StudyCom.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
          }}>
            {testimonials.map((t, i) => (
              <div key={i} className="testimonial-card reveal visible">
                <span className="quote-icon">“</span>
                <div style={{ display: 'flex', gap: '2px', color: '#ffb900', marginBottom: '1.25rem' }}>
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <span key={idx} style={{ fontSize: '1.25rem' }}>★</span>
                  ))}
                </div>
                <p style={{
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                  fontStyle: 'italic',
                }}>
                  &quot;{t.quote}&quot;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: 42,
                    height: 42,
                    borderRadius: 'var(--radius-full)',
                    background: 'var(--gradient-brand)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 'var(--font-size-xs)',
                    color: 'white',
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, margin: 0 }}>{t.name}</h5>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '8rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(108, 92, 231, 0.15) 0%, transparent 60%)',
          pointerEvents: 'none'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 650, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, marginBottom: '1.25rem', letterSpacing: '-0.03em' }}>
            Ready to Ace Your Entrance Exams?
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2.5rem', fontSize: 'var(--font-size-base)', lineHeight: 1.65 }}>
            Join thousands of Grade 9-12 students who are already using StudyCom to prepare for their academic future.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '1.05rem', padding: '0.875rem 2.25rem', boxShadow: 'var(--shadow-glow)' }}>
            Create Your Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '5rem 2rem 3rem',
        borderTop: '1px solid var(--border-primary)',
        background: '#0c0c12'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          textAlign: 'left',
          marginBottom: '4rem'
        }}>
          {/* Brand block */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 2' }}>
            <Logo />
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, maxWidth: 280 }}>
              Connecting secondary school students, parents, and expert tutors in Ethiopia for academic excellence.
            </p>
          </div>

          {/* Links block 1 */}
          <div>
            <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Product</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="#features" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>Features</Link></li>
              <li><Link href="#how-it-works" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>How it Works</Link></li>
              <li><Link href="/login" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>Tutor Network</Link></li>
            </ul>
          </div>

          {/* Links block 2 */}
          <div>
            <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Resources</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/signup" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>Curriculum Notes</Link></li>
              <li><Link href="/signup" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>EUEE Past Exams</Link></li>
              <li><Link href="/signup" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', textDecoration: 'none' }}>Study Calendar</Link></li>
            </ul>
          </div>

          {/* Links block 3 */}
          <div>
            <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>Company</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>About Us</span></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Contact Support</span></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Terms of Service</span></li>
            </ul>
          </div>
        </div>

        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          borderTop: '1px solid var(--border-secondary)',
          paddingTop: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', margin: 0 }}>
            © 2026 StudyCom. All rights reserved. Prepared according to the Federal Ministry of Education curriculum standards.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)' }}>Built with ❤️ for Ethiopia</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
