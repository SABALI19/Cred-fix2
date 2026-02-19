import { apiRequest } from "@/services/apiClient";

export interface Dispute {
  _id: string;
  accountId: string | null;
  disputeReason: string;
  bureau: "experian" | "equifax" | "transunion" | "all";
  status: "pending" | "investigating" | "resolved" | "rejected";
  priority: "low" | "medium" | "high";
  resolutionNotes: string;
  documents: { name: string; url: string; uploadedAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface DisputeStats {
  total: number;
  activeDisputes: number;
  pending: number;
  resolved: number;
  rejected: number;
}

export const disputeService = {
  getDisputes() {
    return apiRequest<Dispute[]>("/disputes", { auth: true });
  },

  createDispute(payload: Omit<Dispute, "_id" | "createdAt" | "updatedAt" | "documents">) {
    return apiRequest<Dispute>("/disputes", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    });
  },

  updateDispute(id: string, updates: Partial<Dispute>) {
    return apiRequest<Dispute>(`/disputes/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(updates),
    });
  },

  deleteDispute(id: string) {
    return apiRequest<void>(`/disputes/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  getDisputeStats() {
    return apiRequest<DisputeStats>("/disputes/stats/summary", { auth: true });
  },

  getDisputesByBureau() {
    return apiRequest<{ bureau: string; count: number }[]>(
      "/disputes/stats/by-bureau",
      { auth: true },
    );
  },
};
