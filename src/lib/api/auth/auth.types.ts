import { User } from "@/lib/api/user/user.types";

interface LoginPayload {
  email: string;
  password: string;
}
interface RegisterPayload {
  email: string;
  password: string;
}

type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export type { LoginPayload, AuthResponse, RegisterPayload, ChangePasswordPayload };
