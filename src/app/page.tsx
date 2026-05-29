'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const features = [
  {
    icon: '🎥',
    title: 'Video Lessons',
    description: 'High-quality video content from expert Ethiopian educators covering the full Grade 9-12 curriculum.'
  },
  {
    icon: '📝',
    title: 'Quizzes & Exams',
    description: 'Practice with hundreds of questions modeled after the Ethiopian University Entrance Exam (EUEE).'
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'Personalized study schedules that adapt to each student\'s pace and availability.'
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Real-time analytics for students, parents, and tutors to monitor academic growth.'
  },
  {
    icon: '💬',
    title: 'Direct Messaging',
    description: 'Students can ask questions directly to their tutors and get timely responses.'
  },
  {
    icon: '📚',
    title: 'Study Notes',
    description: 'Download comprehensive notes and study materials prepared by qualified tutors.'
  }
]

const subjects = [
  { name: 'Mathematics', icon: '📐', color: '#6c5ce7' },
  { name: 'Physics', icon: '⚛️', color: '#00cec9' },
  { name: 'Chemistry', icon: '🧪', color: '#fd79a8' },
  { name: 'Biology', icon: '🧬', color: '#00b894' },
  { name: 'English', icon: '📖', color: '#74b9ff' },
  { name: 'Amharic', icon: '🇪🇹', color: '#fdcb6e' },
]

const stats = [
  { value: '500+', label: 'Video Lessons' },
  { value: '1000+', label: 'Quiz Questions' },
  { value: '50+', label: 'Expert Tutors' },
  { value: '4', label: 'Grade Levels' },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '0 2rem',
        height: '72px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: scrolled ? 'rgba(10, 10, 15, 0.9)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-primary)' : 'none',
        zIndex: 1000,
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: 40, height: 40,
            background: 'var(--gradient-brand)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.25rem'
          }}>📖</div>
          <span style={{
            fontSize: 'var(--font-size-xl)',
            fontWeight: 800,
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>StudyCom</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/login" className="btn btn-ghost" style={{ color: 'var(--text-secondary)' }}>Log In</Link>
          <Link href="/signup" className="btn btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '6rem 2rem 4rem',
        background: 'var(--gradient-hero)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background orbs */}
        <div style={{
          position: 'absolute', top: '20%', left: '10%',
          width: 400, height: 400,
          background: 'radial-gradient(circle, rgba(108, 92, 231, 0.15) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          animation: 'float 6s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', right: '10%',
          width: 350, height: 350,
          background: 'radial-gradient(circle, rgba(0, 206, 201, 0.12) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite reverse',
        }} />
        <div style={{
          position: 'absolute', top: '40%', right: '30%',
          width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(253, 121, 168, 0.1) 0%, transparent 70%)',
          borderRadius: '50%', filter: 'blur(40px)',
          animation: 'float 5s ease-in-out infinite 1s',
        }} />

        <div style={{ maxWidth: 800, position: 'relative', zIndex: 1 }} className="animate-fade-in-up">
          <div className="badge badge-primary" style={{ marginBottom: '1.5rem', display: 'inline-flex' }}>
            🇪🇹 Ethiopia&apos;s #1 Tutoring Platform
          </div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 4rem)',
            fontWeight: 900,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
          }}>
            Ace Your{' '}
            <span style={{
              background: 'var(--gradient-brand)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>National Exams</span>
            {' '}with Expert Tutors
          </h1>
          <p style={{
            fontSize: 'var(--font-size-lg)',
            color: 'var(--text-secondary)',
            maxWidth: 600,
            margin: '0 auto 2.5rem',
            lineHeight: 1.7,
          }}>
            Personalized tutoring, video lessons, practice quizzes, and real-time progress tracking for Grade 9-12 students preparing for the EUEE.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
              Start Learning Free →
            </Link>
            <Link href="#features" className="btn btn-secondary btn-lg" style={{ fontSize: '1rem' }}>
              Explore Features
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{
        padding: '4rem 2rem',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-primary)',
        borderBottom: '1px solid var(--border-primary)',
      }}>
        <div style={{
          maxWidth: 1000,
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}>
          {stats.map((stat, i) => (
            <div key={i} className={`animate-fade-in-up stagger-${i + 1}`}>
              <div style={{
                fontSize: 'var(--font-size-4xl)',
                fontWeight: 900,
                background: 'var(--gradient-brand)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                marginBottom: '0.5rem',
              }}>{stat.value}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Everything You Need to <span style={{
            background: 'var(--gradient-brand)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>Succeed</span></h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
            A complete learning ecosystem designed specifically for Ethiopian students.
          </p>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}>
          {features.map((feature, i) => (
            <div key={i} className={`card animate-fade-in-up stagger-${i + 1}`} style={{ cursor: 'default' }}>
              <div style={{
                width: 56, height: 56,
                background: 'rgba(108, 92, 231, 0.12)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.75rem',
                marginBottom: '1rem',
              }}>
                {feature.icon}
              </div>
              <h4 style={{ marginBottom: '0.5rem' }}>{feature.title}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', lineHeight: 1.6 }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects */}
      <section style={{ padding: '6rem 2rem', background: 'var(--bg-secondary)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ marginBottom: '1rem' }}>Subjects We Cover</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              Full curriculum coverage for the Ethiopian Grade 9-12 syllabus and national examination.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
            gap: '1rem',
            maxWidth: 800,
            margin: '0 auto',
          }}>
            {subjects.map((subject, i) => (
              <div key={i} className={`animate-fade-in-up stagger-${i + 1}`} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-primary)',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'default',
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{subject.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 'var(--font-size-sm)' }}>{subject.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '6rem 2rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(108, 92, 231, 0.15) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ marginBottom: '1rem' }}>Ready to Start Your Journey?</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
            Join thousands of Ethiopian students already preparing for academic excellence with StudyCom.
          </p>
          <Link href="/signup" className="btn btn-primary btn-lg" style={{ fontSize: '1rem' }}>
            Create Free Account →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        padding: '3rem 2rem',
        borderTop: '1px solid var(--border-primary)',
        textAlign: 'center',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{
            width: 32, height: 32,
            background: 'var(--gradient-brand)',
            borderRadius: 'var(--radius-md)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1rem'
          }}>📖</div>
          <span style={{ fontWeight: 700, fontSize: 'var(--font-size-lg)' }}>StudyCom</span>
        </div>
        <p style={{ color: 'var(--text-tertiary)', fontSize: 'var(--font-size-sm)' }}>
          © 2026 StudyCom. Built with ❤️ for Ethiopian students.
        </p>
      </footer>
    </div>
  )
}
