"use client";

import { User } from "@/lib/api/user/user.types";
import { ROUTES, SESSION } from "@/utils/constants";
import { deleteCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { saveClientSession, updateClientSessionUser } from ".";
import { useUserContext } from "@/contexts/UserContext";
import { Session } from "@/lib/api/api.types";

export const useSession = () => {
  const router = useRouter();
  const { setUserData } = useUserContext();

  async function saveSession(session: Session) {
    saveClientSession(session);
    if (session?.user) {
      setUserData(session.user);
    }
  }

  async function updateSession(user: User) {
    updateClientSessionUser(user);
    setUserData(user);
  }

  const logout = () => {
    deleteCookie(SESSION);
    setUserData(null);
    router.push(ROUTES["/sign-in"]);
  };

  return {
    logout,
    updateSession,
    saveSession,
  };
};
