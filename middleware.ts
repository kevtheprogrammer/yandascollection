// middleware.ts
// This middleware handles access control for the business and client sections of the application
// It checks user roles and redirects accordingly
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';  // NextAuth helper for reading JWT tokens

export async function middleware(req: any) {
    const token = (await getToken({
            req,
            secret: process.env.AUTH_SECRET,
            cookieName:
                process.env.NODE_ENV === "production"
                    ? "__Secure-authjs.session-token"
                    : "authjs.session-token",
        })) as {
            email: string;
            role: string;
            name: string;
            access: string;
            id: string;
        } | null;

    const pathname = req.nextUrl.pathname;
    const isDashboard = pathname.startsWith("/business");
    const isCheckout = pathname.startsWith("/checkout");
    const isProtected = isDashboard || isCheckout;
 
    if (isProtected && !token) {
        const signInUrl = req.nextUrl.clone();
        signInUrl.pathname = "/signin";
        signInUrl.searchParams.set("callbackUrl", pathname); // Add callbackUrl
        return NextResponse.redirect(signInUrl);
    }

    // If user is logged in and has the correct role, continue to the requested route
    return NextResponse.next();
}

// Apply middleware to the routes inside the /business and /client folders
export const config = {
    matcher: [
        '/business/:path*', // All routes within /business
        '/checkout/:path*', // All routes within /business
    ],
};



// {
//     href: 'http://localhost:3000/business/users',
//     origin: 'http://localhost:3000',
//     protocol: 'http:',
//     username: '',
//     password: '',
//     host: 'localhost:3000',
//     hostname: 'localhost',
//     port: '3000',
//     pathname: '/business/users',
//     search: '',
//     searchParams: URLSearchParams {  },
//     hash: ''
//   } /business/users