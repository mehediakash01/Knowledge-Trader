import xss from "xss";
import { RequestHandler } from "express";

const sanitizeValue = (value: unknown): unknown => {
  if (typeof value === "string") {
    return xss(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeValue(item));
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, sanitizeValue(item)]),
    );
  }

  return value;
};

const xssSanitizer: RequestHandler = (req, _res, next) => {
  if (["POST", "PATCH"].includes(req.method) && req.body) {
    req.body = sanitizeValue(req.body);
  }

  next();
};

export default xssSanitizer;
