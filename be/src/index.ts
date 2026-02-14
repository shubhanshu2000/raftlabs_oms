import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import menuRoutes from "./routes/menu.route";
import orderRoutes from "./routes/order.route";
import logger from "./utils/logger";

dotenv.config();

const app: Application = express() as any;
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

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    logger.info(`[server]: Server is running at http://localhost:${port}`);
  });
}

export default app;
