// Purpose: Register user API route.

// Importing the required modules.
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";

// defining the POST request handler and exporting it.
export async function POST(request: NextRequest) {
	// Try to register the user.
	try {
		// Get the email and password from the request body.
		const { email, password } = await request.json();

		// Check if the email or password is missing.
		if (!email || !password) {
			return NextResponse.json(
				{ error: "Email and password are required" },
				{ status: 400 }
			);
		}

		// Connect to the database.
		await connectToDatabase();

		// Check if the user already exists.
		const existingUser = await User.findOne({ email });

		// If the user exists, return an error.
		if (existingUser) {
			return NextResponse.json(
				{ error: "Email is already registered" },
				{ status: 400 }
			);
		}

		// Create a new user.
		await User.create({ email, password });

		// Return a success response.
		return NextResponse.json(
			{ message: "User registered successfully" },
			{ status: 201 }
		);
	} catch (error) {
		// Return an error response.
		return NextResponse.json(
			{ error: "Failed to register user" },
			{ status: 500 }
		);
	}
}
