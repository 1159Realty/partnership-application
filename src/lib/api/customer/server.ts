import { formatError } from "@/services/errors";
import { getServer } from "../sever.api";
import { Customer } from "./types";

async function fetchCustomerProfile(id: string): Promise<Customer | null> {
  try {
    const response = await getServer<Customer | null>(`public/user/${id}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchCustomerProfile };
