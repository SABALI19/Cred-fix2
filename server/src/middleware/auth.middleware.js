import { User } from "../models/User.js";
import { verifyAuthToken } from "../utils/jwt.js";
import { resolveEffectiveRole } from "../utils/adminAccess.js";

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Missing authorization token",
      });
    }

    const payload = verifyAuthToken(token);
    const user = await User.findById(payload.sub);

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized",
        message: "User no longer exists",
      });
    }

    req.auth = { userId: user._id.toString(), role: resolveEffectiveRole(user) };
    req.user = user;
    return next();
  } catch (_error) {
    return res.status(401).json({
      error: "Unauthorized",
      message: "Invalid or expired token",
    });
  }
};
