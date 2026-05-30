import { NextResponse } from 'next/server'
import { createClient as createServerSupabase } from '@/lib/supabase/server'
import { createClient as createBrowserSupabase } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createServerSupabase()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.session) {
      const { session, user } = data

      // Create an explicitly authenticated supabase client using the access token in headers.
      // This is necessary because Next.js Route Handlers read incoming request cookies (which don't
      // have the session cookies yet during the current request execution).
      const authClient = createBrowserSupabase(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${session.access_token}`,
            },
          },
        }
      )

      // Query profiles using the authenticated client
      const { data: profile } = await authClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const fullName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
      const userRole = user.user_metadata?.role || 'student'

      if (profile && profile.role) {
        // If the profile and role exist, redirect them to the dashboard
        return NextResponse.redirect(`${origin}/${profile.role}`)
      } else {
        // Upsert default profile with student role
        const { error: profileError } = await authClient.from('profiles').upsert({
          id: user.id,
          role: userRole,
          full_name: fullName,
          phone: null,
          grade_level: userRole === 'student' ? 9 : null,
        })

        if (profileError) {
          console.error('Error creating profile during auth callback:', profileError)
          return NextResponse.redirect(`${origin}/login?error=profile-creation-failed&details=${encodeURIComponent(profileError.message)}`)
        }

        return NextResponse.redirect(`${origin}/${userRole}`)
      }
    } else {
      console.error('Error exchanging code for session:', error)
    }
  }

  // Redirect to login with error state if verification fails
  return NextResponse.redirect(`${origin}/login?error=oauth-callback-failed`)
}
