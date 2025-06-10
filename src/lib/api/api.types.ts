import { User } from "./user/user.types";

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  result: T | null;
  error?: string;
}

interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface Token {
  refresh?: string;
  access?: string;
}

interface Session {
  token?: Token;
  user?: User;
}

type ContentType = "json" | "form-data";

export type { Token, Session, ApiResponse, PaginatedResponse, ContentType };
