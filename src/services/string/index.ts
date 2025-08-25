import { Customer } from "@/lib/api/customer/types";

const truncateString = (
  str?: string,
  max = 30,
  showAll?: "show-all"
): string => {
  if (showAll || !str) return str || "";
  if (str.length <= max) return str; // If within max limit, return as is
  return str.slice(0, Math.max(0, max - 3)) + "..."; // Truncate & add ellipsis
};

function hasNonNumeric(value: string) {
  return /\D/.test(value);
}

function formatPhoneNumber(value: string): null | string {
  value = value?.trim();

  if (!value) return null;
  if (
    value.length !== 10 &&
    value.length !== 11 &&
    value.length !== 13 &&
    value.length !== 14
  )
    return null;
  if ((value.length === 10 || value.length === 11) && hasNonNumeric(value))
    return null;
  if (value.length === 13 && (!value.includes("234") || hasNonNumeric(value)))
    return null;
  if (value.length === 14 && !value.includes("+234")) return null;

  if (value.length === 10) return "+234" + value;
  if (value.length === 11) return "+234" + value.slice(1);
  if (value.length === 13) return "+" + value;
  return value;
}

function capitalize(text: string): string {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

function capitalizeAndSpace(text: string): string {
  if (!text) return "";
  return text
    .replace(/_/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function getUserName(
  user: Customer | null | undefined,
  variant: "full" | "first" | "last" = "full"
): string {
  if (!user) return "N/A";
  if (variant === "first")
    return user?.firstName?.trim() ? user?.firstName : "N/A";
  if (variant === "last")
    return user?.lastName?.trim() ? user?.lastName : "N/A";
  return `${user?.firstName?.trim() || ""} ${
    user?.lastName?.trim() || ""
  }`?.trim()
    ? `${user?.firstName} ${user?.lastName}`
    : "N/A";
}

function phoneNumberToReferralId(value: string) {
  return value.replace("+", "");
}

function normalizeMonth(input: string): string {
  const monthMap: Record<string, string> = {
    january: "Jan",
    february: "Feb",
    march: "Mar",
    april: "Apr",
    may: "May",
    june: "Jun",
    july: "Jul",
    august: "Aug",
    september: "Sep",
    october: "Oct",
    november: "Nov",
    december: "Dec",
  };

  const normalized = input.trim().toLowerCase();

  return monthMap[normalized] ?? input;
}

function mapNigerianState(
  input: string,
  type: "full" | "abbr" = "abbr"
): string {
  const fullToAbbr: Record<string, string> = {
    abia: "AB",
    adamawa: "AD",
    akwa_ibom: "AK",
    anambra: "AN",
    bauchi: "BA",
    bayelsa: "BY",
    benue: "BE",
    borno: "BO",
    cross_river: "CR",
    delta: "DE",
    ebonyi: "EB",
    edo: "ED",
    ekiti: "EK",
    enugu: "EN",
    gombe: "GO",
    imo: "IM",
    jigawa: "JI",
    kaduna: "KD",
    kano: "KN",
    katsina: "KT",
    kebbi: "KE",
    kogi: "KO",
    kwara: "KW",
    lagos: "LA",
    nasarawa: "NA",
    niger: "NI",
    ogun: "OG",
    ondo: "ON",
    osun: "OS",
    oyo: "OY",
    plateau: "PL",
    rivers: "RI",
    sokoto: "SO",
    taraba: "TA",
    yobe: "YO",
    zamfara: "ZA",
    fct: "FCT",
    federal_capital_territory: "FCT",
    abuja: "FCT",
  };

  const abbrToFull: Record<string, string> = Object.entries(fullToAbbr).reduce(
    (acc, [full, abbr]) => {
      acc[abbr] = capitalizeAndSpace(full);
      return acc;
    },
    {} as Record<string, string>
  );

  if (type === "full") {
    const key = input.trim().toUpperCase();
    return abbrToFull[key] ?? input;
  } else {
    const normalized = input.trim().toLowerCase().replace(/\s+/g, "_");
    return fullToAbbr[normalized] ?? input;
  }
}

export {
  truncateString,
  hasNonNumeric,
  formatPhoneNumber,
  capitalize,
  capitalizeAndSpace,
  getUserName,
  phoneNumberToReferralId,
  normalizeMonth,
  mapNigerianState,
};
