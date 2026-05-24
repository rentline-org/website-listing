import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  
  // Get hostname of request (e.g. demo.rentline.io, demo.localhost:3000)
  const hostname = req.headers.get('host') || '';
  
  // Define allowed domains (including localhost for local development)
  const allowedDomains = ['rentline.io', 'localhost:3000'];

  // Check if the current hostname is a subdomain
  const isSubdomain = !allowedDomains.includes(hostname);

  if (isSubdomain) {
    // Extract the subdomain. 
    // e.g. demo.rentline.io -> demo
    // e.g. demo.localhost:3000 -> demo
    const subdomain = hostname.split('.')[0];
    
    // Rewrite the request to the `/[subdomain]` dynamic route
    // e.g. /about will rewrite to /demo/about
    return NextResponse.rewrite(new URL(`/${subdomain}${url.pathname}`, req.url));
  }
  
  return NextResponse.next();
}
