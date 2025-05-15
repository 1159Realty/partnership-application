"use client";

import { PaginatedResponse } from "../api.types";
import { getClient, postClient, putClient } from "../client.api";
import { formatError } from "@/services/errors";
import { useCallback } from "react";
import { FetchInvoiceArgs, IInvoice, IMakePaymentCredentials, InvoiceStatus, InvoiceTotal } from "./invoice.types";

function useInvoice() {
  const fetchInvoices = useCallback(async (args?: FetchInvoiceArgs): Promise<PaginatedResponse<IInvoice> | null> => {
    try {
      const response = await getClient<PaginatedResponse<IInvoice> | null>(
        `invoices?page=${args?.page || 1}&limit=${args?.limit || 10}${
          args?.enrollmentId ? `&enrolmentId=${args.enrollmentId}` : ""
        }${args?.userId ? `&userId=${args.userId}` : ""}
${args?.status ? `&status=${args.status}` : ""}
${args?.startDate ? `&startDate=${encodeURIComponent(args.startDate)}` : ""}
${args?.endDate ? `&endDate=${encodeURIComponent(args.endDate)}` : ""}`
      );
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const fetchInvoiceTotal = useCallback(async (): Promise<InvoiceTotal | null> => {
    try {
      const response = await getClient<InvoiceTotal | null>(`invoices/totals`);
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const changeInvoiceStatus = useCallback(async (id: string, status: InvoiceStatus = "PAID"): Promise<boolean> => {
    try {
      const response = await putClient(`invoices/change-status/${id}`, { status });
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  const makeInvoicePayment = useCallback(async (invoiceId: string): Promise<IMakePaymentCredentials | null> => {
    try {
      const response = await postClient<IMakePaymentCredentials | null>(`payments/initialize`, { invoiceId });
      if (response?.statusCode === 200) {
        return response?.result;
      }
      return null;
    } catch (error) {
      console.error(formatError(error));
      return null;
    }
  }, []);

  const resolveInvoicePayment = useCallback(async (id: string): Promise<boolean> => {
    try {
      const response = await putClient<boolean | null>(`payments/manual-invoice-resolver/${id}`);
      if (response?.statusCode === 200) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(formatError(error));
      return false;
    }
  }, []);

  return {
    fetchInvoices,
    resolveInvoicePayment,
    changeInvoiceStatus,
    makeInvoicePayment,
    fetchInvoiceTotal,
  };
}

export { useInvoice };
