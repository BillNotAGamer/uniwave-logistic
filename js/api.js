/**
 * Simple API client + auth helper for Uniwave Logistics.
 *
 * You can override the base URL from HTML before loading this file:
 *   <script>window.API_BASE_URL = "https://api.example.com";</script>
 *   <script src="js/api.js"></script>
 */
const BASE_API_URL = window.API_BASE_URL || "https://localhost:7258/";

const ACCESS_TOKEN_KEY = "uniwave_access_token";
const REFRESH_TOKEN_KEY = "uniwave_refresh_token";
const EXPIRES_AT_KEY = "uniwave_token_expires_at";

// Retrieve the stored JWT access token (or null if missing).
function getAccessToken() {
  try {
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch (error) {
    console.warn("Unable to read access token from localStorage", error);
    return null;
  }
}

// Persist tokens and expiration info in localStorage.
function setAuthTokens({ accessToken, refreshToken, expiresAt } = {}) {
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken || "");
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken || "");
    if (expiresAt) {
      localStorage.setItem(EXPIRES_AT_KEY, expiresAt);
    }
  } catch (error) {
    console.error("Unable to save auth tokens to localStorage", error);
  }
}

// Remove all stored auth-related keys.
function clearAuthTokens() {
  try {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(EXPIRES_AT_KEY);
  } catch (error) {
    console.error("Unable to clear auth tokens from localStorage", error);
  }
}

// Utility to detect a plain object (used to decide when to JSON.stringify a body).
function isPlainObject(value) {
  return Object.prototype.toString.call(value) === "[object Object]";
}

/**
 * Fetch wrapper that prefixes requests with BASE_API_URL, adds JSON headers, and injects Authorization when available.
 * @param {string} path Relative API path (e.g. "/api/orders/my").
 * @param {RequestInit} [options] Standard fetch options.
 * @returns {Promise<Response>} The fetch Response object (throws on non-ok responses).
 */
async function apiFetch(path, options = {}) {
  const url = new URL(path, BASE_API_URL).toString();
  const fetchOptions = { ...options };
  const headers = new Headers(options.headers || {});

  // If body is a plain object, send JSON.
  if (isPlainObject(fetchOptions.body)) {
    headers.set("Content-Type", "application/json");
    fetchOptions.body = JSON.stringify(fetchOptions.body);
  }

  // Attach Bearer token when available.
  const token = getAccessToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  fetchOptions.headers = headers;

  let response;
  try {
    response = await fetch(url, fetchOptions);
  } catch (error) {
    console.error(`Network error while calling ${url}: ${error.message}`); // Thêm log
    throw new Error(`Network error while calling ${url}: ${error.message}`);
  }

  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.clone().json();
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (typeof errorData === "string") {
        errorMessage = errorData;
      } else {
        errorMessage = JSON.stringify(errorData);
      }
    } catch (_) {
      try {
        const errorText = await response.clone().text();
        if (errorText) {
          errorMessage = errorText;
        }
      } catch (__) {
        // ignore secondary parse errors
      }
    }

    console.error(`API error: ${errorMessage}`); // Thêm log lỗi
    throw new Error(errorMessage);
  }

  return response;
}

// Update profile menu destination based on login state.
function setupProfileMenu() {
  const profileLink = document.querySelector(".profile-menu a");
  if (!profileLink) return;

  const hasToken = !!getAccessToken();
  const bodyEl = document.body;

  if (hasToken) {
    profileLink.setAttribute("href", "user-dashboard.html");
    if (bodyEl) bodyEl.classList.add("logged-in");
  } else {
    profileLink.setAttribute("href", "authentication.html");
    if (bodyEl) bodyEl.classList.remove("logged-in");
  }
}

// Auto-run once the DOM is ready so the header link updates on each page load.
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupProfileMenu);
} else {
  setupProfileMenu();
}

// Expose helpers globally for inline scripts.
window.UniwaveAPI = {
  BASE_API_URL,
  apiFetch,
  getAccessToken,
  setAuthTokens,
  clearAuthTokens,
  setupProfileMenu
};

// Backwards-compatible alias.
window.UniwaveApi = window.UniwaveAPI;