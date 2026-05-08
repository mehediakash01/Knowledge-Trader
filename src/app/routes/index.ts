import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.routes";
import { SkillPostRoutes } from "../modules/skillPost/skillPost.routes";
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
    path: "/skill-posts",
    route: SkillPostRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
