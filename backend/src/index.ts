import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import { authenticate } from "./middleware/auth.middleware";

console.log("DATABASE_URL:", process.env.DATABASE_URL);

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});