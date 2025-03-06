// Purpose: Define the route for orders API.

// Import the required modules.
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Razorpay from "razorpay";

// Initializes a new instance of the Razorpay client.
const razorpay = new Razorpay({
	key_id: process.env.RAZORPAY_KEY_ID!,
	key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

// Define the POST method.
export async function POST(request: Request) {
	try {
		// Get the session.
		const session = await getServerSession(authOptions);
		if (!session) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Parse the request body.
		const { productId, variant } = await request.json();

		// Connect to the database.
		await connectToDatabase();

		// Create a new order.
		const options = {
			amount: Math.round(variant.price * 100),
			currency: "USD",
			receipt: `receipt-${Date.now()}`,
			notes: {
				productId: productId.toString(),
			},
		};
		const order = await razorpay.orders.create(options);

		// Create a new order in the database.
		const newOrder = await Order.create({
			userId: session.user.id,
			productId,
			variant,
			razorpayOrderId: order.id,
			amount: Math.round(variant.price * 100),
			status: "pending",
		});

		// Return the response.
		return NextResponse.json({
			orderId: order.id,
			amount: order.amount,
			currency: order.currency,
			dbOrderId: newOrder._id,
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Failed to create order" },
			{ status: 500 }
		);
	}
}
