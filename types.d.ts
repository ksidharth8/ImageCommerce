// Purpose: Define global types for the project.

// Import mongoose
import { Connection } from "mongoose";

// Define global types
declare global {
	// Define mongoose property which can be either connection or promise
	var mongoose: {
		// Define connection property
		conn: Connection | null;
		// Define promise property
		promise: Promise<Connection> | null;
	};
}

export {};
