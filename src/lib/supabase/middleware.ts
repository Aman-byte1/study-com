import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const storageKey = 'sb-elusyuvarygdxupkvkwi-auth-token'

  const getCookieValue = () => {
    // Try single cookie first
    const single = request.cookies.get(storageKey)?.value
    if (single) {
      if (single.startsWith('base64-')) {
        try {
          const base64 = single.substring('base64-'.length)
          return atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
        } catch {
          return single
        }
      }
      return single
    }

    // Try chunked cookies
    let chunks: string[] = []
    for (let i = 0; i < 10; i++) {
      const chunk = request.cookies.get(`${storageKey}.${i}`)?.value
      if (chunk) {
        chunks.push(chunk)
      } else {
        break
      }
    }

    if (chunks.length > 0) {
      const combined = chunks.join('')
      if (combined.startsWith('base64-')) {
        try {
          const base64 = combined.substring('base64-'.length)
          return atob(base64.replace(/-/g, '+').replace(/_/g, '/'))
        } catch {
          return combined
        }
      }
      return combined
    }

    return null
  }

  const setCookieValue = (value: string) => {
    const base64 = btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
    const encoded = `base64-${base64}`

    request.cookies.set(storageKey, encoded)
    supabaseResponse = NextResponse.next({
      request,
    })
    supabaseResponse.cookies.set(storageKey, encoded, {
      path: '/',
      sameSite: 'lax',
      secure: true,
    })
  }

  const removeCookieValue = () => {
    request.cookies.delete(storageKey)
    supabaseResponse = NextResponse.next({
      request,
    })
    supabaseResponse.cookies.delete(storageKey)

    // Delete chunks
    for (let i = 0; i < 10; i++) {
      request.cookies.delete(`${storageKey}.${i}`)
      supabaseResponse.cookies.delete(`${storageKey}.${i}`)
    }
  }

  const customStorage = {
    getItem: (key: string) => {
      if (key === storageKey) {
        return getCookieValue()
      }
      return null
    },
    setItem: (key: string, value: string) => {
      if (key === storageKey) {
        setCookieValue(value)
      }
    },
    removeItem: (key: string) => {
      if (key === storageKey) {
        removeCookieValue()
      }
    },
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        storageKey,
        storage: customStorage,
        autoRefreshToken: false,
        persistSession: true,
        detectSessionInUrl: false,
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
