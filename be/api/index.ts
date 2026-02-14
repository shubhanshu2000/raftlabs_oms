import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import menuRoutes from "../src/routes/menu.route";
import orderRoutes from "../src/routes/order.route";
import logger from "../src/utils/logger";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.http(`${req.method} ${req.url}`);
  next();
});

// Routes
const API_V1 = "/api/v1";

app.get("/", (_req: Request, res: Response) => {
  res.send("Food Delivery API");
});

app.use(`${API_V1}/menu`, menuRoutes);
app.use(`${API_V1}/orders`, orderRoutes);

// 404 handler (must be before error handler)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

// Export app for Vercel
export default app;

// Local development listener
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
  });
}
