'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg width="36" height="36" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="38" height="38" fill="var(--bg-secondary)" stroke="var(--brand-primary)" strokeWidth="1.5" />
        <path d="M12 26V12H20V26" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="square" />
        <path d="M26 26V15H20" stroke="var(--brand-primary)" strokeWidth="2" strokeLinecap="square" />
        <line x1="15" y1="18" x2="23" y2="18" stroke="var(--text-tertiary)" strokeWidth="1" />
        <line x1="15" y1="22" x2="23" y2="22" stroke="var(--text-tertiary)" strokeWidth="1" />
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

const features = [
  {
    code: "CURR-0912",
    title: 'Curriculum Video Lessons',
    description: 'High-definition video courses from expert Ethiopian educators mapped exactly to the Grades 9-12 national syllabus.'
  },
  {
    code: "EUEE-PREP",
    title: 'Interactive National Prep',
    description: 'Simulate the Ethiopian University Entrance Exam (EUEE) with thousands of past questions and immediate deep analytics.'
  },
  {
    code: "SCHD-AUTO",
    title: 'AI-Guided Scheduling',
    description: 'A study calendar that auto-adjusts based on your exam dates, current progress levels, and daily availability.'
  },
  {
    code: "ANLY-TUTR",
    title: 'Progress Insights',
    description: 'Real-time performance graphs and dashboards for students, linking tutors and parents to unified tracking.'
  },
  {
    code: "CHAT-LIVE",
    title: 'Instant Tutor Chat',
    description: 'Unstuck instantly. Secure 1-on-1 text channel linking you to verified expert instructors for custom guidance.'
  },
  {
    code: "DOCS-CURD",
    title: 'Curated Study Materials',
    description: 'Downloadable summary notebooks, formulas booklets, and sample test collections created by certified tutors.'
  }
]

const subjects = [
  { name: 'Mathematics', icon: '📐', code: 'MATH' },
  { name: 'Physics', icon: '⚛️', code: 'PHYS' },
  { name: 'Chemistry', icon: '🧪', code: 'CHEM' },
  { name: 'Biology', icon: '🧬', code: 'BIOL' },
  { name: 'English', icon: '🗣️', code: 'ENGL' },
  { name: 'Civics', icon: '⚖️', code: 'CIVC' },
]

const steps = [
  {
    number: '01',
    phase: 'REGISTRATION',
    title: 'Select Your Path',
    description: 'Sign up as a student, parent, or tutor. Customize your grade level and target curriculum in seconds.'
  },
  {
    number: '02',
    phase: 'ACQUISITION',
    title: 'Unlock Premium Content',
    description: 'Study syllabus-aligned lessons, take interactive chapter quizzes, and ask questions to professional tutors.'
  },
  {
    number: '03',
    phase: 'EVALUATION',
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
  },
  {
    quote: "As a parent, I used to worry about whether my daughter was studying. StudyCom allows me to check her quiz scores and scheduling history daily. Her math grade went from C to A.",
    name: "Abebe Demeke",
    role: "Parent of Grade 10 Student, Hawassa",
    avatar: "AD",
  },
  {
    quote: "Being able to upload my lecture notebooks and assign chapter quizzes to my students on StudyCom is excellent. It connects student progress directly to my tutor dashboard.",
    name: "Tutor Selamawit G.",
    role: "Senior Math Instructor, Adama",
    avatar: "SG",
  }
]

