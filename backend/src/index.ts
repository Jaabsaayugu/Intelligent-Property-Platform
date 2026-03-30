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


console.log("DATABASE_URL:", process.env.DATABASE_URL);

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/reviews", reviewRoutes);


app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

app.get("/api/protected", authenticate, (req, res) => {
  res.json({ message: "You are authenticated" });
});

app.get("/", (req, res) => {
  res.json({ message: "API running" });
});

const PORT = 5000;

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
