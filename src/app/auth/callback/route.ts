import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Retrieve user profile to find role
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        if (profile && profile.role) {
          return NextResponse.redirect(`${origin}/${profile.role}`)
        } else {
          // If profile does not exist yet or has no role set (e.g. first-time Google sign up),
          // upsert a default student profile so they can enter the application
          const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'
          
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: user.id,
            role: 'student',
            full_name: fullName,
            phone: null,
            grade_level: 9,
          })

          if (profileError) {
            console.error('Error creating profile for Google sign-in:', profileError)
            return NextResponse.redirect(`${origin}/login?error=profile-creation-failed`)
          }

          return NextResponse.redirect(`${origin}/student`)
        }
      }
    } else {
      console.error('Error exchanging code for session:', error)
    }
  }

  // Redirect to login with error state if verification fails
  return NextResponse.redirect(`${origin}/login?error=oauth-callback-failed`)
}
