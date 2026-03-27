import { apiRequest } from "@/services/apiClient";
import type { ActivePlanSummary, DashboardAppointment } from "@/services/adminService";

export interface AgentDashboardClient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: "active" | "suspended";
  selectedService: "credit_repair" | "tax_services" | "comprehensive" | null;
  activePlan: ActivePlanSummary;
  latestScore: {
    score: number;
    bureau: string;
    updatedAt: string;
  } | null;
  latestAppointment: DashboardAppointment | null;
  createdAt: string;
}

export interface AgentDashboardData {
  summary: {
    totalClients: number;
    clientsWithActivePlans: number;
    scheduledAppointments: number;
  };
  clients: AgentDashboardClient[];
  appointments: DashboardAppointment[];
}

export const agentService = {
  getDashboard() {
    return apiRequest<AgentDashboardData>("/agent/dashboard", { auth: true });
  },
};
