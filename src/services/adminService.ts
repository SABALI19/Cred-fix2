import { apiRequest } from "@/services/apiClient";

export interface AdminSummary {
  totalUsers: number;
  activeAgents: number;
  pendingCases: number;
  openSupportTickets: number;
  systemHealth: number;
  newUsersThisMonth: number;
}

export interface AdminChartDatum {
  name: string;
  value: number;
}

export interface MonthlyTrendPoint {
  month: string;
  users: number;
  disputes: number;
  consultations: number;
}

export interface RecentUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "agent" | "admin";
  joinedAt: string;
  disputeCount: number;
}

export interface SystemAlert {
  type: "success" | "warning" | "error" | "info";
  severity: "high" | "medium" | "low";
  message: string;
  timestamp: string;
}

export interface AdminDashboardData {
  summary: AdminSummary;
  systemOverview: AdminChartDatum[];
  caseBreakdown: AdminChartDatum[];
  monthlyTrend: MonthlyTrendPoint[];
  recentUsers: RecentUser[];
  systemAlerts: SystemAlert[];
}

export interface AgentUser {
  _id: string;
  name: string;
  email: string;
  role: "agent";
  phone?: string;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateAgentPayload {
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
}

export const adminService = {
  getDashboard() {
    return apiRequest<AdminDashboardData>("/admin/dashboard", { auth: true });
  },

  getAgents() {
    return apiRequest<AgentUser[]>("/admin/agents", { auth: true });
  },

  createAgent(payload: CreateAgentPayload) {
    return apiRequest<{ agent: AgentUser }>("/admin/agents", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },
};
