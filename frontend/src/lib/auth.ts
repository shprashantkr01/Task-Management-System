export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

export function getAccessToken() {
  return localStorage.getItem("accessToken");
}

export function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}
export function setAccessToken(token: string) {
  localStorage.setItem("accessToken", token);
}

export function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}
