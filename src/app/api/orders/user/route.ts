// Purpose: Define the route for orders/user API. (all orders for the user)

// Import the required modules.
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from "path";
import Razorpay from "razorpay";

// Define the GET method.
export async function GET(request: Request) {
	try {
		// Get the session.
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Connect to the database.
		await connectToDatabase();

        // Find all orders for the user.
		await Order.find({ userId: session.user.id })
			.populate({
				path: "productId",
				select: "name imageUrl",
				options: { strictPopulate: false },
			})
			.sort({ createdAt: -1 })
			.lean();

	} catch (error) {
		console.error(error);
	}
}
