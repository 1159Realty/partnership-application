import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { FetchPropertiesArgs, FetchPropertiesTotalArgs, IProperty, PropertyTotal } from "./property.types";
import { getServer } from "../sever.api";

async function fetchProperties(args?: FetchPropertiesArgs): Promise<PaginatedResponse<IProperty> | null> {
  try {
    const response = await getServer<PaginatedResponse<IProperty> | null>(`properties?page=${args?.page || 1}&limit=${
      args?.limit || 10
    }${args?.propertyName ? `&propertyName=${args.propertyName}` : ""}${args?.stateId ? `&stateId=${args.stateId}` : ""}
${args?.lgaId ? `&lgaId=${args.lgaId}` : ""}
${args?.areaId ? `&areaId=${args.areaId}` : ""}
${args?.status ? `&status=${args.status}` : ""}
${args?.includeDisabled ? `&includeDisabled=${args.includeDisabled}` : ""}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchPropertiesTotal(args?: FetchPropertiesTotalArgs): Promise<number | null> {
  try {
    const response = await getServer<PropertyTotal | null>(`properties/count-properties?${
      args?.propertyName ? `&propertyName=${args.propertyName}` : ""
    }${args?.stateId ? `&stateId=${args.stateId}` : ""}
${args?.lgaId ? `&lgaId=${args.lgaId}` : ""}
${args?.areaId ? `&areaId=${args.areaId}` : ""}
${args?.status ? `&status=${args.status}` : ""}
${args?.includeDisabled ? `&includeDisabled=${args.includeDisabled}` : ""}`);

    if (response?.statusCode === 200) {
      return response?.result?.count || null;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchProperty(id: string): Promise<IProperty | null> {
  try {
    const response = await getServer<IProperty | null>(`properties/${id}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchProperties, fetchProperty, fetchPropertiesTotal };
