"use client";

import { getClient } from "../client.api";
import { useCallback } from "react";
import { Customer } from "./types";
import { formatError } from "@/services/errors";

function useCustomer() {
  const fetchCustomerProfile = useCallback(async (id: string): Promise<Customer | null> => {
    try {
      const response = await getClient<Customer | null>(`public/user/${id}`);
      if (response?.statusCode === 200) {
        if (response?.result) {
          return response?.result;
        }
        return null;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  return { fetchCustomerProfile };
}

export { useCustomer };
