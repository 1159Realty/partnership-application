import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { FetchInvoiceArgs, IInvoice, InvoiceTotal } from "./invoice.types";

async function fetchInvoices(args?: FetchInvoiceArgs): Promise<PaginatedResponse<IInvoice> | null> {
  try {
    const response = await getServer<PaginatedResponse<IInvoice> | null>(`invoices?page=${args?.page || 1}&limit=${
      args?.limit || 10
    }${args?.enrollmentId ? `&enrolmentId=${args.enrollmentId}` : ""}${args?.userId ? `&userId=${args.userId}` : ""}
${args?.status ? `&status=${args.status}` : ""}
${args?.startDate ? `&startDate=${encodeURIComponent(args.startDate)}` : ""}
${args?.endDate ? `&endDate=${encodeURIComponent(args.endDate)}` : ""}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchInvoiceTotal(): Promise<InvoiceTotal | null> {
  try {
    const response = await getServer<InvoiceTotal | null>(`invoices/totals`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchInvoices, fetchInvoiceTotal };
