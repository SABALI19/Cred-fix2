import { io, type Socket } from "socket.io-client";
import { tokenStorage } from "@/services/apiClient";

export interface RealtimeMessage {
  _id: string;
  senderId: string;
  recipientId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface NewMessageEvent {
  message: RealtimeMessage;
}

export interface TypingEvent {
  fromUserId: string;
  isTyping: boolean;
}

export interface PresenceState {
  userId: string;
  online: boolean;
  lastSeenAt: string | null;
}

export interface PresenceSnapshotEvent {
  users: PresenceState[];
}

let socket: Socket | null = null;

const resolveSocketBaseUrl = () => {
  const apiBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  return apiBase.replace(/\/api\/?$/, "");
};

const createOrReuseSocket = () => {
  const token = tokenStorage.get();
  if (!token) {
    return null;
  }

  if (!socket) {
    socket = io(resolveSocketBaseUrl(), {
      autoConnect: false,
      withCredentials: true,
      auth: { token },
    });
  } else {
    socket.auth = { token };
  }

  return socket;
};

export const socketClient = {
  connect() {
    const current = createOrReuseSocket();
    if (!current) {
      return null;
    }

    if (!current.connected) {
      current.connect();
    }

    return current;
  },

  disconnect() {
    if (!socket) {
      return;
    }
    socket.disconnect();
  },

  onNewMessage(handler: (event: NewMessageEvent) => void) {
    const current = this.connect();
    if (!current) {
      return () => undefined;
    }

    current.on("messages:new", handler);

    return () => {
      current.off("messages:new", handler);
    };
  },

  onTyping(handler: (event: TypingEvent) => void) {
    const current = this.connect();
    if (!current) {
      return () => undefined;
    }

    current.on("messages:typing", handler);

    return () => {
      current.off("messages:typing", handler);
    };
  },

  emitTyping(toUserId: string, isTyping: boolean) {
    const current = this.connect();
    if (!current) {
      return;
    }

    current.emit("messages:typing", { toUserId, isTyping });
  },

  watchPresence(userIds: string[]) {
    const current = this.connect();
    if (!current) {
      return;
    }

    const uniqueUserIds = Array.from(
      new Set(
        userIds
          .map((userId) => String(userId))
          .filter(Boolean),
      ),
    );
    current.emit("presence:watch", { userIds: uniqueUserIds });
  },

  onPresenceSnapshot(handler: (event: PresenceSnapshotEvent) => void) {
    const current = this.connect();
    if (!current) {
      return () => undefined;
    }

    current.on("presence:snapshot", handler);

    return () => {
      current.off("presence:snapshot", handler);
    };
  },

  onPresenceUpdate(handler: (event: PresenceState) => void) {
    const current = this.connect();
    if (!current) {
      return () => undefined;
    }

    current.on("presence:update", handler);

    return () => {
      current.off("presence:update", handler);
    };
  },
};
