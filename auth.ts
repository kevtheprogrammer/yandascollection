import NextAuth from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
 import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: PrismaAdapter(prisma),
	debug: true,
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials: any) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Missing credentials");
				} 
				const user = (await prisma.user.findUnique({
					where: {
						email: credentials?.email,
					},
				})) as any; 
				if (!user) {
					throw new Error("No user found with the email");
				} 
				const isValid = await bcrypt.compare(
					credentials?.password,
					user?.password
				); 
				if (!isValid) {
					throw new Error(
						"email and password do not match. Invalid credentials"
					);
				}
				return {
					id: user.id,
					email: user.email,
					phoneNumber: user.phoneNumber,
					firstName: user.firstName,
					lastName: user.lastName,
					role: user.role,
					emailVerified: user.emailVerified
						? new Date(user.emailVerified)
						: null,
				};
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user && typeof user === "object") {
				token.id = user.id as string;
				token.name = [user.firstName, user.lastName].filter(Boolean).join(" ");
				token.phoneNumber = user.phoneNumber;
				token.email = user.email;
				token.firstName = user.firstName;
				token.lastName = user.lastName;
				token.role = user.role;
				token.emailVerified = user.emailVerified;
			}
			return token;
		},
		async session({ session, token }) {

			// Make sure these fields exist
			if (token) {
				session.user = {
					id: token.id,
					email: token.email,
					name: token.name,
					phoneNumber: token.phoneNumber,
					firstName: token.firstName,
					lastName: token.lastName,
					role: token.role,
					emailVerified: token.emailVerified ?? null,
				};
			}

			return session;
		},
	},

	secret: process.env.AUTH_SECRET,
	session: {
		strategy: "jwt",
	},
});

declare module "next-auth" {
	interface Session {
		user: {
			id: string;
			email: string;
			phoneNumber?: string;
			firstName?: string;
			lastName?: string;
			role?: string;
			name?: string;
			emailVerified?: Date | null;
		};
	}

	interface User {
		id: string;
		email: string;
		phoneNumber?: string;
		firstName?: string;
		lastName?: string;
		role?: string;
		name?: string;
		emailVerified?: Date | null;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		id: string;
		email: string;
		phoneNumber?: string;
		firstName?: string;
		lastName?: string;
		role?: string;
		name?: string;
		emailVerified?: Date | null;
	}
}
