import { apiRequest } from "@/services/apiClient";
import { tokenStorage } from "@/services/apiClient";

export interface SupportTicketInput {
  name: string;
  email: string;
  subject: string;
  description: string;
  category: string;
  priority?: "low" | "medium" | "high" | "urgent";
  attachments?: { name: string; size: number }[];
}

export interface SupportTicketRecord {
  _id: string;
  subject: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in-progress" | "waiting" | "resolved" | "closed";
  createdAt: string;
  updatedAt: string;
  email: string;
  name: string;
}

export const supportTicketService = {
  create(payload: SupportTicketInput) {
    return apiRequest<SupportTicketRecord>("/support-tickets", {
      method: "POST",
      auth: !!tokenStorage.get(),
      body: JSON.stringify(payload),
    });
  },

  list(email?: string) {
    const suffix = email ? `?email=${encodeURIComponent(email)}` : "";
    return apiRequest<SupportTicketRecord[]>(`/support-tickets${suffix}`, {
      auth: !!tokenStorage.get(),
    });
  },
};
