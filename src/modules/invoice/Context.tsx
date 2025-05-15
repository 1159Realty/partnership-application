"use client";

import { SetState } from "@/utils/global-types";
import { createContext, useContext, useState } from "react";

export interface Props {
  children?: React.ReactNode;
}

interface IContext {
  val: string;
  setVal: SetState<string>;
}

export const Context = createContext<IContext>({} as IContext);

export const useInvoiceContext = () => {
  return useContext(Context);
};

export const InvoiceContext = ({ children }: Props) => {
  const [val, setVal] = useState("");

  const value = { val, setVal };

  return <Context.Provider value={value}>{children} </Context.Provider>;
};
