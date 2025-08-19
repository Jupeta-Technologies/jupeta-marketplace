// lib/api/UploadImageAPI.tsx
import APIManager from './APIManager';

export interface UploadImageRequest {
  file: File;
  folder?: string; // Optional folder path like 'categories' or 'heroes'
}

export interface UploadImageResponse {
  success: boolean;
  message: string;
  data?: {
    imageUrl: string;
    fileName: string;
    fileSize: number;
    uploadPath: string;
  };
  error?: string;
}

/**
 * Upload an image file to the server
 * @param request - The upload request containing the file and optional folder
 * @returns Promise<UploadImageResponse>
 */
export const UploadImage = async (request: UploadImageRequest): Promise<UploadImageResponse> => {
  try {
    // Create FormData for file upload
    const formData = new FormData();
    formData.append('image', request.file);
    
    if (request.folder) {
      formData.append('folder', request.folder);
    }

    // Use APIManager to handle the upload
    const response = await APIManager.post('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    // Axios response structure
    const responseData = response.data;

    if (response.status === 200 && responseData.success) {
      return {
        success: true,
        message: 'Image uploaded successfully',
        data: responseData.data
      };
    } else {
      return {
        success: false,
        message: responseData.message || 'Failed to upload image',
        error: responseData.error
      };
    }
  } catch (error: any) {
    console.error('Upload image error:', error);
    
    // Handle axios error format
    if (error.response) {
      return {
        success: false,
        message: error.response.data?.message || 'Server error occurred',
        error: error.response.data?.error || `HTTP ${error.response.status}`
      };
    } else if (error.request) {
      return {
        success: false,
        message: 'No response from server',
        error: 'Network error'
      };
    } else {
      return {
        success: false,
        message: 'An error occurred while uploading the image',
        error: error.message || 'Unknown error'
      };
    }
  }
};

/**
 * Validate image file before upload
 * @param file - The file to validate
 * @returns Object with isValid boolean and error message if invalid
 */
export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/svg+xml'];
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'Invalid file type. Please select a JPEG, PNG, WebP, or SVG image.'
    };
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Please select an image smaller than 5MB.'
    };
  }

  // Check filename
  if (file.name.length > 100) {
    return {
      isValid: false,
      error: 'Filename too long. Please use a shorter filename.'
    };
  }

  return { isValid: true };
};

/**
 * Generate a safe filename for upload
 * @param originalName - The original filename
 * @returns A safe filename with timestamp prefix
 */
export const generateSafeFilename = (originalName: string): string => {
  // Remove special characters and spaces
  const cleanName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  // Add timestamp prefix to avoid conflicts
  const timestamp = Date.now();
  
  return `${timestamp}_${cleanName}`;
};
