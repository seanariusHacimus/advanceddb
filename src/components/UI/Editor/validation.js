import { VALID_IMAGE_EXTENSIONS } from "./constants";

// URL validation utilities
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const isValidImageUrl = (url) => {
  if (!isValidUrl(url)) return false;

  const urlObj = new URL(url);
  const pathname = urlObj.pathname.toLowerCase();
  const extension = pathname.split(".").pop();

  // Check file extension
  if (extension && VALID_IMAGE_EXTENSIONS.includes(extension)) {
    return true;
  }

  // Check for common image hosting services that don't use extensions
  const imageHosts = [
    "imgur.com",
    "i.imgur.com",
    "images.unsplash.com",
    "pixabay.com",
    "pexels.com",
    "unsplash.com",
    "flickr.com",
    "photobucket.com",
  ];

  return imageHosts.some((host) => urlObj.hostname.includes(host));
};

export const validateImageUrl = async (url) => {
  if (!isValidImageUrl(url)) {
    return { isValid: false, error: "Invalid image URL or unsupported format" };
  }

  try {
    // Test if the image can be loaded
    const img = new Image();
    // img.crossOrigin = "anonymous";

    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        resolve({ isValid: false, error: "Image load timeout" });
      }, 10000); // 10 second timeout

      img.onload = () => {
        clearTimeout(timeout);
        resolve({ isValid: true, error: null });
      };

      img.onerror = () => {
        clearTimeout(timeout);
        resolve({
          isValid: false,
          error: "Image not found or cannot be loaded",
        });
      };

      img.src = url;
    });
  } catch (error) {
    return { isValid: false, error: "Error validating image URL" };
  }
};
