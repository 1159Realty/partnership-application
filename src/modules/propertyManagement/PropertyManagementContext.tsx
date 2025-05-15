"use client";

import { SetState } from "@/utils/global-types";
import { createContext, useContext, useState } from "react";

export interface Props {
  children?: React.ReactNode;
}

export interface IPropertyFilter {
  stateId?: string;
  lgaId?: string;
  areaId?: string;
}

interface IContext {
  showCreateProperty: boolean;
  setShowCreateProperty: SetState<boolean>;
  query: string;
  setQuery: SetState<string>;
  filters: IPropertyFilter;
  setFilters: SetState<IPropertyFilter>;
  page: number;
  setPage: SetState<number>;
}

export const Context = createContext<IContext>({} as IContext);

export const usePropertyManagementContext = () => {
  return useContext(Context);
};

export const PropertyManagementContextProvider = ({ children }: Props) => {
  const [showCreateProperty, setShowCreateProperty] = useState(false);
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<IPropertyFilter>({});
  const [page, setPage] = useState(1);

  const value = {
    showCreateProperty,
    setShowCreateProperty,
    query,
    setQuery,
    filters,
    setFilters,
    page,
    setPage,
  };

  return <Context.Provider value={value}>{children} </Context.Provider>;
};
