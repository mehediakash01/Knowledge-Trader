import httpStatus from "http-status";
import { prisma } from "../../../../lib/prisma";
import AppError from "../../../errors/AppError";

type TCreateNotificationPayload = {
  userId: string;
  title: string;
  message: string;
};

const createNotification = async (payload: TCreateNotificationPayload) => {
  const result = await prisma.notification.create({
    data: payload,
  });

  return result;
};

const getMyNotifications = async (userId: string) => {
  const result = await prisma.notification.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};

const markAsRead = async (id: string, userId: string) => {
  const notification = await prisma.notification.findUnique({
    where: {
      id,
    },
  });

  if (!notification) {
    throw new AppError(httpStatus.NOT_FOUND, "Notification not found");
  }

  if (notification.userId !== userId) {
    throw new AppError(
      httpStatus.FORBIDDEN,
      "You can only update your own notifications",
    );
  }

  const result = await prisma.notification.update({
    where: {
      id,
    },
    data: {
      isRead: true,
    },
  });

  return result;
};

export const NotificationServices = {
  createNotification,
  getMyNotifications,
  markAsRead,
};
