import * as express from "express";

export function validateRequestBody<T>(
  req: express.Request,
  schema: Record<keyof T, (value: any) => boolean>
): string[] {
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

  return errors;
}
