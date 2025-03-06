// Purpose: Define the Product model.

// Importing the required modules.
import  mongoose, { Schema, model, models } from "mongoose";

// Defining the ImageVariants.
export const IMAGE_VARIANTS = {
	SQUARE: {
		type: "SQUARE",
		dimension: { width: 1200, height: 1200 },
		label: "Square (1:1)",
		aspectRatio: "1:1",
	},
	WIDE: {
		type: "WIDE",
		dimension: { width: 1920, height: 1080 },
		label: "Widescreen (16:9)",
		aspectRatio: "16:9",
	},
	PORTRAIT: {
		type: "PORTRAIT",
		dimension: { width: 1080, height: 1440 },
		label: "Portrait (3:4)",
		aspectRatio: "3:4",
	},
} as const;

// Defining the ImageVariantType.
export type ImageVariantType = keyof typeof IMAGE_VARIANTS;

// Defining the ImageVariant interface.
export interface IImageVariant {
	type: ImageVariantType;
	price: number;
	license: "personal" | "commercial";
}

// Defining the ImageVariantSchema.
const imageVariantSchema = new Schema<IImageVariant>({
	type: {
		type: String,
		required: true,
		enum: ["SQUARE", "WIDE", "PORTRAIT"],
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
	license: {
		type: String,
		required: true,
		enum: ["personal", "commercial"],
	},
});

// Defining the Product interface.
export interface IProduct {
    _id?: mongoose.Types.ObjectId;
	name: string;
	description: string;
	imageUrl: string;
	variants: IImageVariant[];
	createdAt?: Date;
	updatedAt?: Date;
}

// Defining the Product schema.
const productSchema = new Schema<IProduct>(
	{
		name: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		imageUrl: {
			type: String,
			required: true,
		},
		variants: {
			type: [imageVariantSchema],
		},
	},
	{ timestamps: true }
);

// Defining the Product model if it doesn't exist.
const Product = models?.Product || model<IProduct>("Product", productSchema);

// Exporting the Product model.
export default Product;
