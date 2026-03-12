/**
 * Simple API client + auth helper for Uniwave Logistics.
 *
 * You can override the base URL from HTML before loading this file:
 *   <script>window.API_BASE_URL = "https://api.example.com";</script>
 *   <script src="js/api.js"></script>
 */
const BASE_API_URL = window.API_BASE_URL || "https://uniwave-logistics-server-1.onrender.com/";

const ACCESS_TOKEN_KEY = "uniwave_access_token";
const REFRESH_TOKEN_KEY = "uniwave_refresh_token";
const EXPIRES_AT_KEY = "uniwave_token_expires_at";
const ROLES_KEY = "uniwave_roles";
const AUTHENTICATION_PATH = "/authentication";

function readFromStorage(storage, key) {
  try {
    return storage.getItem(key);
  } catch (_) {
    return null;
  }
}

function writeToStorage(storage, key, value) {
  try {
    storage.setItem(key, value);
    return true;
  } catch (_) {
    return false;
  }
}

function removeFromStorage(storage, key) {
  try {
    storage.removeItem(key);
  } catch (_) {
    // ignore storage cleanup errors
  }
}

function getStoredAuthValue(key) {
  const sessionValue = readFromStorage(sessionStorage, key);
  if (sessionValue) {
    return sessionValue;
  }
  return readFromStorage(localStorage, key);
}

function removeAuthKeysFromStorage(storage) {
  removeFromStorage(storage, ACCESS_TOKEN_KEY);
  removeFromStorage(storage, REFRESH_TOKEN_KEY);
  removeFromStorage(storage, EXPIRES_AT_KEY);
  removeFromStorage(storage, ROLES_KEY);
}

function getTargetAuthStorage(rememberMe) {
  return rememberMe ? localStorage : sessionStorage;
}

// Retrieve the stored JWT access token (or null if missing).
function getAccessToken() {
  return getStoredAuthValue(ACCESS_TOKEN_KEY);
}

function decodeJwtPayload(token) {
  if (!token || typeof token !== "string") {
    return null;
  }

  const tokenParts = token.split(".");
  if (tokenParts.length < 2 || !tokenParts[1]) {
    return null;
  }

  const normalizedBase64 = tokenParts[1].replace(/-/g, "+").replace(/_/g, "/");
  const paddedBase64 = normalizedBase64.padEnd(Math.ceil(normalizedBase64.length / 4) * 4, "=");

  try {
    const decodedPayload = atob(paddedBase64);
    const parsedPayload = JSON.parse(decodedPayload);
    return parsedPayload && typeof parsedPayload === "object" ? parsedPayload : null;
  } catch (_) {
    return null;
  }
}

function getTokenExpiryDate(token) {
  const payload = decodeJwtPayload(token);
  if (!payload) {
    return null;
  }

  const exp = typeof payload.exp === "number" ? payload.exp : Number(payload.exp);
  if (!Number.isFinite(exp) || exp <= 0) {
    return null;
  }

  return new Date(exp * 1000);
}

function isAccessTokenExpired(token, leewaySeconds = 0) {
  if (!token) {
    return true;
  }

  const expiresAt = getTokenExpiryDate(token);
  if (!expiresAt) {
    return false;
  }

  const skewMs = Number.isFinite(leewaySeconds) ? Math.max(0, leewaySeconds) * 1000 : 0;
  return Date.now() >= expiresAt.getTime() - skewMs;
}

function getCurrentPathWithQuery() {
  if (typeof window === "undefined") {
    return "";
  }
  return `${window.location.pathname || ""}${window.location.search || ""}`;
}

function isAdminPagePath(pathname) {
  const normalized = String(pathname || "").toLowerCase();
  return normalized === "/admin" || normalized.startsWith("/admin/");
}

function isAuthPagePath(pathname) {
  const normalized = String(pathname || "").toLowerCase();
  return (
    normalized === "/authentication" ||
    normalized === "/authentication.html" ||
    normalized === "/en/authentication" ||
    normalized === "/vi/authentication"
  );
}

function isAdminApiPath(path) {
  const normalized = String(path || "").toLowerCase();
  return (
    normalized.startsWith("/api/admin/") ||
    normalized.startsWith("api/admin/") ||
    normalized.includes("/api/admin/")
  );
}