const stats = [
  { value: '12,500+', label: 'Active Students', code: 'STAT-01' },
  { value: '94.2%', label: 'EUEE Pass Rate', code: 'STAT-02' },
  { value: '650+', label: 'Video Lessons', code: 'STAT-03' },
  { value: '50+', label: 'Expert Educators', code: 'STAT-04' },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh', position: 'relative' }}>
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
        background: scrolled ? 'var(--bg-secondary)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border-primary)' : 'none',
        zIndex: 1000,
        transition: 'background var(--transition-base)',
      }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <Link href="/login" style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>
            Log In
          </Link>
          <Link href="/signup" className="btn btn-secondary" style={{ padding: '0.5rem 1rem', border: '1px solid var(--brand-primary)', color: 'var(--brand-primary)' }}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        alignItems: 'center',
        padding: '8rem 2rem 4rem',
        maxWidth: 1200,
        margin: '0 auto',
        gap: '4rem',
      }}>
        <div className="animate-fade-in-up" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontStyle: 'normal', fontSize: '0.875rem' }}>🇪🇹</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--brand-primary)', letterSpacing: '0.1em' }}>
              ETHIOPIA&apos;S CURRICULUM ARCHIVE
            </span>
          </div>
          
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: 500,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            fontFamily: 'var(--font-heading)',
          }}>
            Ace Your <span style={{ color: 'var(--brand-primary)', fontStyle: 'italic' }}>National Exams</span> with Certified Tutors
          </h1>

          <p style={{
            fontSize: 'var(--font-size-base)',
            color: 'var(--text-secondary)',
            lineHeight: 1.7,
            maxWidth: 540,
          }}>
            Syllabus-aligned video lessons, custom examination simulator metrics, and live study schedules designed to help Grades 9–12 students master the national curriculum checkpoints.
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
              Start Learning Free
            </Link>
            <Link href="#how-it-works" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem' }}>
              Study Methodology
            </Link>
          </div>
        </div>

        {/* Visual Hero Card - Asymmetric Editorial Sheet */}
        <div className="animate-scale-in" style={{ position: 'relative' }}>
          <div style={{
            border: '1px solid var(--border-primary)',
            background: 'var(--bg-secondary)',
            padding: '2.5rem',
            position: 'relative',
            zIndex: 2,
            boxShadow: '8px 8px 0px rgba(216, 168, 56, 0.15)',
          }}>
            {/* Header info */}
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-primary)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>DOC: EUEE-STUDY-LOG</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--brand-primary)' }}>STATUS: ACTIVE</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>SCHEDULED PREPARATION</span>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--font-size-xl)', fontWeight: 500, marginTop: '2px' }}>
                  Mathematics (Grade 12)
                </h3>
              </div>

              {/* Monospaced statistics box */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.01)',
                border: '1px dashed var(--border-primary)',
                padding: '1.25rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem'
              }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>LAST PRACTICE SCORE</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--brand-primary)', fontWeight: 700 }}>88%</div>
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>SAGE CONFIDENCE INDEX</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', color: 'var(--brand-secondary-light)', fontWeight: 700 }}>HIGH</div>
                </div>
              </div>

              {/* Progress Line */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <span>EUEE BLUEPRINT COMPLETION</span>
                  <span>78%</span>
                </div>
                <div style={{ height: '3px', background: 'var(--border-primary)', width: '100%' }}>
                  <div style={{ height: '100%', background: 'var(--gradient-brand)', width: '78%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Ticker */}
      <div className="ticker-wrap">
        <div className="ticker">
          <div className="ticker-item">
            <span style={{ fontFamily: 'var(--font-mono)' }}>[01] TRUSTED BY 12,000+ ENROLLED STUDENTS</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>[02] ALIGNED WITH FEDERAL MINISTRY OF EDUCATION</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>[03] 94.2% NATIONAL UNIVERSITY ENTRY RATIO</span>
          </div>
          <div className="ticker-item">
            <span style={{ fontFamily: 'var(--font-mono)' }}>[01] TRUSTED BY 12,000+ ENROLLED STUDENTS</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>[02] ALIGNED WITH FEDERAL MINISTRY OF EDUCATION</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>[03] 94.2% NATIONAL UNIVERSITY ENTRY RATIO</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section style={{
        padding: '6rem 2rem',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <div style={{
          maxWidth: 1100,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
        }}>
          {stats.map((stat, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', borderLeft: '1px solid var(--border-primary)', paddingLeft: '1.5rem' }}>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-tertiary)' }}>{stat.code}</span>
              <div style={{
                fontSize: 'clamp(2.5rem, 4vw, 3rem)',
                fontWeight: 600,
                color: 'var(--brand-primary)',
                fontFamily: 'var(--font-heading)',
                fontStyle: 'italic',
                lineHeight: 1
              }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: '5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '2.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--brand-primary)', letterSpacing: '0.1em' }}>
              PREPARATION CYCLE
            </span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 500, fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
              Academic Onboarding & Progress System
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '3rem',
          }}>
            {steps.map((step, i) => (
              <div key={i} className="card" style={{ position: 'relative', overflow: 'hidden' }}>
                <span className="serif-number">{step.number}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--brand-secondary-light)' }}>
                  PHASE: {step.phase}
                </span>
                <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, marginBottom: '0.75rem', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  {step.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" style={{
        padding: '8rem 2rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: '5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '2.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--brand-primary)', letterSpacing: '0.1em' }}>
              FUNCTIONAL SPECIFICATIONS
            </span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 500, fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
              Everything You Need to Excel
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}>
            {features.map((feature, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--brand-primary)' }}>
                  [{feature.code}]
                </span>
                <h4 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, fontFamily: 'var(--font-heading)' }}>
                  {feature.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Curriculum Subjects */}
      <section style={{ padding: '8rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: '5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '2.5rem', textAlign: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--brand-primary)', letterSpacing: '0.1em' }}>
              ACADEMIC CATEGORIES
            </span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 500, fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
              National Examination Coverage
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '1.5rem',
            maxWidth: 1000,
            margin: '0 auto',
          }}>
            {subjects.map((subject, i) => (
              <div
                key={i}
                style={{
                  border: '1px solid var(--border-primary)',
                  background: 'var(--bg-secondary)',
                  padding: '2rem 1.5rem',
                  textAlign: 'center',
                  boxShadow: '3px 3px 0px rgba(216, 168, 56, 0.05)',
                  position: 'relative'
                }}
              >
                <div style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>{subject.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-base)', fontFamily: 'var(--font-heading)' }}>{subject.name}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-tertiary)', marginTop: '0.5rem' }}>
                  CLASS: {subject.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{
        padding: '8rem 2rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
        borderBottom: '1px solid var(--border-primary)'
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ marginBottom: '5rem', borderBottom: '1px solid var(--border-primary)', paddingBottom: '2.5rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--font-size-xs)', color: 'var(--brand-primary)', letterSpacing: '0.1em' }}>
              USER FEEDBACK
            </span>
            <h2 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 500, fontFamily: 'var(--font-heading)', marginTop: '0.5rem' }}>
              Scholarly Verification & Reviews
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}>
            {testimonials.map((t, i) => (
              <div key={i} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <p style={{
                  color: 'var(--text-primary)',
                  fontSize: 'var(--font-size-sm)',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                }}>
                  &quot;{t.quote}&quot;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: 'auto', borderTop: '1px solid var(--border-secondary)', paddingTop: '1rem' }}>
                  <div style={{
                    width: 38,
                    height: 38,
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--brand-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: 'var(--font-size-xs)',
                    color: 'var(--brand-primary)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {t.avatar}
                  </div>
                  <div>
                    <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, margin: 0 }}>{t.name}</h5>
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '8rem 2rem', textAlign: 'center' }}>
        <div style={{ maxWidth: 650, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <h2 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 500, fontFamily: 'var(--font-heading)' }}>
            Start Your Academic Preparation Today
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-base)', lineHeight: 1.7 }}>
            Unlock syllabus video checkpoints, customize simulation entrance tests, and review notes created by verified tutors under national guidelines.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/signup" className="btn btn-primary" style={{ padding: '0.875rem 2rem' }}>
              Create Your Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '5rem 2rem 3rem',
        borderTop: '1px solid var(--border-primary)',
        background: '#07080d'
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '4rem'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 2' }}>
            <Logo />
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6, maxWidth: 280 }}>
              Connecting secondary school students, parents, and expert tutors in Ethiopia for academic excellence.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>Product</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="#features" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Features</Link></li>
              <li><Link href="#how-it-works" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Methodology</Link></li>
              <li><Link href="/login" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Tutors Network</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>Resources</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><Link href="/signup" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Curriculum Notes</Link></li>
              <li><Link href="/signup" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>EUEE Simulation</Link></li>
              <li><Link href="/signup" style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Study Calendar</Link></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: 'var(--font-size-sm)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '1.5rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>Guidelines</h5>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Ministry Syllabus</span></li>
              <li><span style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>Privacy Protocol</span></li>
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
          <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', margin: 0, fontFamily: 'var(--font-mono)' }}>
            © 2026 StudyCom. All rights reserved. Prepared under curriculum standards.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-xs)', fontFamily: 'var(--font-mono)' }}>
              BUILT FOR ETHIOPIAN EXCELLENCE
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
