import { User } from "../models/User.js";
import { verifyAuthToken } from "../utils/jwt.js";
import { resolveEffectiveRole } from "../utils/adminAccess.js";

export const optionalAuth = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return next();
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      return next();
    }

    req.auth = { userId: user._id.toString(), role: resolveEffectiveRole(user) };
    req.user = user;
    return next();
  } catch (_error) {
    return next();
  }
};
