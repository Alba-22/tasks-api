import * as express from "express";

export function validateRequestBody<T>(
  req: express.Request,
  res: express.Response,
  schema: Record<keyof T, (value: any) => boolean>
): void {
  const errors: string[] = [];

  for (const key in schema) {
    if (schema.hasOwnProperty(key)) {
      const validator = schema[key];
      const value = req.body[key];

      if (value === undefined || !validator(value)) {
        errors.push(`Invalid ${key}`);
      }
    }
  }

  if (errors.length > 0) {
    res.status(400).json({ message: errors });
  }
}
