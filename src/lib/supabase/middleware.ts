import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/login', '/signup']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route)

  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // If authenticated user visits login/signup, redirect to dashboard
  if (user && (request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/signup')) {
    // Get user role from profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || 'student'
    const url = request.nextUrl.clone()
    url.pathname = `/${role}`
    return NextResponse.redirect(url)
  }

  // Role-based route protection
  if (user) {
    const protectedPrefixes = ['/student', '/parent', '/tutor', '/admin']
    const matchedPrefix = protectedPrefixes.find(prefix =>
      request.nextUrl.pathname.startsWith(prefix)
    )

    if (matchedPrefix) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      const role = profile?.role
      const requiredRole = matchedPrefix.slice(1) // remove leading /

      if (role !== requiredRole) {
        const url = request.nextUrl.clone()
        url.pathname = `/${role || 'student'}`
        return NextResponse.redirect(url)
      }
    }
  }

  return supabaseResponse
}
