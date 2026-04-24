const DEFAULT_API_BASE_URL = "http://127.0.0.1:5000/api";

const normalizeApiBaseUrl = (rawBaseUrl) => {
  const trimmedBaseUrl = (rawBaseUrl || DEFAULT_API_BASE_URL).trim().replace(/\/+$/, "");
  return trimmedBaseUrl.endsWith("/api") ? trimmedBaseUrl : `${trimmedBaseUrl}/api`;
};

const API_BASE_URL = normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);

const normalizePath = (path) => (path.startsWith("/") ? path : `/${path}`);

const ensureApiPrefix = (path) => (path.startsWith("/api") ? path : `/api${path}`);

const removeApiPrefix = (path) => (path.startsWith("/api/") ? path.slice(4) : path);

const requestJson = async (path, options) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  const payload = await response.json().catch(() => null);

  return { response, payload };
};

export const httpClient = async (path, options = {}) => {
  const normalizedPath = normalizePath(path);

  let { response, payload } = await requestJson(normalizedPath, options);

  if (!response.ok && response.status === 404) {
    const apiPrefixedPath = ensureApiPrefix(normalizedPath);
    const apiStrippedPath = removeApiPrefix(normalizedPath);

    // Retry once to tolerate env/path mismatches between frontend and backend deployments.
    if (apiPrefixedPath !== normalizedPath) {
      ({ response, payload } = await requestJson(apiPrefixedPath, options));
    } else if (apiStrippedPath !== normalizedPath) {
      ({ response, payload } = await requestJson(apiStrippedPath, options));
    }
  }

  if (!response.ok) {
    const message = payload?.message || "Something went wrong";
    const details = payload?.error?.details || [];
    throw new Error([message, ...details].join(" "));
  }

  return payload;
};
