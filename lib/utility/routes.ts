/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * @type {string[]}
 */
export const publicRoutes = [   
    "/",
    "/signin", 
    "/products/*", 
    "/reset-password",
    "/verify-email",
];

/**
 * An array of routes that are used for authentication
 * These routes will redirect logged in users to /dashboard
 * @type {string[]}
 */
export const authRoutes = ["/signin","/signout"];

/**
 * The prefix for API authentication routes
 * Routes that start with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const STAFF_LOGIN_REDIRECT = "/business";
export const CUSTOMER_LOGIN_REDIRECT = "/client";