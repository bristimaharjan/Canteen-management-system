import { jwtDecode } from "jwt-decode";

// Define a key for storing the token in local storage
const TOKEN_KEY = "authToken";

/**
 * Save the token to local storage
 * @param {string} token - The JWT token to store
 */
export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

/**
 * Retrieve the token from local storage
 * @returns {string|null} - The JWT token or null if not found
 */
export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

/**
 * Remove the token from local storage (e.g., during logout)
 */
export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export function isTokenValid(token) {
  if (!token) return false;

  try {
    const decoded = jwtDecode(token);

    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime; // Token is valid if it hasn't expired
  } catch (e) {
    console.log("couldn't decode", e);
    return false; // If token can't be decoded, it's invalid
  }
}