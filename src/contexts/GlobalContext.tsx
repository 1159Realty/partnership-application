"use client";

import { SetState } from "@/utils/global-types";
import { createContext, useContext, useState } from "react";

export interface Props {
  children?: React.ReactNode;
}

export interface IGlobalContext {
  showMenu: boolean;
  setShowMenu: SetState<boolean>;
  showOnboardingForm: boolean;
  setShowOnboardingForm: SetState<boolean>;
}

export const GlobalContext = createContext<IGlobalContext>({} as IGlobalContext);

export const useGlobalContext = () => {
  return useContext(GlobalContext);
};

export const GlobalContextProvider = ({ children }: Props) => {
  const [showMenu, setShowMenu] = useState<boolean>(false);
  const [showOnboardingForm, setShowOnboardingForm] = useState<boolean>(false);

  const value = {
    showMenu,
    setShowMenu,
    showOnboardingForm,
    setShowOnboardingForm,
  };

  return <GlobalContext.Provider value={value}>{children} </GlobalContext.Provider>;
};
