import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { Prisma } from "../../../generated/prisma/client";
import AppError from "../../errors/AppError";
import logger from "../../shared/logger";

type TErrorSource = {
  path: string | number;
  message: string;
};

type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
};

const handleZodError = (error: ZodError): TGenericErrorResponse => {
  const errorSources = error.issues.map((issue) => ({
    path: String(issue.path[issue.path.length - 1] ?? ""),
    message: issue.message,
  }));

  return {
    statusCode: 400,
    message: "Validation Error",
    errorSources,
  };
};

const handlePrismaKnownRequestError = (
  error: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  if (error.code === "P2002") {
    const target = Array.isArray(error.meta?.target)
      ? error.meta.target.join(", ")
      : "field";

    return {
      statusCode: 409,
      message: "Duplicate key error",
      errorSources: [{ path: target, message: `${target} already exists` }],
    };
  }

  if (error.code === "P2025") {
    return {
      statusCode: 404,
      message: "Record not found",
      errorSources: [{ path: "", message: "The requested record was not found" }],
    };
  }

  if (error.code === "P2003") {
    return {
      statusCode: 400,
      message: "Foreign key constraint failed",
      errorSources: [{ path: "", message: error.message }],
    };
  }

  return {
    statusCode: 400,
    message: "Database request failed",
    errorSources: [{ path: "", message: error.message }],
  };
};

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode = 500;
  let message = "Something went wrong";
  let errorSources: TErrorSource[] = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZodError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaKnownRequestError(error);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  } else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Prisma validation error";
    errorSources = [{ path: "", message: error.message }];
  } else if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    errorSources = [{ path: "", message: error.message }];
  } else if (error instanceof Error) {
    message = error.message;
    errorSources = [{ path: "", message: error.message }];
  }

  logger.error({
    message,
    statusCode,
    errorSources,
    stack: error instanceof Error ? error.stack : undefined,
  });

  res.status(statusCode).json({
    success: false,
    message,
    errorSources,
  });
};

export default globalErrorHandler;
