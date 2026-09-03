// Centralized API configuration for Development and Production environments
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Base server URL (without /api path) for image/static uploads
export const SERVER_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, '');

/**
 * Helper function to construct full asset/image URL
 * @param path Relative image path (e.g. '/uploads/image.jpg')
 */
export const getImageUrl = (path: string): string => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SERVER_BASE_URL}${cleanPath}`;
};
