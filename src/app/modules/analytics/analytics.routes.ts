import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { AnalyticsControllers } from "./analytics.controller";
import { AnalyticsValidation } from "./analytics.validation";

const router = Router();

router.get("/admin-stats", auth(Role.ADMIN, Role.MANAGER), AnalyticsControllers.getAdminStats);
router.get(
  "/trades",
  auth(Role.ADMIN, Role.MANAGER),
  validateRequest(AnalyticsValidation.tradeAnalyticsValidationSchema),
  AnalyticsControllers.getTradeAnalytics,
);

export const AnalyticsRoutes = router;
