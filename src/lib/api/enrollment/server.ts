import { formatError } from "@/services/errors";
import { PaginatedResponse } from "../api.types";
import { getServer } from "../sever.api";
import { getServerSession } from "@/lib/session/server";
import { FetchEnrollmentArgs, IEnrollment } from "./types";

async function fetchEnrollments(args?: FetchEnrollmentArgs): Promise<PaginatedResponse<IEnrollment> | null> {
  try {
    const response = await getServer<PaginatedResponse<IEnrollment> | null>(
      `enrolments?page=${args?.page || 1}&limit=${args?.limit || 10}${args?.keyword ? `&keyword=${args.keyword}` : ""}${
        args?.userId ? `&userId=${args.userId}` : ""
      }${args?.propertyId ? `&propertyId=${args.propertyId}` : ""}${args?.agentId ? `&agentId=${args.agentId}` : ""}${
        args?.stateId ? `&stateId=${args.stateId}` : ""
      }${args?.lgaId ? `&lgaId=${args.lgaId}` : ""}${args?.areaId ? `&areaId=${args.areaId}` : ""}${
        args?.status ? `&status=${args.status}` : ""
      }`
    );

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchEnrollmentsByUserId(): Promise<PaginatedResponse<IEnrollment> | null> {
  try {
    const session = await getServerSession();
    const response = await getServer<PaginatedResponse<IEnrollment> | null>(`enrollments?userId=${session?.user?.id}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchEnrollment(id: string): Promise<IEnrollment | null> {
  try {
    const response = await getServer<IEnrollment | null>(`enrolments/${id}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchEnrollments, fetchEnrollmentsByUserId, fetchEnrollment };
