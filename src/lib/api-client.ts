// Purpose: Define the API client class and its methods.

// Import the required modules.
import { IOrder } from "@/models/Order";
import { IProduct, IImageVariant } from "@/models/Product";
import { Types } from "mongoose";

// Define the ProductFormData type.
export type ProductFormData = Omit<IProduct, "_id">;

// Define the CreateOrderData type.
export interface CreateOrderData {
  productId: Types.ObjectId | string;
  variant: IImageVariant;
}

// Define the fetch options type.
type FetchOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

// Define the API client class.
class ApiClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOptions = {}
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;

    // Define the default headers.
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    // Fetch the data from the API.
    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      throw new Error(await response.text());
    }

    // Return the JSON response.
    return response.json();
  }

  // Define the getProducts method.
  async getProducts() {
    return this.fetch<IProduct[]>("/products");
  }

  // Define the getProduct(id) method.
  async getProduct(id: string) {
    return this.fetch<IProduct>(`/products/${id}`);
  }

  // Define the createProduct(productData) method.
  async createProduct(productData: ProductFormData) {
    return this.fetch<IProduct>("/products", {
      method: "POST",
      body: productData,
    });
  }

  // Define the getUserOrders method.
  async getUserOrders() {
    return this.fetch<IOrder[]>("/orders/user");
  }

  // Define the createOrder(orderData) method.
  async createOrder(orderData: CreateOrderData) {
    const sanitizedOrderData = {
      ...orderData,
      productId: orderData.productId.toString(),
    };

    return this.fetch<{ orderId: string; amount: number }>("/orders", {
      method: "POST",
      body: sanitizedOrderData,
    });
  }
}

// Export the API client instance.
export const apiClient = new ApiClient();