function shouldEnforceAdminAuth(path) {
  if (typeof window === "undefined") {
    return isAdminApiPath(path);
  }
  return isAdminPagePath(window.location.pathname) || isAdminApiPath(path);
}

function buildAuthenticationUrl(redirectTarget = "") {
  if (!redirectTarget) {
    return AUTHENTICATION_PATH;
  }
  const params = new URLSearchParams({ redirect: redirectTarget });
  return `${AUTHENTICATION_PATH}?${params.toString()}`;
}

function redirectToAuthentication(redirectTarget = "") {
  if (typeof window === "undefined") {
    return;
  }

  if (isAuthPagePath(window.location.pathname)) {
    return;
  }

  const target = redirectTarget || getCurrentPathWithQuery();
  window.location.href = buildAuthenticationUrl(target);
}

function normalizeRoles(rawRoles) {
  if (!rawRoles) {
    return [];
  }

  if (Array.isArray(rawRoles)) {
    return rawRoles.map((role) => String(role)).filter(Boolean);
  }

  if (typeof rawRoles === "string") {
    return rawRoles
      .split(",")
      .map((role) => role.trim())
      .filter(Boolean);
  }

  return [];
}

function getRoles() {
  try {
    const stored = getStoredAuthValue(ROLES_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return normalizeRoles(parsed);
  } catch (error) {
    console.warn("Unable to read roles from storage", error);
    return [];
  }
}

function hasRole(role) {
  if (!role) return false;
  const target = String(role).toLowerCase();
  return getRoles().some((item) => String(item).toLowerCase() === target);
}

function isAdmin() {
  return hasRole("Admin");
}

function isContentEditor() {
  return hasRole("ContentEditor");
}

// Persist auth data using localStorage when rememberMe=true, otherwise sessionStorage.
function setAuthTokens({ accessToken, refreshToken, expiresAt, roles, rememberMe = true } = {}) {
  try {
    const targetStorage = getTargetAuthStorage(rememberMe);

    // Keep only one active auth storage target to avoid stale precedence conflicts.
    removeAuthKeysFromStorage(localStorage);
    removeAuthKeysFromStorage(sessionStorage);

    if (accessToken) {
      writeToStorage(targetStorage, ACCESS_TOKEN_KEY, accessToken);
    }

    if (refreshToken) {
      writeToStorage(targetStorage, REFRESH_TOKEN_KEY, refreshToken);
    }

    const resolvedExpiresAt = expiresAt || getTokenExpiryDate(accessToken)?.toISOString();
    if (resolvedExpiresAt) {
      writeToStorage(targetStorage, EXPIRES_AT_KEY, resolvedExpiresAt);
    }

    if (roles !== undefined) {
      const normalizedRoles = normalizeRoles(roles);
      if (normalizedRoles.length) {
        writeToStorage(targetStorage, ROLES_KEY, JSON.stringify(normalizedRoles));
      }
    }
  } catch (error) {
    console.error("Unable to save auth tokens to storage", error);
  }
}

// Remove all stored auth-related keys from both session and local storage.
function clearAuthTokens() {
  try {
    removeAuthKeysFromStorage(sessionStorage);
    removeAuthKeysFromStorage(localStorage);
  } catch (error) {
    console.error("Unable to clear auth tokens from storage", error);
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
    if (response.status === 401 && shouldEnforceAdminAuth(path)) {
      clearAuthTokens();
      redirectToAuthentication();
    }

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
    const apiError = new Error(errorMessage);
    apiError.status = response.status;
    throw apiError;
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
    if (isAdmin()) {
      profileLink.setAttribute("href", "/admin/dashboard");
    } else if (isContentEditor()) {
      profileLink.setAttribute("href", "/admin/blogs");
    } else {
      profileLink.setAttribute("href", "/user-dashboard");
    }
    if (bodyEl) bodyEl.classList.add("logged-in");
  } else {
    profileLink.setAttribute("href", "/vi/authentication");
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
  decodeJwtPayload,
  isAccessTokenExpired,
  redirectToAuthentication,
  getRoles,
  hasRole,
  isAdmin,
  isContentEditor,
  setAuthTokens,
  clearAuthTokens,
  setupProfileMenu
};

// Backwards-compatible alias.
window.UniwaveApi = window.UniwaveAPI;
