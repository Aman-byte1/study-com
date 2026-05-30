import { createClient } from '@supabase/supabase-js'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  // 1. Safety Guard for Environment Variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    console.warn('Supabase URL or Anon Key is missing in environment variables. Skipping auth check.')
    return supabaseResponse
  }

  const storageKey = 'sb-elusyuvarygdxupkvkwi-auth-token'

  // UTF-8 safe base64url decoding
  const decodeBase64Url = (base64url: string) => {
    try {
      const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/')
      const binString = atob(base64)
      const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!)
      return new TextDecoder().decode(bytes)
    } catch (e) {
      console.error('Error decoding cookie base64url:', e)
      return null
    }
  }

  // UTF-8 safe base64url encoding
  const encodeBase64Url = (str: string) => {
    try {
      const bytes = new TextEncoder().encode(str)
      let binString = ''
      bytes.forEach((b) => {
        binString += String.fromCharCode(b)
      })
      return `base64-${btoa(binString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '')}`
    } catch (e) {
      console.error('Error encoding cookie base64url:', e)
      return ''
    }
  }

  const getCookieValue = () => {
    // Try single cookie first
    const single = request.cookies.get(storageKey)?.value
    if (single) {
      if (single.startsWith('base64-')) {
        return decodeBase64Url(single.substring('base64-'.length))
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
        return decodeBase64Url(combined.substring('base64-'.length))
      }
      return combined
    }

    return null
  }

  const setCookieValue = (value: string) => {
    const encoded = encodeBase64Url(value)
    if (!encoded) return

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

  // 2. Wrap all auth flow logic in try-catch to prevent routing lockups
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        storageKey,
        storage: customStorage,
        autoRefreshToken: false,
        persistSession: true,
        detectSessionInUrl: false,
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Public routes that don't require authentication
    const publicRoutes = ['/', '/login', '/signup', '/auth/callback']
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
  } catch (err) {
    console.error('Unexpected error in middleware auth flow:', err)
  }

  return supabaseResponse
}
