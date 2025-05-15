// eslint-disable-next-line @typescript-eslint/no-explicit-any
function objectHasValue(obj: Record<string, any> | null | undefined): boolean {
  if (!obj || typeof obj !== "object") return false;

  return Object.values(obj).some((value) => {
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    return true;
  });
}

export { objectHasValue };
