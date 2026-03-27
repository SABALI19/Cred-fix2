import { AgentMessage } from "../models/AgentMessage.js";
import { emitNewMessage } from "../realtime/socket.js";

const SERVICE_TYPE_LABELS = {
  credit_repair: "Credit Repair",
  tax_services: "Tax Services",
  comprehensive: "Comprehensive Plan",
};

export const serializeMessage = (message) => ({
  ...message,
  _id: message._id.toString(),
  senderId: message.senderId.toString(),
  recipientId: message.recipientId.toString(),
});

const describeService = ({ serviceType, planName } = {}) => {
  if (planName) {
    return `${String(planName).trim()} plan`;
  }

  if (serviceType && SERVICE_TYPE_LABELS[serviceType]) {
    return SERVICE_TYPE_LABELS[serviceType];
  }

  return "your CreditFix Pro service";
};

const buildAssignmentMessage = ({ source, userName, serviceLabel }) => {
  if (source === "consultation_booked") {
    return `Hi, I'm ${userName}. I booked a consultation for ${serviceLabel} and would like to get started with you as my CreditFix Pro agent.`;
  }

  if (source === "admin_assigned") {
    return `Hi, I'm ${userName}. The CreditFix Pro team matched me with you for ${serviceLabel}, and I'd like to get started.`;
  }

  return `Hi, I'm ${userName}. I registered for ${serviceLabel} and selected you as my CreditFix Pro agent. I'd like to get started.`;
};

export const ensureAgentAssignmentRequest = async ({
  user,
  agentId,
  source = "user_selected",
  serviceType = "",
  planName = "",
}) => {
  if (!user?._id || !agentId) {
    return null;
  }

  const existingThreadMessage = await AgentMessage.findOne({
    $or: [
      { senderId: user._id, recipientId: agentId },
      { senderId: agentId, recipientId: user._id },
    ],
  })
    .select("_id")
    .lean();

  if (existingThreadMessage) {
    return null;
  }

  const serviceLabel = describeService({
    serviceType: serviceType || user.selectedService || user.activePlan?.serviceType || "",
    planName: planName || user.activePlan?.name || "",
  });

  const createdMessage = await AgentMessage.create({
    senderId: user._id,
    recipientId: agentId,
    content: buildAssignmentMessage({
      source,
      userName: user.name || "there",
      serviceLabel,
    }),
  });

  emitNewMessage(serializeMessage(createdMessage.toObject()));
  return createdMessage;
};
