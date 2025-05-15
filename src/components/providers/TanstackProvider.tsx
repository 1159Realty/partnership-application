"use client";
import React from "react";
import { ChildrenProps } from "@/utils/global-types";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10000,
      refetchOnWindowFocus: false,
    },
  },
});

const TanstackProvider = ({ children }: ChildrenProps) => {
  return <QueryClientProvider client={queryClient}>{children} </QueryClientProvider>;
};

export { TanstackProvider };
