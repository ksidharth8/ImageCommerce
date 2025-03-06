// Purpose: Define the route for the NextAuth API.

// Import required modules
import { authOptions } from "@/lib/auth";
import NextAuth from "next-auth";

// Define the handler for the route
const handler = NextAuth(authOptions);

// Export the handler
export { handler as GET, handler as POST };
