const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const AUTH_TOKEN_KEY = "creditfix_auth_token";

export const tokenStorage = {
  get: () => localStorage.getItem(AUTH_TOKEN_KEY),
  set: (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token),
  clear: () => localStorage.removeItem(AUTH_TOKEN_KEY),
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { auth = false, headers, ...rest } = options;

  const nextHeaders = new Headers(headers || {});
  nextHeaders.set("Content-Type", "application/json");

  if (auth) {
    const token = tokenStorage.get();
    if (token) {
      nextHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    headers: nextHeaders,
  });

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }

  return data as T;
};
