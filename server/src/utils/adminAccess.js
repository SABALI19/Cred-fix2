import { env } from "../config/env.js";

const ADMIN_ACCESS_EMAILS_SET = new Set(env.adminAccessEmails);

export const hasAdminAccessByEmail =  (email = "") =>
  ADMIN_ACCESS_EMAILS_SET.has(String(email).toLowerCase().trim());
  

export const resolveEffectiveRole = (user) =>
  hasAdminAccessByEmail(user?.email) ? "admin" : user?.role || "user";

export const toAuthUser = (user) => {
  const payload = user.toJSON();
  const selectedAgent = payload.assignedAgentId;

  if (selectedAgent && typeof selectedAgent === "object" && selectedAgent._id) {
    payload.assignedAgent = {
      _id: selectedAgent._id,
      name: selectedAgent.name,
      email: selectedAgent.email,
      profilePhoto: selectedAgent.profilePhoto || "",
      phone: selectedAgent.phone || "",
      bio: selectedAgent.bio || "",
    };
    payload.assignedAgentId = selectedAgent._id;
  }

  return {
    ...payload,
    role: resolveEffectiveRole(user),
  };
};
