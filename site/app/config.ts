/**
 * Centralized configuration for the site
 * This includes the base path for GitHub Pages deployment
 */

// Base path for GitHub Pages (only used in production)
// In development, this will be empty string
export const BASE_PATH = process.env.NODE_ENV === 'production' ? '/shaffercon' : '';

// Helper function to prepend base path to any URL
export const withBasePath = (path: string): string => {
  if (!BASE_PATH) {
    // In development, ensure the path starts with /
    return path.startsWith('/') ? path : `/${path}`;
  }
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_PATH}/${cleanPath}`;
};

// Asset paths (for images, videos, etc.)
export const ASSET_PATH = (path: string): string => withBasePath(path);
