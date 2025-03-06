// Purpose: Define the Product route.

// Import the required modules.
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import { NextRequest, NextResponse } from "next/server";

// Define the GET request handler.
export async function GET(
	request: NextRequest,
	props: { params: Promise<{ id: string }> }
) {
	try {
		// Get the id from the request parameters.
		const { id } = await props.params;

		// Connect to the database and fetch all product of the given id.
		await connectToDatabase();
		const product = await Product.findById(id).lean(); // Lean to convert to plain JS object.

		// If not found the product, return a 404 response.
		if (!product) {
			return NextResponse.json(
				{ message: "No product found" },
				{ status: 404 }
			);
		}

		// Return the product in the response.
		return NextResponse.json(product);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}
