import { Icon } from "@phosphor-icons/react";
import {
  Calendar,
  CurrencyNgn,
  FileText,
  Headset,
  MapPinLine,
  Receipt,
  SquaresFour,
  UserSwitch,
  UsersThree,
  Warehouse,
  Megaphone,
  CreditCard,
  Handshake,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

type Month = (typeof months)[number];

const SESSION = "session";

// ROUTES
const BASE_URL = process.env.BACKEND_URL || "";
const WEB_APP_URL = process.env.FRONTEND_URL || "";
// const WEB_APP_URL = "http://localhost:3000";
// const BASE_URL = "https://dev-api.1159realty.com/api/v1";
// const BASE_URL = "http://138.68.140.175:3000/api/v1";

// Routes
const PROTECTED_ROUTES = [
  // "/clients",
  "/profile",
  "/property-management",
  "/properties",
  "/invoices",
  "/support",
  "/support-management",
  "/appointments",
  "/appointment-management",
  "/documents",
  "/locations",
  "/teams",
  "/enrollments",
  "/commissions",
  "/release",
  "/campaign",
  "/analytics",
  "/partners",
  "/notifications",
] as const;

const UNPROTECTED_ROUTES = ["/sign-in", "/sign-up", "/forgot-password"] as const;

const FOOTER_ROUTES = ["/privacy", "/terms", "/eula"] as const;

const ROUTES_ARRAY = [...PROTECTED_ROUTES, ...UNPROTECTED_ROUTES, ...FOOTER_ROUTES, "/"] as const;

type RouteKey = (typeof ROUTES_ARRAY)[number];

const ROUTES: Record<RouteKey, string> = Object.fromEntries(ROUTES_ARRAY.map((item) => [item, item])) as Record<RouteKey, string>;

const NO_LAYOUT_ROUTES = [ROUTES["/sign-in"], ROUTES["/sign-up"], ROUTES["/eula"], ROUTES["/privacy"], ROUTES["/terms"]];

// Nav Menu

interface INeutralLink {
  label: string;
  route: string;
}

const NeutralLinks: INeutralLink[] = [
  { label: "Privacy policy", route: ROUTES["/privacy"] },
  { label: "Terms of service", route: ROUTES["/terms"] },
];

interface IPanelItem {
  Icon: Icon;
  label: string;
  route: string;
}

const clientPanelItems: IPanelItem[] = [
  { Icon: SquaresFour, label: "Home", route: ROUTES["/"] },
  { Icon: Warehouse, label: "My Properties", route: ROUTES["/properties"] },
  { Icon: Receipt, label: "Invoices", route: ROUTES["/invoices"] },
  { Icon: Calendar, label: "Appointments", route: ROUTES["/appointments"] },
  { Icon: FileText, label: "Documents", route: ROUTES["/documents"] },
  { Icon: Headset, label: "Support", route: ROUTES["/support"] },
];

const agentPanelItems: IPanelItem[] = [
  { Icon: SquaresFour, label: "Home", route: ROUTES["/"] },
  { Icon: UserSwitch, label: "Enrollments", route: ROUTES["/enrollments"] },
  { Icon: Warehouse, label: "My Properties", route: ROUTES["/properties"] },
  { Icon: Receipt, label: "Invoices", route: ROUTES["/invoices"] },
  { Icon: CurrencyNgn, label: "Commissions", route: ROUTES["/commissions"] },
  { Icon: Calendar, label: "Appointments", route: ROUTES["/appointments"] },
  { Icon: FileText, label: "Documents", route: ROUTES["/documents"] },
  { Icon: Headset, label: "Support", route: ROUTES["/support"] },
];

const operatorPanelItems: IPanelItem[] = [
  { Icon: SquaresFour, label: "Home", route: ROUTES["/"] },
  { Icon: UserSwitch, label: "Enrollments", route: ROUTES["/enrollments"] },
  { Icon: Receipt, label: "Invoices", route: ROUTES["/invoices"] },
  { Icon: Warehouse, label: "Properties", route: ROUTES["/property-management"] },
  { Icon: Calendar, label: "Appointments", route: ROUTES["/appointment-management"] },
  { Icon: MapPinLine, label: "Locations", route: ROUTES["/locations"] },
  { Icon: FileText, label: "Documents", route: ROUTES["/documents"] },
  { Icon: Headset, label: "Support", route: ROUTES["/support-management"] },
  { Icon: Megaphone, label: "Campaign", route: ROUTES["/campaign"] },
  { Icon: Handshake, label: "Partners", route: ROUTES["/partners"] },
  { Icon: UsersThree, label: "Team", route: ROUTES["/teams"] },
];

const managerPanelItems: IPanelItem[] = [
  ...operatorPanelItems,
  { Icon: CreditCard, label: "Release", route: ROUTES["/release"] },
  { Icon: ChartLineUp, label: "Analytics", route: ROUTES["/analytics"] },
];

const WEEKDAYS = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"] as const;
type Weekday = (typeof WEEKDAYS)[number];

export {
  SESSION,
  NO_LAYOUT_ROUTES,
  PROTECTED_ROUTES,
  UNPROTECTED_ROUTES,
  ROUTES,
  BASE_URL,
  clientPanelItems,
  agentPanelItems,
  operatorPanelItems,
  managerPanelItems,
  NeutralLinks,
  WEEKDAYS,
  WEB_APP_URL,
  months,
};

export type { IPanelItem, Weekday, Month };
