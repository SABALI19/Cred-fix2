import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "replace_me_in_production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export const signAuthToken = (payload) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyAuthToken = (token) => jwt.verify(token, JWT_SECRET);
