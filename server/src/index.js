import app from "./app.js";
import http from "node:http";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";
import { initSocketServer } from "./realtime/socket.js";

const startServer = async () => {
  try {
    await connectDatabase(env.mongodbUri);
    const httpServer = http.createServer(app);
    initSocketServer(httpServer, { corsOrigins: env.corsOrigins });

    httpServer.listen(env.port, () => {
      console.log(
        `Backend running on http://localhost:${env.port} (${env.nodeEnv})`,
      );
    });
  } catch (error) {
    console.error("Failed to start backend:", error);
    process.exit(1);
  }
};

startServer();
