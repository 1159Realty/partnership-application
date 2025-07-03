import { User } from "../user/user.types";
import { IProperty } from "../property/property.types";
import { Dayjs } from "dayjs";
import { Weekday } from "@/utils/constants";

const appointmentStatusArray = ["PENDING", "CANCELLED", "EXPIRED", "COMPLETED"] as const;
type AppointmentStatus = (typeof appointmentStatusArray)[number];

type ScheduleAppointmentPayload = {
  weekday: string;
  period: number | null;
  propertyId: string;
  time: string;
};

type ScheduleAppointmentFormPayload = {
  weekday: string;
  period: Dayjs | null;
  propertyId?: string;
  time?: string;
};

type IAppointment = {
  id: string;
  weekday: Weekday;
  period: number;
  time: string;
  status: AppointmentStatus;
  cancelledReason: string;
  property: IProperty;
  createdBy: User;
  moderatedBy: User;
};

interface FetchAppointmentArgs {
  status?: AppointmentStatus;
  propertyId?: string;
  userId?: string;
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  keyword?: string;
  page?: number;
  limit?: number;
}
export type { ScheduleAppointmentPayload, ScheduleAppointmentFormPayload, IAppointment, AppointmentStatus, FetchAppointmentArgs };
export { appointmentStatusArray };
