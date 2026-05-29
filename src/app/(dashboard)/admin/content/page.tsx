'use client'

export default function AdminContentPage() {
  return (
    <div className="animate-fade-in">
      <h2 style={{ marginBottom: '0.5rem' }}>Content Management</h2>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
        Manage videos, notes, and educational materials across all courses.
      </p>

      <div className="content-grid">
        <div className="card-static">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🎥</div>
          <h4 style={{ marginBottom: '0.5rem' }}>Video Lessons</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>
            Videos are hosted on YouTube (unlisted) and linked via URL. Tutors add videos through their course management pages.
          </p>
          <a href="/admin/courses" className="btn btn-secondary btn-sm">Manage Courses →</a>
        </div>

        <div className="card-static">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
          <h4 style={{ marginBottom: '0.5rem' }}>Study Notes</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>
            PDFs and documents are stored in Supabase Storage (1GB free). Tutors upload notes through the Upload Content page.
          </p>
          <span className="badge badge-info">Supabase Storage</span>
        </div>

        <div className="card-static">
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>❓</div>
          <h4 style={{ marginBottom: '0.5rem' }}>Quizzes</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-sm)', marginBottom: '1rem' }}>
            Tutors create quizzes with multiple choice questions. Quizzes can be flagged as national exam prep.
          </p>
          <span className="badge badge-primary">Tutor Managed</span>
        </div>
      </div>
    </div>
  )
}
