/**
 * Next.js Middleware
 *
 * Handles redirects for old URL structures and other request processing
 */

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { handleRedirects } from './lib/redirects';

export function middleware(request: NextRequest) {
  // Handle 404 fix redirects first
  const redirect = handleRedirects(request);
  if (redirect) {
    return redirect;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, videos, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:jpg|jpeg|png|gif|webp|svg|ico|mp4|webm|css|js)$).*)',
  ],
};
