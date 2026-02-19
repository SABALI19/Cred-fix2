import cors from "cors";
import express from "express";
import morgan from "morgan";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import creditRoutes from "./routes/credit.routes.js";
import disputesRoutes from "./routes/disputes.routes.js";
import healthRoutes from "./routes/health.routes.js";
import consultationsRoutes from "./routes/consultations.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import supportTicketsRoutes from "./routes/supportTickets.routes.js";

const app = express();

app.use(
  cors({
    origin: env.corsOrigin,
    credentials: true,
  }),
);
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.json({ message: "CreditFix backend is running." });
});

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/credit", creditRoutes);
app.use("/api/disputes", disputesRoutes);
app.use("/api/consultations", consultationsRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/support-tickets", supportTicketsRoutes);

app.use((err, _req, res, _next) => {
  const status = err?.status || 500;
  const message = err?.message || "Internal Server Error";
  res.status(status).json({ error: "ServerError", message });
});

export default app;
