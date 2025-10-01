 'use client';

import { SessionProvider } from "next-auth/react";

interface AuthProviderProps {
    children: React.ReactNode;
    session: any; // Ideally, replace `any` with the appropriate session type from next-auth if available
}

export default function AuthProvider({ children, session }: AuthProviderProps) {
     
    return (
        <SessionProvider session={session}>
            {children}
        </SessionProvider>
    );
}
