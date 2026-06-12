// Centralized API base URL for all fetch calls
// In production (Vercel), set VITE_API_URL environment variable to your Render backend URL
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
