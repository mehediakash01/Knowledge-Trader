import { Router } from "express";
import { Role } from "../../../../generated/prisma/enums";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { NotificationControllers } from "./notification.controller";
import { NotificationValidation } from "./notification.validation";

const router = Router();

router.post(
  "/",
  auth(Role.ADMIN, Role.MANAGER),
  validateRequest(NotificationValidation.createNotificationValidationSchema),
  NotificationControllers.createNotification,
);

router.get("/my-notifications", auth(Role.USER, Role.MANAGER, Role.ADMIN), NotificationControllers.getMyNotifications);

router.patch(
  "/:id/read",
  auth(Role.USER, Role.MANAGER, Role.ADMIN),
  validateRequest(NotificationValidation.markAsReadValidationSchema),
  NotificationControllers.markAsRead,
);

export const NotificationRoutes = router;
