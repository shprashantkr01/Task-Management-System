import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  clearTokens,
} from "./auth";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Call backend API with automatic refresh-token retry
 */
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {},
  retry = true
) {
  const token = getAccessToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  // 🔁 Access token expired → try refresh once
  if (res.status === 401 && retry) {
    const newAccessToken = await refreshAccessToken();

    if (newAccessToken) {
      setAccessToken(newAccessToken);
      // retry original request ONCE
      return apiRequest(endpoint, options, false);
    }

    // refresh failed → logout
    clearTokens();
    window.location.href = "/login";
    return;
  }

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

/**
 * Refresh access token using refresh token
 */
async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${BASE_URL}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.accessToken;
}
