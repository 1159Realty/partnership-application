import { formatError } from "@/services/errors";
import { getServer } from "../sever.api";
import { PaginatedResponse } from "../api.types";
import { IAppointment } from "./appointment.types";
import { getServerSession } from "@/lib/session/server";

async function fetchAppointments(): Promise<PaginatedResponse<IAppointment> | null> {
  try {
    const response = await getServer<PaginatedResponse<IAppointment> | null>(`appointments`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

async function fetchAppointmentsByUserId(): Promise<PaginatedResponse<IAppointment> | null> {
  try {
    const session = await getServerSession();
    const response = await getServer<PaginatedResponse<IAppointment> | null>(`appointments?userId=${session?.user?.id}`);

    if (response?.statusCode === 200) {
      return response?.result;
    }
    return null;
  } catch (error) {
    console.error(formatError(error));
    return null;
  }
}

export { fetchAppointments, fetchAppointmentsByUserId };
