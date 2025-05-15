import { ZodError } from "zod";

type ValidationError<T> = {
  [K in keyof T]?: string[];
} & {
  requestError?: string;
};

function formatZodErrors<T extends object>(error: ZodError<T>): ValidationError<T> {
  const formattedErrors: ValidationError<T> = {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const errorObj: any = error.format(); // Get formatted error object

  Object.keys(errorObj).forEach((key) => {
    if (key !== "_errors") {
      const fieldKey = key as keyof T;
      formattedErrors[fieldKey] = errorObj[key]._errors || [];
    }
  });

  return formattedErrors;
}

export { formatZodErrors };
export type { ValidationError };
