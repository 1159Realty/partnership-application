import { formatError } from "@/services/errors";
import { getServer } from "../sever.api";
import { IAvailability } from "./availability.types";
import { PaginatedResponse } from "../api.types";

async function fetchAvailabilities(): Promise<IAvailability[] | null> {
  try {
    const response = await getServer<PaginatedResponse<IAvailability> | null>(`availabilities`);

    if (response?.statusCode === 200) {
      if (response?.result) {
        return response?.result?.items;
      }
      return null;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchAvailabilities };
