const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000/api";

export const httpClient = async (path, options = {}) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
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
