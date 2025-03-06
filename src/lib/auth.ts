// Purpose: Define the options for the NextAuth library and the Credentials provider.

// Importing the required modules.
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

// Defining the NextAuth options.
export const authOptions: NextAuthOptions = {
	// Defining the providers.
	providers: [
		CredentialsProvider({
			name: "Credentials",
			// Defining the credentials (input fields).
			credentials: {
				email: { label: "Email", type: "email", placeholder: "email" },
				password: {
					label: "Password",
					type: "password",
					placeholder: "password",
				},
			},
			// Defining the authorize function to authenticate the
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					throw new Error("Please enter your email and password");
				}

				// Logics to authenticate the user.
				try {
					// Connect to the database.
					await connectToDatabase();

					// Find the user by email.
					const user = await User.findOne({ email: credentials.email });

					if (!user) {
						throw new Error("No user found");
					}

					// Compare the password.
					const isValid = await bcrypt.compare(
						credentials.password,
						user.password
					);

					if (!isValid) {
						throw new Error("Invalid password");
					}

					// Return the user as an object.
					return {
						id: user._id.toString(),
						email: user.email,
						role: user.role,
					};
				} catch (error) {
					console.log("Auth Error", error);
					throw error;
				}
			},
		}),
	],

	// Define the callbacks for jwt and session.
	callbacks: {
		// Defining the jwt callback to add the user id and role to the token.
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
			}
			return token;
		},

		// Defining the session callback to add the user id and role to the session.
		async session({ session, token }) {
			session.user.id = token.id as string;
			session.user.role = token.role as string;
			return session;
		},
	},

	// Defining the pages for sign in and error.
	pages: {
		signIn: "/login",
		error: "/login",
	},

	// Defining the session options.
	session: {
		strategy: "jwt",
		maxAge: 30 * 24 * 60 * 60,
	},

	// Defining the secret for the JWT
	secret: process.env.NEXTAUTH_SECRET,
};
