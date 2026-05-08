import httpStatus from "http-status";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { AIServices } from "./ai.service";

const skillMatchmaker = catchAsync(async (req, res) => {
  const result = await AIServices.skillMatchmaker(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.provider === "mock"
        ? "Service Busy: fallback skill matches returned"
        : "Skill matches generated successfully",
    data: result,
  });
});

const generateCourseContent = catchAsync(async (req, res) => {
  const result = await AIServices.generateCourseContent(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.provider === "mock"
        ? "Service Busy: fallback course content returned"
        : "Course content generated successfully",
    data: result,
  });
});

const summarizeReviews = catchAsync(async (req, res) => {
  const result = await AIServices.summarizeReviews(String(req.params.postId));

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.provider === "mock"
        ? "Service Busy: fallback review summary returned"
        : "Review summary generated successfully",
    data: result,
  });
});

const tradeConsultant = catchAsync(async (req, res) => {
  const result = await AIServices.tradeConsultant(req.user!.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message:
      result.provider === "mock"
        ? "Service Busy: fallback roadmap returned"
        : "Learning roadmap generated successfully",
    data: result,
  });
});

export const AIControllers = {
  skillMatchmaker,
  generateCourseContent,
  summarizeReviews,
  tradeConsultant,
};
