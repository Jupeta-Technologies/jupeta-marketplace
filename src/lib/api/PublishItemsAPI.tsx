import APIManager from "./APIManager";

// It's good practice to define the expected type for 'data'
// when it's a FormData object.
export const PublishItems = async (data: FormData) => {
    console.log("PublishItems: Data being sent to API", data);

    // Optional: For debugging, you can log the FormData contents
    // This is useful to ensure all your data and files are appended correctly.
    for (const pair of data.entries()) {
        console.log(`FormData Entry - ${pair[0]}:`, pair[1]);
    }

    try {
        const response = await APIManager('/User/AddProduct', {
            method: "POST",
            // IMPORTANT: Do NOT manually set 'Content-Type': 'multipart/form-data'
            // when sending FormData. The browser/Axios will set it automatically
            // with the correct boundary.
            // headers: { 'Content-Type': 'multipart/form-data' }, // <--- REMOVE THIS LINE
            data: data, // Pass the FormData object directly as the data body
            withCredentials: false
        });

        console.log("PublishItems: API Response", response);
        return response;
    } catch (error: any) { // Use 'any' for error or a more specific type if known (e.g., AxiosError)
        console.error("PublishItems: API Error", error.response || error.message || error);
        return error.response;
    }
};