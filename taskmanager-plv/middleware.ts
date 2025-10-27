import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Si pas de session, rediriger vers login
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  // Si session existe, vérifier le rôle et rediriger
  if (session) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile) {
      const { role } = profile
      
      // Redirection selon le rôle
      if (req.nextUrl.pathname === '/dashboard') {
        if (role === 'admin') {
          return NextResponse.redirect(new URL('/dashboard/admin', req.url))
        } else if (role === 'commercial') {
          return NextResponse.redirect(new URL('/dashboard/commercial', req.url))
        } else if (role === 'client') {
          return NextResponse.redirect(new URL('/dashboard/client', req.url))
        }
      }

      // Protection des routes selon le rôle
      if (req.nextUrl.pathname.startsWith('/dashboard/admin') && role !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      if (req.nextUrl.pathname.startsWith('/dashboard/commercial') && role !== 'commercial') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
      if (req.nextUrl.pathname.startsWith('/dashboard/client') && role !== 'client') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*']
}
