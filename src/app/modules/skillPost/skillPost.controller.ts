import httpStatus from "http-status";
import pick from "../../../shared/pick";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import {
  skillPostFilterableFields,
} from "./skillPost.constant";
import { SkillPostServices } from "./skillPost.service";

const paginationFields = ["page", "limit", "sortBy", "sortOrder"];

const createSkillPost = catchAsync(async (req, res) => {
  const result = await SkillPostServices.createSkillPost(
    req.user!.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Skill post created successfully",
    data: result,
  });
});

const getAllSkillPosts = catchAsync(async (req, res) => {
  const filters = pick(req.query, skillPostFilterableFields);
  const options = pick(req.query, paginationFields);
  const result = await SkillPostServices.getAllSkillPosts(filters, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skill posts retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getSingleSkillPost = catchAsync(async (req, res) => {
  const result = await SkillPostServices.getSingleSkillPost(
    String(req.params.id),
    req.user?.id,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skill post retrieved successfully",
    data: result,
  });
});

const updateSkillPost = catchAsync(async (req, res) => {
  const result = await SkillPostServices.updateSkillPost(
    String(req.params.id),
    req.user!.id,
    req.body,
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Skill post updated successfully",
    data: result,
  });
});

export const SkillPostControllers = {
  createSkillPost,
  getAllSkillPosts,
  getSingleSkillPost,
  updateSkillPost,
};
