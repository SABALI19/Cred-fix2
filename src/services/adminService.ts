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

export const adminService = {
  getDashboard() {
    return apiRequest<AdminDashboardData>("/admin/dashboard", { auth: true });
  },
};
