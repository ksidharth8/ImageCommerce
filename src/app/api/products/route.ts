// Purpose: Define the Product route.

// Import the required modules.
import { connectToDatabase } from "@/lib/db";
import { authOptions } from "@/lib/auth";
import Product, { IProduct } from "@/models/Product";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// Define the GET request handler.
export async function GET() {
	try {
		// Connect to the database and fetch all products sorted by creation date.
		await connectToDatabase();
		const products = await Product.find({}).lean(); // Lean to convert to plain JS object.

		// If no products are found, return a 404 response.
		if (!products || products.length === 0) {
			return NextResponse.json([], { status: 200 });
		}

		// Return the products in the response.
		return NextResponse.json(products);
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to fetch products" },
			{ status: 500 }
		);
	}
}

// Define the POST request handler.
export async function POST(request: NextRequest) {
	try {
		// Get the user session.
		const session = await getServerSession(authOptions);
		if (!session || session.user?.role !== "admin") {
			return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
		}

		// Connect to the database.
		await connectToDatabase();

		// Get the product data from the request body.
		const body: IProduct = await request.json();

		if (
			!body.name ||
			!body.description ||
			!body.imageUrl ||
			body.variants.length === 0
		) {
			return NextResponse.json(
				{ message: "Missing required fields" },
				{ status: 400 }
			);
		}

		// Validate variants
		for (const variant of body.variants) {
			if (!variant.type || !variant.price || !variant.license) {
				return NextResponse.json(
					{ error: "Invalid variant data" },
					{ status: 400 }
				);
			}
		}

		// Save the new product to the database and return it in the response.
		const newProduct = await Product.create(body);
		return NextResponse.json(newProduct, { status: 201 });
	} catch (error) {
		return NextResponse.json(
			{ error: "Failed to create product" },
			{ status: 500 }
		);
	}
}
