import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const internalPaths = [
    '/',
    '/login',
    '/register',
    '/my-links',
    '/about'
];

const publicPaths = ['/login', '/register'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const token = request.cookies.get('token')?.value ||
        request.headers.get('authorization')?.replace('Bearer ', '');

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
                    fetch(apiEndpoint, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${process.env.PUBLIC_LINKS_SECRET}`
                        }
                    }).catch(error => console.error('Error updating visit count:', error));

                    return NextResponse.redirect(data.originalAddress);
                }
            }

            if (!token) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            return NextResponse.redirect(new URL('/', request.url));

        } catch (error) {
            console.error('Error in middleware redirect:', error);
            if (!token) {
                return NextResponse.redirect(new URL('/login', request.url));
            }
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    const isPublicPath = publicPaths.some(path => pathname.startsWith(path));

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
        '/((?!api|_next/static|_next/image|favicon\\.ico|\\.well-known).*)',
    ],
};
