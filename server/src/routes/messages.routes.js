import { Router } from "express";
import mongoose from "mongoose";
import { requireAuth } from "../middleware/auth.middleware.js";
import { AgentMessage } from "../models/AgentMessage.js";
import { User } from "../models/User.js";
import { emitNewMessage } from "../realtime/socket.js";

const router = Router();

const serializeMessage = (message) => ({
  ...message,
  _id: message._id.toString(),
  senderId: message.senderId.toString(),
  recipientId: message.recipientId.toString(),
});

const isValidObjectId = (value) => mongoose.isValidObjectId(value);

const validateMessageAccess = async ({ sender, senderRole, recipientId }) => {
  if (!isValidObjectId(recipientId)) {
    return { error: { status: 400, message: "Invalid recipientId" } };
  }

  const recipient = await User.findById(recipientId)
    .select("_id role assignedAgentId")
    .lean();

  if (!recipient) {
    return { error: { status: 404, message: "Recipient not found" } };
  }

  if (sender._id.toString() === recipient._id.toString()) {
    return { error: { status: 400, message: "Cannot send message to yourself" } };
  }

  if (senderRole === "admin") {
    return { recipient };
  }

  if (senderRole === "user") {
    if (recipient.role !== "agent") {
      return { error: { status: 403, message: "Users can message only agents" } };
    }
    if (!sender.assignedAgentId || sender.assignedAgentId.toString() !== recipient._id.toString()) {
      return { error: { status: 403, message: "You can message only your selected agent" } };
    }
    return { recipient };
  }

  if (senderRole === "agent") {
    if (recipient.role !== "user") {
      return { error: { status: 403, message: "Agents can message only users" } };
    }
    if (!recipient.assignedAgentId || recipient.assignedAgentId.toString() !== sender._id.toString()) {
      return { error: { status: 403, message: "User is not assigned to this agent" } };
    }
    return { recipient };
  }

  return { error: { status: 403, message: "Messaging not permitted for this role" } };
};

router.use(requireAuth);

router.get("/assigned-agent", async (req, res, next) => {
  try {
    if (req.auth?.role !== "user") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only users can access this endpoint",
      });
    }

    const agentId = req.user.assignedAgentId?.toString();

    if (!agentId) {
      return res.json({ agent: null, messages: [] });
    }

    const agent = await User.findById(agentId)
      .select("_id name email profilePhoto phone bio")
      .lean();

    if (!agent) {
      req.user.assignedAgentId = null;
      await req.user.save();
      return res.json({ agent: null, messages: [] });
    }

    const messages = await AgentMessage.find({
      $or: [
        { senderId: req.user._id, recipientId: agent._id },
        { senderId: agent._id, recipientId: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    await AgentMessage.updateMany(
      {
        senderId: agent._id,
        recipientId: req.user._id,
        readAt: null,
      },
      { $set: { readAt: new Date() } },
    );

    return res.json({
      agent: {
        ...agent,
        _id: agent._id.toString(),
      },
      messages: messages.map(serializeMessage),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/agent/conversations", async (req, res, next) => {
  try {
    if (req.auth?.role !== "agent" && req.auth?.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only agents can access this endpoint",
      });
    }

    const agentId = req.user._id;
    const assignedUsers = await User.find({
      role: "user",
      assignedAgentId: agentId,
    })
      .select("_id name email profilePhoto")
      .sort({ updatedAt: -1 })
      .lean();

    if (assignedUsers.length === 0) {
      return res.json({ conversations: [] });
    }

    const userIds = assignedUsers.map((user) => user._id);
    const messages = await AgentMessage.find({
      $or: [
        { senderId: agentId, recipientId: { $in: userIds } },
        { senderId: { $in: userIds }, recipientId: agentId },
      ],
    })
      .sort({ createdAt: -1 })
      .lean();

    const conversationMap = new Map();

    for (const user of assignedUsers) {
      conversationMap.set(user._id.toString(), {
        user: { ...user, _id: user._id.toString() },
        lastMessage: null,
        unreadCount: 0,
      });
    }

    for (const message of messages) {
      const senderId = message.senderId.toString();
      const recipientId = message.recipientId.toString();
      const userId = senderId === agentId.toString() ? recipientId : senderId;

      if (!conversationMap.has(userId)) continue;

      const entry = conversationMap.get(userId);
      if (!entry.lastMessage) {
        entry.lastMessage = {
          ...serializeMessage(message),
        };
      }
      if (recipientId === agentId.toString() && !message.readAt) {
        entry.unreadCount += 1;
      }
    }

    return res.json({
      conversations: Array.from(conversationMap.values()).sort((a, b) => {
        const aTime = a.lastMessage?.createdAt || "";
        const bTime = b.lastMessage?.createdAt || "";
        return bTime.localeCompare(aTime);
      }),
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/agent/conversations/:userId", async (req, res, next) => {
  try {
    if (req.auth?.role !== "agent" && req.auth?.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
        message: "Only agents can access this endpoint",
      });
    }

    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({
        error: "ValidationError",
        message: "Invalid userId",
      });
    }

    const user = await User.findOne({
      _id: userId,
      role: "user",
      assignedAgentId: req.user._id,
    })
      .select("_id name email profilePhoto phone bio")
      .lean();

    if (!user && req.auth?.role !== "admin") {
      return res.status(404).json({
        error: "NotFound",
        message: "User not found for this agent",
      });
    }

    const participant =
      user ||
      (await User.findById(userId)
        .select("_id name email profilePhoto phone bio")
        .lean());

    if (!participant) {
      return res.status(404).json({
        error: "NotFound",
        message: "User not found",
      });
    }

    const messages = await AgentMessage.find({
      $or: [
        { senderId: req.user._id, recipientId: participant._id },
        { senderId: participant._id, recipientId: req.user._id },
      ],
    })
      .sort({ createdAt: 1 })
      .lean();

    await AgentMessage.updateMany(
      {
        senderId: participant._id,
        recipientId: req.user._id,
        readAt: null,
      },
      { $set: { readAt: new Date() } },
    );

    return res.json({
      participant: {
        ...participant,
        _id: participant._id.toString(),
      },
      messages: messages.map(serializeMessage),
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { recipientId, content } = req.body || {};

    if (!recipientId || !content) {
      return res.status(400).json({
        error: "ValidationError",
        message: "recipientId and content are required",
      });
    }

    const trimmedContent = String(content).trim();
    if (!trimmedContent) {
      return res.status(400).json({
        error: "ValidationError",
        message: "content cannot be empty",
      });
    }

    const access = await validateMessageAccess({
      sender: req.user,
      senderRole: req.auth?.role,
      recipientId,
    });

    if (access.error) {
      const errorType =
        access.error.status === 400
          ? "ValidationError"
          : access.error.status === 404
            ? "NotFound"
            : "Forbidden";
      return res.status(access.error.status).json({
        error: errorType,
        message: access.error.message,
      });
    }

    const created = await AgentMessage.create({
      senderId: req.user._id,
      recipientId: access.recipient._id,
      content: trimmedContent,
    });

    const serializedMessage = serializeMessage(created.toObject());
    emitNewMessage(serializedMessage);

    return res.status(201).json({
      message: serializedMessage,
    });
  } catch (error) {
    return next(error);
  }
});

export default router;
