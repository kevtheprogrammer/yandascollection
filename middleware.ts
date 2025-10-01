// middleware.ts
// This middleware handles access control for the business and client sections of the application
// It checks user roles and redirects accordingly
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';  // NextAuth helper for reading JWT tokens

export async function middleware(req: any) {
    const url = req.nextUrl.clone();
    const path = url.pathname;

    // Allow all non-business and non-client routes (so they don't get affected by middleware)
    if (!path.startsWith('/business') && !path.startsWith('/client') && !path.startsWith('/checkout')) {
        return NextResponse.next();
    }

    

    // Get the JWT token from the request (this contains user info like role)
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // If there is no token (user is not logged in), redirect to signin page
    if (!token) {
        url.pathname = '/signin';
        return NextResponse.redirect(url);
    }

    // If the user is STAFF, allow access to the /business page
    if (token.role === 'STAFF') {
        // Redirect STAFF users to the business section if they try to access /client
        if (path.startsWith('/client')) {
            url.pathname = '/business'; // Redirect STAFF to /business
            return NextResponse.redirect(url);
        }
    }

    // If the user is CUSTOMER, allow access to the /client page
    if (token.role === 'CUSTOMER') {
        // Redirect CUSTOMER users to the client section if they try to access /business
        if (path.startsWith('/business')) {
            url.pathname = '/client'; // Redirect CUSTOMER to /client
            return NextResponse.redirect(url);
        }
    }

    // If user is logged in and has the correct role, continue to the requested route
    return NextResponse.next();
}

// Apply middleware to the routes inside the /business and /client folders
export const config = {
    matcher: [
        '/business/:path*', // All routes within /business
        '/client/:path*',    // All routes within /client
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