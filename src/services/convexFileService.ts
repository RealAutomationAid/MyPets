import { useAction, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export interface FileUploadResult {
  success: boolean;
  storageId?: Id<"_storage">;
  url?: string;
  error?: string;
}

export interface UploadFileOptions {
  associatedCatId?: Id<"cats">;
  imageType: 'profile' | 'gallery' | 'general' | 'news';
  onProgress?: (progress: number) => void;
}

// Hook for uploading files to Convex storage
export const useFileUpload = () => {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const saveUploadedFile = useMutation(api.files.saveUploadedFile);

  const uploadFile = async (
    file: File, 
    options: UploadFileOptions
  ): Promise<FileUploadResult> => {
    try {
      options.onProgress?.(0);

      // Step 1: Compress image if it's an image file to stay under Convex 1 MiB limit
      let fileToUpload = file;
      if (file.type.startsWith('image/')) {
        try {
          fileToUpload = await compressImage(file);
          console.log(`Image compressed from ${formatFileSize(file.size)} to ${formatFileSize(fileToUpload.size)}`);
        } catch (compressionError) {
          console.warn('Image compression failed, uploading original:', compressionError);
          // Continue with original file if compression fails
        }
      }

      options.onProgress?.(15);

      // Step 2: Generate upload URL
      const postUrl = await generateUploadUrl();
      options.onProgress?.(30);

      // Step 3: Upload file to Convex storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": fileToUpload.type },
        body: fileToUpload,
      });

      if (!result.ok) {
        throw new Error(`Upload failed: ${result.status} ${result.statusText}`);
      }

      options.onProgress?.(75);

      const { storageId } = await result.json();

      // Step 4: Save file metadata
      const metadata = await saveUploadedFile({
        storageId,
        filename: file.name, // Keep original filename
        associatedCatId: options.associatedCatId,
        imageType: options.imageType,
      });

      options.onProgress?.(100);

      return {
        success: true,
        storageId,
        url: metadata.url,
      };

    } catch (error) {
      console.error('File upload failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed',
      };
    }
  };

  return { uploadFile };
};

// Hook for uploading multiple files
export const useMultiFileUpload = () => {
  const { uploadFile } = useFileUpload();

  const uploadMultipleFiles = async (
    files: File[],
    options: UploadFileOptions,
    onProgress?: (fileIndex: number, progress: number, total: number) => void
  ): Promise<FileUploadResult[]> => {
    const results: FileUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      const result = await uploadFile(file, {
        ...options,
        onProgress: (progress) => onProgress?.(i, progress, files.length),
      });

      results.push(result);
    }

    return results;
  };

  return { uploadMultipleFiles };
};

// Utility to validate image files
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 5 * 1024 * 1024; // 5MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Неподдържан формат. Моля, използвайте JPG, PNG, GIF или WebP.'
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Файлът е твърде голям. Максимално 5MB.'
    };
  }

  return { valid: true };
};

// Utility to compress images to stay under Convex 1 MiB storage limit
export const compressImage = async (file: File, maxSizeBytes: number = 800 * 1024): Promise<File> => {
  return new Promise((resolve, reject) => {
    // If file is already small enough, return as-is
    if (file.size <= maxSizeBytes) {
      resolve(file);
      return;
    }

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      try {
        // Calculate new dimensions to reduce file size
        let { width, height } = img;
        const maxDimension = 1920; // Max dimension for compressed image
        
        // Scale down if image is too large
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        // Try different quality levels to get under the size limit
        const tryCompress = (quality: number): void => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              // If still too large and quality can be reduced further, try again
              if (blob.size > maxSizeBytes && quality > 0.1) {
                tryCompress(quality - 0.1);
                return;
              }

              // Create new file with compressed blob
              const compressedFile = new File([blob], file.name, {
                type: blob.type,
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            'image/jpeg', // Convert to JPEG for better compression
            quality
          );
        };

        // Start with quality 0.8
        tryCompress(0.8);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image for compression'));
    img.src = URL.createObjectURL(file);
  });
};

// Utility to get file info
export const getFileInfo = (file: File) => {
  return {
    name: file.name,
    size: file.size,
    type: file.type,
    sizeFormatted: formatFileSize(file.size),
  };
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}; 