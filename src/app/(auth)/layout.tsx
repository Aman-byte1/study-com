export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-hero)',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background orbs */}
      <div style={{
        position: 'absolute', top: '15%', left: '5%',
        width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(108, 92, 231, 0.12) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute', bottom: '10%', right: '5%',
        width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(0, 206, 201, 0.1) 0%, transparent 70%)',
        borderRadius: '50%', filter: 'blur(60px)',
        animation: 'float 6s ease-in-out infinite reverse',
      }} />
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 460 }}>
        {children}
      </div>
    </div>
  )
}
