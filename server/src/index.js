import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase } from "./config/db.js";

const startServer = async () => {
  try {
    await connectDatabase(env.mongodbUri);
    app.listen(env.port, () => {
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
