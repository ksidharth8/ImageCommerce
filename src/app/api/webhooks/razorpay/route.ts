// Purpose: Define the route for the Razorpay webhooks API.

// Import the required modules.
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/lib/db";
import Order from "@/models/Order";
import nodemailer from "nodemailer";

// Define the POST method for the route.
export async function POST(req: NextRequest) {
	try {
		// Get the request body.
		const body = await req.text();

		// Signature is sent in the headers.
		const signature = req.headers.get("x-razorpay-signature");

		// Expected signature is the HMAC-SHA256 hash of the request body using the secret key.
		const expectedSignature = crypto
			.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
			.update(body)
			.digest("hex");

		if (signature !== expectedSignature) {
			return NextResponse.json(
				{ error: "Invalid signature" },
				{ status: 400 }
			);
		}

		// Parse the request body.
		const event = JSON.parse(body);
		// console.log(event);

		// Connect to the database.
		await connectToDatabase();

		// Check if the event is payment captured.
		if (event.event === "payment.captured") {
			// Get the payment details.
			const payment = event.payload.payment.entity;
			// Get the order details using the razorpayOrderId and populate the productId and userId.
			const order = await Order.findOneAndUpdate(
				{ razorpayOrderId: payment.order_id },
				{ razorpayPaymentId: payment.id, status: "completed" }
			).populate([
				{ path: "productId", select: "name" },
				{ path: "userId", select: "email" },
			]);

			// Send an email to the user if the order is found.
			if (order) {
				// Create a nodemailer transporter using the Mailtrap SMTP server.
				const transporter = nodemailer.createTransport({
					host: process.env.MAILTRAP_HOST,
					port: 2525,
					auth: {
						user: process.env.MAILTRAP_USER,
						pass: process.env.MAILTRAP_PASS,
					},
				});

				// Send the email to the user.
				await transporter.sendMail({
					from: '"ImageKit Shop" <noreply@imagekitshop.com>',
					to: order.userId.email,
					subject: "Payment Confirmation - ImageKit Shop",
					text: `
						Thank you for your purchase!

						Order Details:
						- Order ID: ${order._id.toString().slice(-6)}
						- Product: ${order.productId.name}
						- Version: ${order.variant.type}
						- License: ${order.variant.license}
						- Price: $${order.amount.toFixed(2)}

						Your image is now available in your orders page.
						Thank you for shopping with ImageKit Shop!
          				`.trim(),
				});
			}
		}

		// Return a success response.
		return NextResponse.json({ message: "success" }, { status: 200 });
	} catch (error) {
		console.error(error);
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		);
	}
}
