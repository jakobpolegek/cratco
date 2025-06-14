import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const internalPaths = [
    '/',
    '/login',
    '/register',
    '/my-links',
    '/about'
];

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;

    const { pathname } = request.nextUrl;

    const isInternalPath = internalPaths.some(path =>
        path === '/' ? pathname === path : pathname.startsWith(path)
    );

    if (!isInternalPath) {
        try {
            const alias = pathname.slice(1);
            const apiEndpoint = `${process.env.NEXT_PUBLIC_API_SRC}/links/public-links/${alias}`;

            const response = await fetch(apiEndpoint, {
                headers: {
                    'Authorization': `Bearer ${process.env.PUBLIC_LINKS_SECRET}`
                }
            });

            if (response.ok) {
                const { data } = await response.json();
                if (data.originalAddress) {
                    return NextResponse.redirect(data.originalAddress);
                }
            }

            return NextResponse.redirect(new URL('/', request.url));

        } catch (error) {
            console.error('Error in middleware redirect:', error);
            return NextResponse.redirect(new URL('/', request.url));
        }
    }
    const isPublicPath = ['/login', '/register'].some(path => pathname.startsWith(path));

    if (isPublicPath) {
        if (token) {
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
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon\\.ico|\\.well-known).*)',
    ],
};
