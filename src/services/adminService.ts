import { apiRequest } from "@/services/apiClient";
import type { AccountSummary, CreditAccount, CreditScore } from "@/services/creditService";
import type { Dispute } from "@/services/disputeService";
import type { AuthUser } from "@/services/authService";
import type { SupportTicketRecord } from "@/services/supportTicketService";

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

export interface ActivePlanSummary {
  name: string;
  price: number | null;
  serviceType: "credit_repair" | "tax_services" | "comprehensive" | "" | null;
  startedAt: string | null;
}

export interface DashboardAppointment {
  id: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  serviceType: "credit_repair" | "tax_services" | "comprehensive" | null;
  plan: {
    name: string;
    price: number | null;
  };
  agent: {
    id: string;
    name: string;
    title: string;
  };
  schedule: {
    date: string;
    time: string;
    consultationType: string;
  };
  status: "new" | "contacted" | "booked" | "closed";
  createdAt: string;
}

export interface AgentPortfolioClient {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended";
  selectedService: "credit_repair" | "tax_services" | "comprehensive" | null;
  activePlan: ActivePlanSummary;
  latestAppointment: DashboardAppointment | null;
  joinedAt: string;
}

export interface AgentPortfolio {
  id: string;
  name: string;
  email: string;
  status: "active" | "suspended";
  clientCount: number;
  activePlanCount: number;
  clients: AgentPortfolioClient[];
}

export interface AdminDashboardData {
  summary: AdminSummary;
  systemOverview: AdminChartDatum[];
  caseBreakdown: AdminChartDatum[];
  monthlyTrend: MonthlyTrendPoint[];
  recentUsers: RecentUser[];
  agentPortfolios: AgentPortfolio[];
  appointments: DashboardAppointment[];
  systemAlerts: SystemAlert[];
}

export interface ManagedUser extends AuthUser {
  status: "active" | "suspended";
  latestScoresByBureau: CreditScore[];
  disputeCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserDetailResponse {
  user: ManagedUser;
  accountSummary: AccountSummary;
  accounts: CreditAccount[];
  scores: CreditScore[];
  disputes: Dispute[];
}

export interface AgentUser {
  _id: string;
  name: string;
  email: string;
  role: "agent";
  status: "active" | "suspended";
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

export interface ContactMessageRecord {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: "new" | "in-review" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationRecord {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  serviceType?: "credit_repair" | "tax_services" | "comprehensive" | null;
  plan?: {
    name: string;
    price: number | null;
  };
  agent?: {
    id: string;
    name: string;
    title: string;
  };
  schedule?: {
    date: string;
    time: string;
    consultationType: string;
  };
  status: "new" | "contacted" | "booked" | "closed";
  createdAt: string;
  updatedAt: string;
}

export interface ChartControl {
  enabled: boolean;
}

export interface ServiceControl {
  enabled: boolean;
  title: string;
  description: string;
  ctaLabel: string;
}

export interface PlatformControls {
  charts: {
    creditScore: ChartControl;
    disputes: ChartControl;
    accountStatus: ChartControl;
    monthlyTrend: ChartControl;
    recentActivity: ChartControl;
  };
  services: {
    taxServices: ServiceControl;
    creditScoreServices: ServiceControl;
  };
  updatedAt: string;
}

export type PlatformControlsPatch = {
  charts?: Partial<{
    creditScore: Partial<ChartControl>;
    disputes: Partial<ChartControl>;
    accountStatus: Partial<ChartControl>;
    monthlyTrend: Partial<ChartControl>;
    recentActivity: Partial<ChartControl>;
  }>;
  services?: Partial<{
    taxServices: Partial<ServiceControl>;
    creditScoreServices: Partial<ServiceControl>;
  }>;
};

export type ManagedUserPatch = Partial<
  Pick<
    ManagedUser,
    "name" | "email" | "role" | "status" | "selectedService" | "phone" | "profilePhoto" | "bio"
  >
> & {
  assignedAgentId?: string | null;
  address?: {
    streetAddress?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
};

type UserQuery = {
  search?: string;
  role?: string;
  status?: string;
};

const toQueryString = (params: Record<string, string | number | undefined>) => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  }

  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

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

  getUsers(query: UserQuery = {}) {
    return apiRequest<{ users: ManagedUser[] }>(
      `/admin/users${toQueryString({
        search: query.search,
        role: query.role,
        status: query.status,
      })}`,
      { auth: true },
    );
  },

