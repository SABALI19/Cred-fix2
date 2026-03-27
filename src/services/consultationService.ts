import { apiRequest } from "@/services/apiClient";

export interface ConsultationRequestInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  serviceType?: "credit_repair" | "tax_services" | "comprehensive" | null;
  plan?: {
    name: string;
    price: number;
  } | null;
  agent?: {
    id: string;
    name: string;
    title: string;
  } | null;
  schedule?: {
    date: string;
    time: string;
    consultationType: string;
  } | null;
}

export const consultationService = {
  create(input: ConsultationRequestInput) {
    return apiRequest("/consultations", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
