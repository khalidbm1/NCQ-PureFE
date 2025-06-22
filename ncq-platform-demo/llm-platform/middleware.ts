import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/dashboard', '/playground', '/test', '/admin']

// Routes that should redirect to dashboard if already authenticated
const authRoutes = ['/auth/login', '/auth/signup']

// Public routes that don't require authentication
const publicRoutes = ['/', '/pricing', '/docs', '/terms', '/privacy', '/invitation']

// Admin routes that require admin role
const adminRoutes = ['/admin']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Allow auth callback routes
  if (pathname.startsWith('/auth/callback/')) {
    return NextResponse.next()
  }
  
  // Check for platform auth token in cookies
  const platformToken = request.cookies.get('ncq_platform_access_token')?.value
  const isAuthenticated = !!platformToken
  
  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  
  // Check if the route is public
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  
  // Check if the route requires admin access
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  
  // Redirect to login if accessing protected route without authentication
  if (isProtectedRoute && !isAuthenticated) {
    const url = new URL('/auth/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }
  
  // Redirect to dashboard if accessing auth routes while authenticated
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // For admin routes, we'll check permissions in the component since
  // middleware can't access user role from localStorage
  
  // Add platform context headers to the response
  const response = NextResponse.next()
  
  if (isAuthenticated) {
    response.headers.set('X-Platform-Authenticated', 'true')
    response.headers.set('X-Service-Name', 'ncq-llm')
  }
  
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}