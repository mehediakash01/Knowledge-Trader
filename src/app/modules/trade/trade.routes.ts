import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { TradeControllers } from "./trade.controller";
import { TradeValidation } from "./trade.validation";

const router = Router();

router.post(
  "/token-trade",
  auth(Role.USER),
  validateRequest(TradeValidation.executeTokenTradeValidationSchema),
  TradeControllers.executeTokenTrade,
);

router.get("/my-trades", auth(Role.USER), TradeControllers.getMyTrades);

export const TradeRoutes = router;
