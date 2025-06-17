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
                    try {
                        const updateEndpoint = `${process.env.NEXT_PUBLIC_API_SRC}/links/${data._id}`;
                        const currentVisits = data.visits;

                        await fetch(updateEndpoint, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${process.env.PUBLIC_LINKS_SECRET}`
                            },
                            body: JSON.stringify({
                                visits: currentVisits + 1
                            })
                        });

                    } catch (updateError) {
                        console.error('Error updating visit count:', updateError);
                    }

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
        return token
            ? NextResponse.redirect(new URL('/', request.url))
            : NextResponse.next();
    }
    return token
        ? NextResponse.next()
        : NextResponse.redirect(new URL('/login', request.url));

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
