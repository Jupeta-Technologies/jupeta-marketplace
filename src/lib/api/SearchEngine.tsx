// api/jupetaSearchEngine.ts (or wherever you define this function)
import APIManager from './APIManager'; // Your Axios instance
import { APIResponse, Product } from '@/types/api'; // Adjust path if needed
import { AxiosError } from 'axios'; // Import AxiosError for specific error handling

/**
 * Interface defining the structure of parameters for the search API.
 * This ensures type safety when passing search criteria.
 */
interface SearchParams {
    keyword?: string; // Optional search keyword (e.g., 'Macbook')
    category?: string; // Optional category filter (e.g., 'Electronic')
    page?: number;     // Optional page number for pagination
    limit?: number;    // Optional number of items per page
    sortBy?: string;   // Optional field to sort by (e.g., 'price', 'name')
    sortOrder?: 'asc' | 'desc'; // Optional sort order
    // Add any other specific search parameters your API expects
    [key: string]: any; // Allows for additional, flexible properties not explicitly defined
}

/**
 * Performs a search operation by making a GET request to the '/User/SearchSort' endpoint
 * using the provided APIManager (Axios instance).
 *
 * @param searchData - An object containing the search parameters (e.g., keyword, category).
 * Defaults to an empty object if no parameters are provided.
 * @returns A Promise resolving to an APIResponse containing an array of Products
 * on success, or a structured error response on failure.
 */
export const jupetaSearchEngine = async (
    searchData: SearchParams = {}
): Promise<APIResponse<Product[]>> => {
    try {
        // Make the GET request using APIManager.
        // Axios automatically serializes 'params' into the URL query string for GET requests.
        const response = await APIManager.get<APIResponse<Product[]>>('/User/SearchSort', {
            params: searchData,
            // headers and withCredentials can be configured globally in APIManager,
            // but can also be overridden here if needed for this specific request.
            // headers: {'Content-Type':'application/json'}, // Not typically needed for GET
            // withCredentials: false,
        });

        // Axios wraps the actual response data in a 'data' property
        return response.data;

    } catch (error: unknown) { // Catching 'unknown' is safest in TypeScript
        // Log the error for debugging purposes
        console.error("Error in jupetaSearchEngine:", error);

        // Check if the error is an AxiosError to access response details
        if (error instanceof AxiosError) {
            // If it's an Axios error with a response from the server
            if (error.response) {
                // Return server-provided error data if available and fits APIResponse structure
                // Otherwise, construct a generic error message using status and data
                return {
                    code: "1",
                    success: false,
                    message: error.response.data?.message || `API Error: ${error.response.status} ${error.response.statusText}`,
                    statusCode: error.response.status,
                    responseData: [], // Return empty array on error
                };
            } else if (error.request) {
                // The request was made but no response was received (e.g., network error, timeout)
                return {
                    code: "1",
                    success: false,
                    message: "No response from server. Please check your internet connection.",
                    statusCode: 503, // Service Unavailable
                    responseData: [],
                };
            } else {
                // Something happened in setting up the request that triggered an Error
                return {
                    code: "1",
                    success: false,
                    message: error.message || "An unexpected request error occurred.",
                    statusCode: 500, // Internal Server Error
                    responseData: [],
                };
            }
        } else if (error instanceof Error) {
            // General JavaScript Error (e.g., parsing error, type error)
            return {
                code: "1",
                success: false,
                message: error.message || "An unexpected client-side error occurred.",
                statusCode: 500,
                responseData: [],
            };
        }

        // Fallback for any other unknown error type
        return {
            code: "1",
            success: false,
            message: "An unhandled error occurred during the search operation.",
            statusCode: 500,
            responseData: [],
        };
    }
};