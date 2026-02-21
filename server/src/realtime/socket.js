import { Server } from "socket.io";
import mongoose from "mongoose";
import { User } from "../models/User.js";
import { verifyAuthToken } from "../utils/jwt.js";

let io = null;
const onlineConnections = new Map();
const lastSeenByUser = new Map();

const resolveToken = (socket) => {
  const authToken = socket.handshake?.auth?.token;
  if (authToken) {
    return String(authToken);
  }

  const headerToken = socket.handshake?.headers?.authorization;
  if (typeof headerToken === "string" && headerToken.startsWith("Bearer ")) {
    return headerToken.slice(7);
  }

  return null;
};

const corsOriginCheck = (corsOrigins = []) => (origin, callback) => {
  if (!origin) {
    return callback(null, true);
  }

  if (corsOrigins.includes(origin)) {
    return callback(null, true);
  }

  return callback(new Error(`CORS blocked for origin: ${origin}`));
};

const setConnectionState = (userId, isConnected) => {
  const prevCount = onlineConnections.get(userId) || 0;

  if (isConnected) {
    const nextCount = prevCount + 1;
    onlineConnections.set(userId, nextCount);
    if (prevCount === 0) {
      emitPresenceUpdate(userId, true);
    }
    return;
  }

  const nextCount = Math.max(prevCount - 1, 0);
  if (nextCount === 0) {
    onlineConnections.delete(userId);
    const nowIso = new Date().toISOString();
    lastSeenByUser.set(userId, nowIso);
    emitPresenceUpdate(userId, false);
    return;
  }

  onlineConnections.set(userId, nextCount);
};

const getPresenceState = (userId) => {
  const online = (onlineConnections.get(userId) || 0) > 0;
  return {
    userId,
    online,
    lastSeenAt: online ? null : lastSeenByUser.get(userId) || null,
  };
};

const emitPresenceUpdate = (userId, online) => {
  if (!io) return;
  const state = {
    userId,
    online,
    lastSeenAt: online ? null : lastSeenByUser.get(userId) || null,
  };

  io.to(`presence-watch:${userId}`).emit("presence:update", state);
};

const canUsersInteract = async ({ fromUserId, fromRole, toUserId }) => {
  if (!mongoose.isValidObjectId(toUserId)) {
    return false;
  }

  if (fromUserId === toUserId) {
    return false;
  }

  if (fromRole === "admin") {
    const recipient = await User.findById(toUserId).select("_id").lean();
    return Boolean(recipient);
  }

  const [sender, recipient] = await Promise.all([
    User.findById(fromUserId).select("_id role assignedAgentId").lean(),
    User.findById(toUserId).select("_id role assignedAgentId").lean(),
  ]);

  if (!sender || !recipient) {
    return false;
  }

  if (fromRole === "user") {
    if (recipient.role !== "agent") {
      return false;
    }
    return sender.assignedAgentId?.toString() === recipient._id.toString();
  }

  if (fromRole === "agent") {
    if (recipient.role !== "user") {
      return false;
    }
    return recipient.assignedAgentId?.toString() === sender._id.toString();
  }

  return false;
};

export const initSocketServer = (httpServer, { corsOrigins = [] } = {}) => {
  io = new Server(httpServer, {
    cors: {
      origin: corsOriginCheck(corsOrigins),
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const token = resolveToken(socket);
      if (!token) {
        return next(new Error("Unauthorized"));
      }

      const payload = verifyAuthToken(token);
      socket.data.userId = payload.sub;
      socket.data.role = payload.role;
      return next();
    } catch (_error) {
      return next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = String(socket.data.userId);
    const role = String(socket.data.role || "user");
    socket.data.userId = userId;
    socket.data.role = role;
    socket.data.presenceWatchIds = new Set();
    socket.join(`user:${userId}`);
    setConnectionState(userId, true);

    socket.on("presence:watch", (payload = {}) => {
      const requestedIds = Array.isArray(payload.userIds) ? payload.userIds : [];
      const nextWatchIds = new Set(
        requestedIds
          .map((id) => String(id))
          .filter((id) => mongoose.isValidObjectId(id)),
      );

      const prevWatchIds = socket.data.presenceWatchIds || new Set();
      for (const oldId of prevWatchIds) {
        if (!nextWatchIds.has(oldId)) {
          socket.leave(`presence-watch:${oldId}`);
        }
      }
      for (const watchId of nextWatchIds) {
        if (!prevWatchIds.has(watchId)) {
          socket.join(`presence-watch:${watchId}`);
        }
      }

      socket.data.presenceWatchIds = nextWatchIds;
      const users = Array.from(nextWatchIds).map((watchId) => getPresenceState(watchId));
      socket.emit("presence:snapshot", { users });
    });

    socket.on("messages:typing", async (payload = {}) => {
      try {
        const toUserId = String(payload.toUserId || "");
        const isTyping = Boolean(payload.isTyping);

        if (!mongoose.isValidObjectId(toUserId)) {
          return;
        }

        const allowed = await canUsersInteract({
          fromUserId: userId,
          fromRole: role,
          toUserId,
        });

        if (!allowed) {
          return;
        }

        io.to(`user:${toUserId}`).emit("messages:typing", {
          fromUserId: userId,
          isTyping,
        });
      } catch (_error) {
        // Ignore typing errors to keep the socket alive.
      }
    });

    socket.on("disconnect", () => {
      setConnectionState(userId, false);
    });
  });

  return io;
};

export const getSocketServer = () => io;

export const emitNewMessage = (message) => {
  if (!io) return;

  const senderRoom = `user:${message.senderId}`;
  const recipientRoom = `user:${message.recipientId}`;
  io.to(senderRoom).to(recipientRoom).emit("messages:new", { message });
};
