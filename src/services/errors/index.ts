function formatError(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}\nStack: ${error.stack}`;
  } else if (typeof error === "string") {
    return error;
  } else if (typeof error === "object" && error !== null) {
    return JSON.stringify(error, null, 2);
  } else {
    return error as string;
  }
}

export { formatError };
