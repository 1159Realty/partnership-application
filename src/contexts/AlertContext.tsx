"use client";

import { createContext, useContext, useState } from "react";

export interface IAlert {
  message: string;
  severity: "error" | "success" | "warning" | "info";
  show: boolean;
  hide?: number;
}

export interface Props {
  children?: React.ReactNode;
}

export interface IAlertContext {
  alert: IAlert;
  setAlert: React.Dispatch<React.SetStateAction<IAlert>>;
}

export const AlertContext = createContext<IAlertContext>({} as IAlertContext);

export const useAlertContext = () => {
  return useContext(AlertContext);
};

export const AlertContextProvider = ({ children }: Props) => {
  const [alert, setAlert] = useState<IAlert>({
    message: "",
    severity: "info",
    show: false,
  });

  const value = {
    alert,
    setAlert,
  };

  return <AlertContext.Provider value={value}>{children}</AlertContext.Provider>;
};
