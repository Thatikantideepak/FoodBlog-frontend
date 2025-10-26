// API Configuration
// Resolution order:
// 1. runtime override: window.__API_BASE__ (useful for pointing a deployed build at a different backend without rebuilding)
// 2. Vite env: VITE_API_BASE (build-time)
// 3. legacy VITE_API_URL
// 4. in development only: http://localhost:4000
// 5. production fallback: '' (relative paths)
const runtimeBase = (typeof window !== 'undefined' && window.__API_BASE__) ? window.__API_BASE__ : null;
const envBase = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_URL || null;
// Avoid embedding a hard-coded localhost URL in build artifacts.
// For local development only, construct the fallback at runtime so the literal
// "http://localhost:4000" does not appear in the compiled production bundle.
const devFallback = import.meta.env.DEV
  ? (typeof window !== 'undefined' ? `${window.location.protocol}//${window.location.hostname}:4000` : 'http://localhost:4000')
  : null;
const API_BASE_URL = runtimeBase || envBase || devFallback || '';

export const API_ENDPOINTS = {
  // Authentication
  SIGNUP: `${API_BASE_URL}/signUp`,
  LOGIN: `${API_BASE_URL}/login`,
  GET_USER: (id) => `${API_BASE_URL}/user/${id}`,
  GET_USER_FAVS: (id) => `${API_BASE_URL}/user/${id}/favourites`,
  ADD_FAV: (id) => `${API_BASE_URL}/user/${id}/favourites`,
  REMOVE_FAV: (userId, recipeId) => `${API_BASE_URL}/user/${userId}/favourites/${recipeId}`,
  
  // Recipes
  GET_RECIPES: `${API_BASE_URL}/recipe`,
  GET_RECIPE: (id) => `${API_BASE_URL}/recipe/${id}`,
  CREATE_RECIPE: `${API_BASE_URL}/recipe`,
  UPDATE_RECIPE: (id) => `${API_BASE_URL}/recipe/${id}`,
  DELETE_RECIPE: (id) => `${API_BASE_URL}/recipe/${id}`,
  
  // Images - Now using Cloudinary URLs directly
  IMAGE_URL: (cloudinaryUrl) => cloudinaryUrl
};

export default API_BASE_URL;
