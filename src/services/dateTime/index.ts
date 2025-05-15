import { Weekday, WEEKDAYS } from "@/utils/constants";
import dayjs, { Dayjs } from "dayjs";

function getMinuteOfDay(date: Dayjs): number {
  return date.hour() * 60 + date.minute();
}

function generateMinuteIntervals(start: number, end: number, step: number): number[] {
  const result: number[] = [];

  if (start > end || step <= 0) {
    return [];
  }

  for (let i = start; i <= end; i += step) {
    result.push(i);
  }

  return result;
}

function minutesTo12HourTime(minutes: number): string {
  if (minutes < 0 || isNaN(minutes)) return "";

  return dayjs().startOf("day").add(minutes, "minute").format("h:mm A");
}

function sortMinutes(minutes: number[], sort?: "asc" | "dsc"): number[] {
  if (!minutes || minutes.length === 0) return minutes;

  return [...minutes].sort((a, b) => {
    if (sort === "dsc") {
      return b - a;
    }
    return a - b;
  });
}

function minutesToTimeRange(minutes: number[]): string {
  if (minutes.length === 0) return "";

  const sorted = sortMinutes(minutes);
  const minTime = minutesTo12HourTime(sorted[0]);
  const maxTime = minutesTo12HourTime(sorted[sorted.length - 1]);

  return `${minTime} - ${maxTime}`;
}

function getDateTimeString(input?: string, type: "date-only" | "date-time" | "time-only" | "year-only" = "date-time"): string {
  if (!input) return "";
  const date = new Date(input);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let options: any;

  if (type === "date-time") {
    options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
  } else if (type === "time-only") {
    options = {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
  } else if (type === "date-only") {
    options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
  } else if (type === "year-only") {
    options = {
      year: "numeric",
    };
  }

  return date.toLocaleString("en-US", options);
}

function getNextDateTime(day: Weekday, timeInMinutes: number): string {
  const today = new Date();
  const currentDayIndex = today.getDay(); // 0 (Sunday) - 6 (Saturday)
  const targetDayIndex = WEEKDAYS.indexOf(day);

  // Determine how many days to add
  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Move to the next week's same day
  }

  // Calculate the target date in local time
  const targetDate = new Date();
  targetDate.setDate(today.getDate() + daysToAdd);

  // Set the time using minutes (local time)
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;
  targetDate.setHours(hours, minutes, 0, 0); // Use setHours instead of setUTCHours

  // Convert to ISO format while keeping local timezone offset
  return targetDate.toISOString();
}

function getNextDate(day: Weekday): string {
  const today = dayjs().startOf("day"); // Today's date at midnight
  const currentDayIndex = today.day(); // 0 (Sunday) - 6 (Saturday)
  const targetDayIndex = WEEKDAYS.indexOf(day);

  // Calculate how many days to add
  let daysToAdd = targetDayIndex - currentDayIndex;
  if (daysToAdd <= 0) {
    daysToAdd += 7; // Move to the next week's same day
  }

  // Compute target date
  return today.add(daysToAdd, "day").format("YYYY-MM-DD");
}

function getMinMaxTimeFromMinutes(minutesArray: number[]): { minTime: Dayjs | null; maxTime: Dayjs | null } {
  if (minutesArray.length === 0) {
    return { minTime: null, maxTime: null };
  }

  // Find the min and max minutes
  const minMinutes = Math.min(...minutesArray);
  const maxMinutes = Math.max(...minutesArray);

  return {
    minTime: dayjs()
      .set("hour", Math.floor(minMinutes / 60))
      .set("minute", minMinutes % 60)
      .set("second", 0)
      .set("millisecond", 0),
    maxTime: dayjs()
      .set("hour", Math.floor(maxMinutes / 60))
      .set("minute", maxMinutes % 60)
      .set("second", 0)
      .set("millisecond", 0),
  };
}

function timeAgo(input: string): string {
  const date = new Date(input);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears === 1 ? "" : "s"} ago`;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sortWeekDay(days: any[]): any[] {
  return days.sort((a, b) => {
    return WEEKDAYS.indexOf(a) - WEEKDAYS.indexOf(b);
  });
}

function formatAsIsoString(input: Dayjs | Date | null | string | undefined): string {
  if (!input) return "";
  if (typeof input === "string") {
    input = new Date(input);
  }
  return input.toISOString();
}

function getYear(input?: Date | string): string {
  const date = !input ? new Date() : typeof input === "string" ? new Date(input) : input;

  return date.toLocaleString("en-US", {
    year: "numeric",
  });
}

function getDigitalClockDisableTime(bookedPeriods: number[] | undefined, slot: number | undefined): (time: Dayjs) => boolean {
  // If no valid input, don't disable anything
  if (!bookedPeriods || bookedPeriods.length === 0 || !slot) {
    return () => false;
  }

  const timeCount: Record<number, number> = {};

  // Count occurrences of each minute
  bookedPeriods.forEach((min) => {
    timeCount[min] = (timeCount[min] || 0) + 1;
  });

  return function (time: Dayjs): boolean {
    const minuteOfDay = time.hour() * 60 + time.minute();
    return (timeCount[minuteOfDay] || 0) >= slot;
  };
}

export {
  getMinuteOfDay,
  generateMinuteIntervals,
  sortMinutes,
  minutesTo12HourTime,
  minutesToTimeRange,
  getDateTimeString,
  getNextDateTime,
  getNextDate,
  getMinMaxTimeFromMinutes,
  timeAgo,
  sortWeekDay,
  formatAsIsoString,
  getYear,
  getDigitalClockDisableTime,
};
