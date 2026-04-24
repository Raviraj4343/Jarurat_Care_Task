const DEFAULT_API_BASE_URL = "http://127.0.0.1:5000/api";

const normalizeApiBaseUrl = (rawBaseUrl) => {
  const trimmedBaseUrl = (rawBaseUrl || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");
  return trimmedBaseUrl.endsWith("/api") ? trimmedBaseUrl : `${trimmedBaseUrl}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

export const httpClient = async (path, options = {}) => {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  const response = await fetch(`${API_BASE_URL}${normalizedPath}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok) {
    const message = payload?.message || "Something went wrong";
    const details = payload?.error?.details || [];
    throw new Error([message, ...details].join(" "));
  }

  return payload;
};
