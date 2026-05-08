import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { openApiDocument } from "./app/docs/openApi";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import xssSanitizer from "./app/middlewares/xssSanitizer";
import router from "./app/routes";
import config from "./config";

const app: Application = express();

app.use(helmet());
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(xssSanitizer);

app.get("/", (_req: Request, res: Response) => {
  res.send("Knowledge Trader API is running");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));
app.use("/api/v1", router);

app.use(globalErrorHandler);

export default app;
