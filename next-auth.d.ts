// Purpose: Define the shape of the session object that is returned by the NextAuth.js library.

// Importing the required modules.
import { DefaultSession } from "next-auth";

// Extending the session object.
declare module "next-auth" {
	interface Session {
		user: {
            role:string;
			id: string;
		} & DefaultSession["user"];
	}

    interface User {
        role: string;
    }
}

// Exporting the module.
export {};