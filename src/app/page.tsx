// This is the main page component that will be rendered on the client side.
// Purpose: It fetches the products from the API and renders the ImageGallery component.

"use client";

// Import the required modules.
import ImageGallery from "@/app/components/ImageGallery";
import React, { useEffect, useState } from "react";
import { IProduct } from "@/models/Product";
import { apiClient } from "@/lib/api-client";

// Define the Home component.
export default function Home() {
  // Define the state for the products.
  const [products, setProducts] = useState<IProduct[]>([]);

  // Fetch the products from the API.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiClient.getProducts();
        // console.log("Fetched products:", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  // Return the main component with the ImageGallery.
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">ImageKit Shop</h1>
      <ImageGallery products={products} />
    </main>
  );
}
