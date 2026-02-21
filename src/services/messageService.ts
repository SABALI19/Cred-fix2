import { apiRequest } from "@/services/apiClient";

export interface DirectMessage {
  _id: string;
  senderId: string;
  recipientId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChatParticipant {
  _id: string;
  name: string;
  email: string;
  profilePhoto?: string;
  phone?: string;
  bio?: string;
}

export interface AgentConversationItem {
  user: ChatParticipant;
  lastMessage: DirectMessage | null;
  unreadCount: number;
}

export const messageService = {
  getUserAssignedAgentConversation() {
    return apiRequest<{ agent: ChatParticipant | null; messages: DirectMessage[] }>(
      "/messages/assigned-agent",
      { auth: true },
    );
  },

  getAgentConversations() {
    return apiRequest<{ conversations: AgentConversationItem[] }>(
      "/messages/agent/conversations",
      { auth: true },
    );
  },

  getAgentConversation(userId: string) {
    return apiRequest<{ participant: ChatParticipant; messages: DirectMessage[] }>(
      `/messages/agent/conversations/${userId}`,
      { auth: true },
    );
  },

  sendMessage(recipientId: string, content: string) {
    return apiRequest<{ message: DirectMessage }>("/messages", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ recipientId, content }),
    });
  },
};
