// Description: This file contains the database connection logic.

// Importing required modules.
import mongoose from "mongoose";

// Defining the MONGODB_URI environment variable.
const MONGODB_URI = process.env.MONGODB_URI!; // ! is used to tell typescript that the variable is defined.

// Checking if the MONGODB_URI environment variable is defined.
if (!MONGODB_URI) {
	throw new Error(
		"Please define the MONGO_URI environment variable inside environment file"
	);
}

// Defining the cached variable.
let cached = global.mongoose;

// Checking if the cached variable is defined otherwise defining it as null.
if (!cached) {
	cached = global.mongoose = { conn: null, promise: null };
}

// Exporting the defined connectToDatabase function.
export async function connectToDatabase() {
	// if database connection is already cached, return the connection.
	if (cached.conn) {
		return cached.conn;
	}

	// if promise is not defined, create a new promise and connect to the database.
	if (!cached.promise) {
		// Defining the options for the database connection.
		const opts = {
			bufferCommands: false, // Disable mongoose buffering
			maxPoolSize: 10, // Maximum number of connections in the connection pool
		};

		// Connecting to the database and returning the connection.
		cached.promise = mongoose
			.connect(MONGODB_URI, opts)
			.then(() => mongoose.connection);
	}

	// Waiting for the promise to resolve.
	try {
		cached.conn = await cached.promise;
	} catch (error) {
		cached.promise = null;
		throw new Error("Error connecting to database");
	}

	// Returning the connection.
	return cached.conn;
}
