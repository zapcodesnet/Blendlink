/**
 * Runtime Configuration Utility
 * 
 * Provides runtime URL detection to ensure the app works correctly
 * regardless of build-time environment variables.
 * 
 * CRITICAL: React bakes env variables at build time, meaning a preview build 
 * would have preview URLs baked in even when deployed to production.
 * This utility detects the runtime hostname and returns the correct URL.
 * 
 * Usage:
 *   import { getApiUrl, getWsUrl } from '../utils/runtimeConfig';
 *   const API_URL = getApiUrl();
 */

/**
 * Get the API base URL with runtime detection
 * @returns {string} The correct API base URL for the current environment
 */
export const getApiUrl = () => {
  // Runtime detection based on actual hostname
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const protocol = window.location.protocol;
    
    // Production - custom domain
    if (hostname === 'blendlink.net' || hostname === 'www.blendlink.net') {
      return process.env.REACT_APP_API_URL || 'https://blendlink-api.onrender.com';
    }
    
    // Cloudflare Pages deployment
    if (hostname.includes('.pages.dev')) {
      return process.env.REACT_APP_API_URL || 'https://blendlink-api.onrender.com';
    }
    
    // Localhost development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
    }
    
    // Preview/staging environments
    if (hostname.includes('.preview.emergentagent.com') || hostname.includes('.stage-preview.emergentagent.com')) {
      return `${protocol}//${hostname}`;
    }
  }
  
  // Fallback: use env variable or Render backend
  return process.env.REACT_APP_API_URL || process.env.REACT_APP_BACKEND_URL || 'https://blendlink-api.onrender.com';
};

/**
 * Get the WebSocket base URL with runtime detection
 * @returns {string} The correct WebSocket base URL for the current environment
 */
export const getWsUrl = () => {
  const apiUrl = getApiUrl();
  return apiUrl.replace(/^http/, 'ws');
};

/**
 * Get the frontend base URL with runtime detection
 * @returns {string} The correct frontend base URL for the current environment
 */
export const getFrontendUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://blendlink.net';
};

// Export as default object for convenience
export default {
  getApiUrl,
  getWsUrl,
  getFrontendUrl,
};
