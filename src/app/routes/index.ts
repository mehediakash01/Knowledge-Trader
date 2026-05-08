import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { AIRoutes } from "../modules/AI/ai.routes";
import { SkillPostRoutes } from "../modules/skillPost/skillPost.routes";
import { TradeRoutes } from "../modules/trade/trade.routes";
import { UserRoutes } from "../modules/user/user.routes";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },
  {
    path: "/auth",
    route: AuthRoutes,
  },
  {
    path: "/ai",
    route: AIRoutes,
  },
  {
    path: "/skill-posts",
    route: SkillPostRoutes,
  },
  {
    path: "/trades",
    route: TradeRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
