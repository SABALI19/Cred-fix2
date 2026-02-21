import { env } from "../config/env.js";

const ADMIN_ACCESS_EMAILS_SET = new Set(env.adminAccessEmails);

export const hasAdminAccessByEmail =  (email = "") =>
  ADMIN_ACCESS_EMAILS_SET.has(String(email).toLowerCase().trim());
  

export const resolveEffectiveRole = (user) =>
  hasAdminAccessByEmail(user?.email) ? "admin" : user?.role || "user";

export const toAuthUser = (user) => ({
  ...user.toJSON(),
  role: resolveEffectiveRole(user),
})