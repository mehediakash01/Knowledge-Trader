import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import auth, { optionalAuth } from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { SkillPostControllers } from "./skillPost.controller";
import { SkillPostValidation } from "./skillPost.validation";

const router = Router();

router.get("/", SkillPostControllers.getAllSkillPosts);
router.get("/categories", SkillPostControllers.getCategories);
router.get("/home-feed", SkillPostControllers.getHomeFeed);
router.get("/:id", optionalAuth, SkillPostControllers.getSingleSkillPost);

router.post(
  "/",
  auth(Role.USER, Role.MANAGER, Role.ADMIN),
  validateRequest(SkillPostValidation.createSkillPostValidationSchema),
  SkillPostControllers.createSkillPost,
);

router.patch(
  "/:id",
  auth(Role.USER, Role.MANAGER, Role.ADMIN),
  validateRequest(SkillPostValidation.updateSkillPostValidationSchema),
  SkillPostControllers.updateSkillPost,
);

export const SkillPostRoutes = router;
