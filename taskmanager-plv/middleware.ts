import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
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
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Routes publiques
  const publicRoutes = ['/login', '/signup']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  // Si pas connecté et route protégée, rediriger vers login
  if (!user && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Si connecté et sur page publique, rediriger vers dashboard approprié
  if (user && isPublicRoute) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      const dashboardUrl = `/dashboard/${profile.role}`
      return NextResponse.redirect(new URL(dashboardUrl, request.url))
    }
  }

  // Vérifier les permissions par rôle pour les routes dashboard
  if (user && request.nextUrl.pathname.startsWith('/dashboard/')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile) {
      const path = request.nextUrl.pathname
      const userRole = profile.role

      // Rediriger si l'utilisateur essaie d'accéder à un dashboard qui n'est pas le sien
      if (path.startsWith('/dashboard/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
      }
      if (path.startsWith('/dashboard/commercial') && userRole !== 'commercial') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
      }
      if (path.startsWith('/dashboard/client') && userRole !== 'client') {
        return NextResponse.redirect(new URL(`/dashboard/${userRole}`, request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
