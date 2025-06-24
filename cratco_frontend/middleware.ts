import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicOnlyPaths = ['/login', '/register'];
const protectedPaths = ['/my-links'];
const allAppPaths = ['/', '/login', '/register', '/my-links', '/about'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = await getToken({
        req: request,
        secret: process.env.NEXTAUTH_SECRET
    });

    if (token && publicOnlyPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    const isAppPath = allAppPaths.some(path =>
        path === '/' ? pathname === path : pathname.startsWith(path)
    ) || pathname.match(/^\/my-links\/[^\/]+$/);

    if (!isAppPath) {
        try {
            const alias = pathname.slice(1);
            const apiEndpoint = `${process.env.NEXT_PUBLIC_API_SRC}/links/public-links/${alias}`;

            const response = await fetch(apiEndpoint, {
                headers: { 'Authorization': `Bearer ${process.env.PUBLIC_LINKS_SECRET}` }
            });

            if (!response.ok) {
                console.error(`API error for public link '${alias}': Status ${response.status}`);
                return NextResponse.redirect(new URL('/login', request.url));
            }

            const { data } = await response.json();
            if (data.originalAddress) {
                fetch(apiEndpoint, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.PUBLIC_LINKS_SECRET}` }
                }).catch(error => console.error('Error updating visit count:', error));

                return NextResponse.redirect(data.originalAddress);
            }

            return NextResponse.redirect(new URL(token ? '/' : '/login', request.url));

        } catch (error) {
            console.error('Network error in public link middleware:', error);
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    const isProtectedRoute = protectedPaths.some(path => pathname.startsWith(path)) || pathname === '/';
    if (!token && isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api/auth|_next/static|_next/image|favicon\\.ico|\\.well-known).*)',
    ],
};
