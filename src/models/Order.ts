// Purpose: Define the Order model.

// Importing the required modules.
import mongoose, { Schema, model, models } from "mongoose";
import { IImageVariant, ImageVariantType } from "./Product";

// Defining the PopulatedUser interface.
interface PopulatedUser {
	_id: mongoose.Types.ObjectId;
	email: string;
}

// Defining the PopulatedProduct interface.
interface PopulatedProduct {
    _id: mongoose.Types.ObjectId;
    name: string;
    imageUrl: string;
}

// Defining the Order interface.
export interface IOrder {
    _id?: mongoose.Types.ObjectId;
	userId: mongoose.Types.ObjectId | PopulatedUser;
	productId: mongoose.Types.ObjectId | PopulatedProduct;
	variant: IImageVariant;
	price: number;
	license: "personal" | "commercial";
	razorpayOrderId: string;
	razorpayPaymentId?: string;
	amount: number;
	status: "pending" | "completed" | "failed";
	downloadUrl?: string;
	previewUrl?: string;
	createdAt?: Date;
	updatedAt?: Date;
}

// Defining the Order schema.
const orderSchema = new Schema<IOrder>(
	{
		userId: {
			type: mongoose.Types.ObjectId,
			ref: "User",
			required: true,
		},
		productId: {
			type: mongoose.Types.ObjectId,
			ref: "Product",
			required: true,
		},
		variant: {
			type: String,
			required: true,
			enum: ["SQUARE", "WIDE", "PORTRAIT"] as ImageVariantType[],
            set: (v: string) => v.toUpperCase(),
		},
		price: {
			type: Number,
			required: true,
		},
		license: {
			type: String,
			required: true,
			enum: ["personal", "commercial"],
		},
		razorpayOrderId: {
			type: String,
			required: true,
		},
		razorpayPaymentId: {
			type: String,
			required: true,
		},
		amount: {
			type: Number,
			required: true,
		},
		status: {
			type: String,
			required: true,
			enum: ["pending", "completed", "failed"],
			default: "pending",
		},
		downloadUrl: {
			type: String,
		},
		previewUrl: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

// Defining the Order model if it doesn't exist.
const Order = models?.Order || model("Order", orderSchema);

// Exporting the Order model.
export default Order;
