import { apiRequest } from "@/services/apiClient";

export interface ContactMessageInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export const contactService = {
  create(payload: ContactMessageInput) {
    return apiRequest("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
};
