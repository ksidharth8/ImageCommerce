// Purpose: Define the providers for the Next.js app (including ImageKit).

"use client";

// Import the required modules
import { ImageKitProvider, IKUpload } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";

// Define the ImageKit public key and URL endpoint.
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY;
const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT;

// Define the ImageKit authentication function to fetch the authentication parameters.
const authenticator = async () => {
	try {
		const response = await fetch("/api/imagekit-auth");
		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(
				`Request failed with status ${response.status}: ${errorText}`
			);
		}

		// Parse the response JSON data and return the authentication parameters.
		const data = await response.json();
		const { signature, expire, token } = data;
		return { signature, expire, token };
	} catch (error) {
		console.log("Error", error);
		throw new Error(`ImageKit authentication request failed`);
	}
};

// Define the Providers component with children as props.
export default function Providers({ children }: { children: React.ReactNode }) {
	return (
		<SessionProvider refetchInterval={5 * 60}>
			<ImageKitProvider
				publicKey={publicKey}
				urlEndpoint={urlEndpoint}
				authenticator={authenticator}
			>
				{children}
			</ImageKitProvider>
		</SessionProvider>
	);
}