  getUserDetail(userId: string) {
    return apiRequest<UserDetailResponse>(`/admin/users/${userId}`, { auth: true });
  },

  updateUser(userId: string, patch: ManagedUserPatch) {
    return apiRequest<{ user: ManagedUser }>(`/admin/users/${userId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(patch),
    });
  },

  listSupportTickets(filters: { search?: string; status?: string; priority?: string } = {}) {
    return apiRequest<{ tickets: SupportTicketRecord[] }>(
      `/admin/support-tickets${toQueryString(filters)}`,
      { auth: true },
    );
  },

  updateSupportTicket(ticketId: string, patch: { status?: string; priority?: string }) {
    return apiRequest<{ ticket: SupportTicketRecord }>(`/admin/support-tickets/${ticketId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(patch),
    });
  },

  listContactMessages(filters: { search?: string; status?: string } = {}) {
    return apiRequest<{ messages: ContactMessageRecord[] }>(
      `/admin/contact-messages${toQueryString(filters)}`,
      { auth: true },
    );
  },

  updateContactMessage(messageId: string, status: ContactMessageRecord["status"]) {
    return apiRequest<{ message: ContactMessageRecord }>(`/admin/contact-messages/${messageId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ status }),
    });
  },

  listConsultations(filters: { search?: string; status?: string } = {}) {
    return apiRequest<{ consultations: ConsultationRecord[] }>(
      `/admin/consultations${toQueryString(filters)}`,
      { auth: true },
    );
  },

  updateConsultation(consultationId: string, status: ConsultationRecord["status"]) {
    return apiRequest<{ consultation: ConsultationRecord }>(
      `/admin/consultations/${consultationId}`,
      {
        method: "PATCH",
        auth: true,
        body: JSON.stringify({ status }),
      },
    );
  },

  createCreditAccount(userId: string, payload: Omit<CreditAccount, "_id" | "createdAt" | "updatedAt">) {
    return apiRequest<{ account: CreditAccount }>(`/admin/users/${userId}/credit/accounts`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateCreditAccount(userId: string, accountId: string, patch: Partial<CreditAccount>) {
    return apiRequest<{ account: CreditAccount }>(
      `/admin/users/${userId}/credit/accounts/${accountId}`,
      {
        method: "PATCH",
        auth: true,
        body: JSON.stringify(patch),
      },
    );
  },

  deleteCreditAccount(userId: string, accountId: string) {
    return apiRequest<void>(`/admin/users/${userId}/credit/accounts/${accountId}`, {
      method: "DELETE",
      auth: true,
    });
  },

  createCreditScore(userId: string, payload: Omit<CreditScore, "_id" | "createdAt" | "updatedAt">) {
    return apiRequest<{ score: CreditScore }>(`/admin/users/${userId}/credit/scores`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateCreditScore(userId: string, scoreId: string, patch: Partial<CreditScore>) {
    return apiRequest<{ score: CreditScore }>(`/admin/users/${userId}/credit/scores/${scoreId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(patch),
    });
  },

  deleteCreditScore(userId: string, scoreId: string) {
    return apiRequest<void>(`/admin/users/${userId}/credit/scores/${scoreId}`, {
      method: "DELETE",
      auth: true,
    });
  },

  createDispute(
    userId: string,
    payload: Omit<Dispute, "_id" | "createdAt" | "updatedAt">,
  ) {
    return apiRequest<{ dispute: Dispute }>(`/admin/users/${userId}/disputes`, {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateDispute(userId: string, disputeId: string, patch: Partial<Dispute>) {
    return apiRequest<{ dispute: Dispute }>(`/admin/users/${userId}/disputes/${disputeId}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(patch),
    });
  },

  deleteDispute(userId: string, disputeId: string) {
    return apiRequest<void>(`/admin/users/${userId}/disputes/${disputeId}`, {
      method: "DELETE",
      auth: true,
    });
  },

  getPlatformControls() {
    return apiRequest<PlatformControls>("/admin/platform-controls", {
      auth: true,
    });
  },

  updatePlatformControls(patch: PlatformControlsPatch) {
    return apiRequest<PlatformControls>("/admin/platform-controls", {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(patch),
    });
  },
};
