import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";
import propertyRoutes from "./routes/property.routes";
import messageRoutes from "./routes/message.routes";
import reviewRoutes from "./routes/review.routes";
import {
  ensureContactInquiryTable,
  ensurePropertyInteractionTables,
  ensureUserNameColumns,
} from "./lib/prisma";
import recommendationRoutes from "../ai_module";

dotenv.config();

const app = express();
const allowedOrigins = new Set(
  (
    process.env.CORS_ORIGIN ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000,http://localhost:5000,https://afrealtydatahomes.vercel.app,https://intelligent-property-platform.onrender.com"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
);

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked request from ${origin}`));
    },
  })
);
app.use(express.json());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "You are authenticated" });
});

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

const PORT = Number(process.env.PORT) || 5000;

async function bootstrap() {
  await ensureUserNameColumns();
  await ensureContactInquiryTable();
  await ensurePropertyInteractionTables();

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
