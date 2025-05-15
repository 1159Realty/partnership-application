"use client";

import { User } from "@/lib/api/user/user.types";
import { useUser } from "@/lib/api/user/useUser";
import { getClientSession, saveClientSession } from "@/lib/session/client";
import { SetState } from "@/utils/global-types";
import { createContext, useContext, useEffect, useState } from "react";

export interface Props {
  children?: React.ReactNode;
  initialUserData: User | null;
}

interface IContext {
  userData: User | null;
  setUserData: SetState<User | null>;
}

export const Context = createContext<IContext>({} as IContext);

export const useUserContext = () => {
  return useContext(Context);
};

export const UserContextProvider = ({ children, initialUserData }: Props) => {
  const { fetchUserData } = useUser();

  const [init, setInit] = useState(false);

  const [userData, setUserData] = useState<User | null>(initialUserData);
  const value = {
    userData,
    setUserData,
  };

  useEffect(() => {
    if (init) return;
    const session = getClientSession();
    const userId = session?.user?.id;

    if (!userId) return;

    async function getUserAsync() {
      const response = await fetchUserData();
      if (response) {
        saveClientSession({ ...session, user: response });
        setUserData(response);
      }
      setInit(true);
    }

    getUserAsync();
  }, [fetchUserData, init]);

  return <Context.Provider value={value}>{children} </Context.Provider>;
};
