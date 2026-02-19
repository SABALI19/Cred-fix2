import { apiRequest } from "@/services/apiClient";

export interface CreditAccount {
  _id: string;
  accountName: string;
  accountType:
    | "credit_card"
    | "auto_loan"
    | "mortgage"
    | "personal_loan"
    | "student_loan"
    | "other";
  creditorName: string;
  balance: number;
  creditLimit: number | null;
  paymentHistory: string;
  lastPaymentDate: string | null;
  accountStatus: "open" | "closed" | "dispute";
  bureauExperian: boolean;
  bureauEquifax: boolean;
  bureauTransunion: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreditScore {
  _id: string;
  bureau: "experian" | "equifax" | "transunion";
  score: number;
  utilizationRate: number | null;
  paymentHistoryScore: number | null;
  creditAge: number | null;
  scoreFactors: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

export interface AccountSummary {
  totalAccounts: number;
  totalBalance: number;
  totalLimit: number;
  utilization: number;
}

export const creditService = {
  getCreditAccounts() {
    return apiRequest<CreditAccount[]>("/credit/accounts", { auth: true });
  },

  addCreditAccount(account: Omit<CreditAccount, "_id" | "createdAt" | "updatedAt">) {
    return apiRequest<CreditAccount>("/credit/accounts", {
      method: "POST",
      auth: true,
      body: JSON.stringify(account),
    });
  },

  updateCreditAccount(id: string, updates: Partial<CreditAccount>) {
    return apiRequest<CreditAccount>(`/credit/accounts/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(updates),
    });
  },

  deleteCreditAccount(id: string) {
    return apiRequest<void>(`/credit/accounts/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },

  getCreditScoreHistory(limit?: number) {
    const suffix = limit ? `?limit=${limit}` : "";
    return apiRequest<CreditScore[]>(`/credit/scores${suffix}`, { auth: true });
  },

  addCreditScore(score: Omit<CreditScore, "_id" | "createdAt" | "updatedAt">) {
    return apiRequest<CreditScore>("/credit/scores", {
      method: "POST",
      auth: true,
      body: JSON.stringify(score),
    });
  },

  getLatestCreditScores() {
    return apiRequest<CreditScore[]>("/credit/scores/latest", { auth: true });
  },

  getAccountSummary() {
    return apiRequest<AccountSummary>("/credit/summary", { auth: true });
  },
};
