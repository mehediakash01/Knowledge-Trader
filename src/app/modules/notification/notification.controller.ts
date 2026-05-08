import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { NotificationServices } from "./notification.service";

const createNotification = catchAsync(async (req, res) => {
  const result = await NotificationServices.createNotification(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Notification created successfully",
    data: result,
  });
});

const getMyNotifications = catchAsync(async (req, res) => {
  const result = await NotificationServices.getMyNotifications(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const markAsRead = catchAsync(async (req, res) => {
  const result = await NotificationServices.markAsRead(
    String(req.params.id),
    req.user!.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Notification marked as read",
    data: result,
  });
});

export const NotificationControllers = {
  createNotification,
  getMyNotifications,
  markAsRead,
};
