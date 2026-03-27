import { apiRequest, tokenStorage } from "@/services/apiClient";

export interface AuthUser {
  _id: string;
  id?: string;
  email: string;
  name: string;
  role: "user" | "agent" | "admin";
  status?: "active" | "suspended";
  selectedService?: "credit_repair" | "tax_services" | "comprehensive" | null;
  activePlan?: {
    name?: string;
    price?: number | null;
    serviceType?: "credit_repair" | "tax_services" | "comprehensive" | "" | null;
    startedAt?: string | null;
  };
  assignedAgentId?: string | null;
  assignedAgent?: {
    _id: string;
    name: string;
    email: string;
    profilePhoto?: string;
    phone?: string;
    bio?: string;
  };
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

export interface AgentOption {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
  clientCount: number;
}

export const authService = {
  async register(payload: {
    name: string;
    email: string;
    password: string;
    serviceType: "credit_repair" | "tax_services" | "comprehensive";
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

  async getAvailableAgents() {
    return apiRequest<AgentOption[]>("/auth/agents", { method: "GET", auth: true });
  },

  async getPublicAgents() {
    return apiRequest<AgentOption[]>("/auth/agents/public", { method: "GET" });
  },

  async selectAgent(agentId: string | null) {
    const data = await apiRequest<{ user: AuthUser }>("/auth/me/agent", {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ agentId }),
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
