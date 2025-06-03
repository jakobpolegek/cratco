import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

    if (isPublicPath) {
        if (token && (pathname === '/login' || pathname === '/register')) {
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
    ],
};
