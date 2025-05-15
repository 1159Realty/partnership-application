import { formatError } from "@/services/errors";
import { IArea, IState } from "./location.types";
import { getServer } from "../sever.api";
import { PaginatedResponse } from "../api.types";

async function fetchStates(): Promise<IState[] | null> {
  try {
    const response = await getServer<PaginatedResponse<IState>>(`state-and-lgas/states`);
    if (response?.result?.items?.length) {
      return response.result.items;
    }
    return null;
  } catch (error) {
    console.error(`${formatError(error)}`);
    return null;
  }
}

async function fetchAreas(): Promise<PaginatedResponse<IArea> | null> {
  try {
    const response = await getServer<PaginatedResponse<IArea>>(`state-and-lgas/areas`);
    if (response?.result?.items?.length) {
      return response.result;
    }
    return null;
  } catch (error) {
    console.error(`${formatError(error)}`);
    return null;
  }
}

export { fetchStates, fetchAreas };
