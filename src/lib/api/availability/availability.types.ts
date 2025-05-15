import { Weekday } from "@/utils/constants";
import { Dayjs } from "dayjs";

type AvailabilityPayload = {
  weekday: string;
  periods: number[];
  slot: number;
  duration: number;
};

type AvailabilityFormPayload = {
  weekday: string;
  resumption: Dayjs | null;
  closing: Dayjs | null;
  duration: number | "";
  slot: number | "";
};

type IAvailability = {
  id: string;
  weekday: Weekday;
  periods: number[];
  booked: number[];
  slot: number;
  duration: number;
};
export type { AvailabilityPayload, AvailabilityFormPayload, IAvailability };
