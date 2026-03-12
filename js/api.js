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
const REFRESH_ENDPOINT_PATH = "/api/auth/refresh";
let refreshAccessTokenPromise = null;

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
  const entry = getStoredAuthEntry(key);
  return entry.value;
}

function getStoredAuthEntry(key) {
  const sessionValue = readFromStorage(sessionStorage, key);
  if (sessionValue) {
    return {
      value: sessionValue,
      storage: sessionStorage,
      rememberMe: false
    };
  }

  const localValue = readFromStorage(localStorage, key);
  if (localValue) {
    return {
      value: localValue,
      storage: localStorage,
      rememberMe: true
    };
  }

  return {
    value: null,
    storage: null,
    rememberMe: true
  };
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

function getRefreshToken() {
  return getStoredAuthValue(REFRESH_TOKEN_KEY);
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

function isAuthApiPath(path) {
  const normalized = String(path || "").toLowerCase();
  return normalized.startsWith("/api/auth/") || normalized.startsWith("api/auth/");
}

function shouldSkipRefreshForPath(path) {
  const normalized = String(path || "").toLowerCase();
  return (
    normalized.startsWith("/api/auth/login") ||
    normalized.startsWith("api/auth/login") ||
    normalized.startsWith("/api/auth/refresh") ||
    normalized.startsWith("api/auth/refresh")
  );
}

function getRememberMeFromStoredAuth() {
  const refreshEntry = getStoredAuthEntry(REFRESH_TOKEN_KEY);
  if (refreshEntry.value) {
    return refreshEntry.rememberMe;
  }

  const accessEntry = getStoredAuthEntry(ACCESS_TOKEN_KEY);
  if (accessEntry.value) {
    return accessEntry.rememberMe;
  }

  return true;
}

function buildExpiresAtFromPayload(payload, fallbackToken) {
  const expiresIn = Number(payload?.expiresIn);
  if (Number.isFinite(expiresIn) && expiresIn > 0) {
    return new Date(Date.now() + expiresIn * 1000).toISOString();
  }

  const explicitExpiry =
    payload?.expiresAt ||
    payload?.expiration ||
    payload?.expires;
  if (explicitExpiry) {
    return explicitExpiry;
  }

  return getTokenExpiryDate(fallbackToken)?.toISOString();
}

function handleRefreshFailure(requestPath = "") {
  clearAuthTokens();
  if (!isAuthApiPath(requestPath)) {
    redirectToAuthentication();
  }
}

async function requestAccessTokenRefresh(refreshToken) {
  const response = await fetch(new URL(REFRESH_ENDPOINT_PATH, BASE_API_URL).toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ refreshToken })
  });

  if (!response.ok) {
    return null;
  }

  try {
    return await response.json();
  } catch (_) {
    return null;
  }
}

async function refreshAccessToken({ requestPath = "", redirectOnFail = true } = {}) {
  if (refreshAccessTokenPromise) {
    return refreshAccessTokenPromise;
  }

  refreshAccessTokenPromise = (async () => {
    const refreshEntry = getStoredAuthEntry(REFRESH_TOKEN_KEY);
    const refreshToken = refreshEntry.value;
    if (!refreshToken) {
      if (redirectOnFail && (getAccessToken() || shouldEnforceAdminAuth(requestPath))) {
        handleRefreshFailure(requestPath);
      }
      return null;
    }

    const payload = await requestAccessTokenRefresh(refreshToken);
    const refreshedAccessToken = payload?.accessToken;
    if (!refreshedAccessToken) {
      if (redirectOnFail) {
        handleRefreshFailure(requestPath);
      }
      return null;
    }

    const refreshTokenNext = payload?.refreshToken || refreshToken;
    const roles = getRoles();
    const expiresAt = buildExpiresAtFromPayload(payload, refreshedAccessToken);

    setAuthTokens({
      accessToken: refreshedAccessToken,
      refreshToken: refreshTokenNext,
      expiresAt,
      roles,
      rememberMe: getRememberMeFromStoredAuth()
    });

    return refreshedAccessToken;
  })();

  try {
    return await refreshAccessTokenPromise;
  } finally {
    refreshAccessTokenPromise = null;
  }
}

async function ensureValidAccessToken(path = "") {
  const token = getAccessToken();
  if (token && !isAccessTokenExpired(token, 5)) {
    return token;
  }

  if (shouldSkipRefreshForPath(path)) {
    return token;
  }

  return await refreshAccessToken({ requestPath: path, redirectOnFail: true });
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

  fetchOptions.headers = headers;

  const sendRequest = async (token) => {
    const requestHeaders = new Headers(fetchOptions.headers || {});
    if (token) {
      requestHeaders.set("Authorization", `Bearer ${token}`);
    } else {
      requestHeaders.delete("Authorization");
    }

    return await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders
    });
  };

  let response;
  try {
    const initialToken = await ensureValidAccessToken(path);
    response = await sendRequest(initialToken);
  } catch (error) {
    console.error(`Network error while calling ${url}: ${error.message}`);
    throw new Error(`Network error while calling ${url}: ${error.message}`);
  }

  if (response.status === 401 && !shouldSkipRefreshForPath(path)) {
    const refreshedToken = await refreshAccessToken({
      requestPath: path,
      redirectOnFail: true
    });

    if (refreshedToken) {
      response = await sendRequest(refreshedToken);
    }
  }

  if (!response.ok) {
    if (response.status === 401 && (shouldEnforceAdminAuth(path) || getAccessToken() || getRefreshToken())) {
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

    console.error(`API error: ${errorMessage}`);
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
  getRefreshToken,
  decodeJwtPayload,
  isAccessTokenExpired,
  ensureValidAccessToken,
  refreshAccessToken,
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

