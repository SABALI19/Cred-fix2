import { apiRequest } from "@/services/apiClient";

export interface ConsultationRequestInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
}

export const consultationService = {
  create(input: ConsultationRequestInput) {
    return apiRequest("/consultations", {
      method: "POST",
      body: JSON.stringify(input),
    });
  },
};
