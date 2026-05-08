import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { TradeServices } from "./trade.service";

const executeTokenTrade = catchAsync(async (req, res) => {
  const result = await TradeServices.executeTokenTrade(
    req.user!.id,
    req.body.postId,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Token trade completed successfully",
    data: result,
  });
});

const getMyTrades = catchAsync(async (req, res) => {
  const result = await TradeServices.getMyTrades(req.user!.id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "My trades retrieved successfully",
    data: result,
  });
});

export const TradeControllers = {
  executeTokenTrade,
  getMyTrades,
};
