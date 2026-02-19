import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envCandidates = [
  path.resolve(__dirname, "../../.env"), // server/.env
  path.resolve(process.cwd(), ".env"), // repo root .env (fallback)
];

for (const envPath of envCandidates) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath, override: false });
  }
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  mongodbUri:
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/creditfix",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:5173",
};
