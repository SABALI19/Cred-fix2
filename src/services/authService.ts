import { apiRequest, tokenStorage } from "@/services/apiClient";

export interface AuthUser {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: "user" | "agent" | "admin";
  profilePhoto?: string;
  bio?: string;
  phone?: string;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

interface AuthResponse {
  user: AuthUser;
  token: string;
}

export const authService = {
  async register(payload: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: {
      streetAddress?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  }) {
    const data = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    tokenStorage.set(data.token);
    return data.user;
  },

  async registerAgent(payload: {
    name: string;
    email: string;
    password: string;
    accessKey: string;
    phone?: string;
    address?: {
      streetAddress?: string;
      city?: string;
      state?: string;
      zipCode?: string;
    };
  }) {
    const data = await apiRequest<AuthResponse>("/auth/register-agent", {
      method: "POST",
      body: JSON.stringify(payload),
    });
    tokenStorage.set(data.token);
    return data.user;
  },

  async login(email: string, password: string) {
    const data = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    tokenStorage.set(data.token);
    return data.user;
  },

  async getCurrentUser() {
    const data = await apiRequest<{ user: AuthUser }>("/auth/me", {
      method: "GET",
      auth: true,
    });
    return data.user;
  },

  async updateProfile(
    updates: Partial<
      Pick<AuthUser, "name" | "profilePhoto" | "bio" | "phone" | "address">
    >,
  ) {
    const data = await apiRequest<{ user: AuthUser }>("/auth/me", {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(updates),
    });
    return data.user;
  },

  async logout() {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
        auth: true,
      });
    } finally {
      tokenStorage.clear();
    }
  },
};
