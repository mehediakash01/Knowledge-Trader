import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AnalyticsServices } from "./analytics.service";

const getAdminStats = catchAsync(async (_req, res) => {
  const result = await AnalyticsServices.getAdminStats();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin stats retrieved successfully",
    data: result,
  });
});

const getTradeAnalytics = catchAsync(async (req, res) => {
  const result = await AnalyticsServices.getTradeAnalytics(
    req.query.groupBy === "category" ? "category" : "date",
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Trade analytics retrieved successfully",
    data: result,
  });
});

export const AnalyticsControllers = {
  getAdminStats,
  getTradeAnalytics,
};
