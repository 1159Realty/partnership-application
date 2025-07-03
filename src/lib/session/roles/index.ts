import {
  agentPanelItems,
  clientPanelItems,
  managerPanelItems,
  cstPanelItems,
  salesPanelItems,
  operationsPanelItems,
  hrPanelItems,
  accountingPanelItems,
  accountingManagerPanelItems,
  mediaManagerPanelItems,
  cstManagerPanelItems,
} from "@/utils/constants";

export const CLIENT_ROLES = [
  // interest
  "view:interest",
  "create:interest",
  "update:interest",
  "delete:interest",

  // appointment
  "view:appointment",
  "create:appointment",
  "update:appointment",
  "delete:appointment",

  // enrollment
  "view:enrollment",
  "request-cancel:enrollment",

  // invoice
  "view:invoice",
  "download:invoice",

  //partnership
  "create:partnership",
] as const;

export const AGENT_ROLES = [
  // interest
  "view:interest",
  "create:interest",
  "update:interest",
  "delete:interest",

  // appointment
  "view:appointment",
  "create:appointment",
  "update:appointment",
  "delete:appointment",

  // enrollment
  "view:enrollment",
  "create:enrollment",
  "request-cancel:enrollment",

  // invoice
  "view:invoice",
  "download:invoice",
  "view-commission:invoice",

  // client
  "view:client",
] as const;
export type AgentPermission = (typeof AGENT_ROLES)[number];

export const CST_ROLES = [
  // interest
  "view:interest",
  "update:interest",
  "delete:interest",

  // appointment
  "view:appointment",
  "create:enrollment",
  "update:appointment",
  "delete:appointment",

  // enrollment
  "view:enrollment",
  "update-plot-id:enrollment",

  // invoice
  "view:invoice",
] as const;
export type CstPermission = (typeof CST_ROLES)[number];

export const CST_MANAGER_ROLES = [
  // interest
  "view:interest",
  "update:interest",
  "delete:interest",

  // appointment
  "view:appointment",
  "update:appointment",
  "delete:appointment",

  // enrollment
  "view:enrollment",
  "create:enrollment",
  "update:enrollment",
  "update-plot-id:enrollment",
  "delete:enrollment",
  "cancel:enrollment",
  "resume:enrollment",

  // invoice
  "view:invoice",
] as const;
export type CstMangerPermission = (typeof CST_MANAGER_ROLES)[number];

export const HR_ROLES = [
  // client
  "view:client",
  "create:client",
  "update:client",
  "delete:client",

  // agent
  "view:agent",
  "create:agent",
  "update:agent",
  "delete:agent",

  // cst
  "view:cst",
  "create:cst",
  "update:cst",
  "delete:cst",

  // cst-manager
  "view:cst-manager",
  "create:cst-manager",
  "update:cst-manager",
  "delete:cst-manager",

  // sales
  "view:sales",
  "create:sales",
  "update:sales",
  "delete:sales",

  // sales-manager
  "view:sales-manager",
  "create:sales-manager",
  "update:sales-manager",
  "delete:sales-manager",

  // operations
  "view:operations",
  "create:operations",
  "update:operations",
  "delete:operations",

  // operations-manager
  "view:operations-manager",
  "create:operations-manager",
  "update:operations-manager",
  "delete:operations-manager",

  // accounting
  "view:accounting",
  "create:accounting",
  "update:accounting",
  "delete:accounting",

  // accounting-manager
  "view:accounting-manager",
  "create:accounting-manager",
  "update:accounting-manager",
  "delete:accounting-manager",

  // media-manager
  "view:media-manager",
  "create:media-manager",
  "update:media-manager",
  "delete:media-manager",

  // media
  "view:media",
  "create:media",
  "update:media",
  "delete:media",
] as const;
export type HrMangerPermission = (typeof HR_ROLES)[number];

// export const HR_MANAGER_ROLES = [
//   // client
//   "view:client",
//   "create:client",
//   "update:client",
//   "delete:client",

//   // agent
//   "view:agent",
//   "create:agent",
//   "update:agent",
//   "delete:agent",

//   // cst
//   "view:cst",
//   "create:cst",
//   "update:cst",
//   "delete:cst",

//   // cst-manager
//   "view:cst-manager",
//   "create:cst-manager",
//   "update:cst-manager",
//   "delete:cst-manager",

//   // sales
//   "view:sales",
//   "create:sales",
//   "update:sales",
//   "delete:sales",

//   // sales-manager
//   "view:sales-manager",
//   "create:sales-manager",
//   "update:sales-manager",
//   "delete:sales-manager",

//   // operations
//   "view:operations",
//   "create:operations",
//   "update:operations",
//   "delete:operations",

//   // operations-manager
//   "view:operations-manager",
//   "create:operations-manager",
//   "update:operations-manager",
//   "delete:operations-manager",

//   // accounting
//   "view:accounting",
//   "create:accounting",
//   "update:accounting",
//   "delete:accounting",

//   // accounting-manager
//   "view:accounting-manager",
//   "create:accounting-manager",
//   "update:accounting-manager",
//   "delete:accounting-manager",

//   // hr
//   "view:hr",
//   "create:hr",
//   "update:hr",
//   "delete:hr",
// ] as const;
// export type HrMangerPermission = (typeof HR_MANAGER_ROLES)[number];

export const SALES_ROLES = [] as const;
export type SalesPermission = (typeof SALES_ROLES)[number];

export const SALES_MANAGER_ROLES = [] as const;
export type SalesMangerPermission = (typeof SALES_MANAGER_ROLES)[number];

export const OPERATIONS_ROLES = [] as const;
export type OperationsPermission = (typeof OPERATIONS_ROLES)[number];

export const OPERATIONS_MANAGER_ROLES = [] as const;
export type OperationsMangerPermission = (typeof OPERATIONS_MANAGER_ROLES)[number];

export const ACCOUNTING_ROLES = [
  "view:interest",
  "update:interest",
  "delete:interest",

  // appointment
  "view:appointment",
  "update:appointment",
  "delete:appointment",

  // enrollment
  "view:enrollment",
  "create:enrollment",
  "update:enrollment",
  "update-plot-id:enrollment",
  "delete:enrollment",

  // invoice
  "view:invoice",
] as const;
export type AccountingPermission = (typeof ACCOUNTING_ROLES)[number];

export const ACCOUNTING_MANAGER_ROLES = [
  // interest
  "view:interest",
  "update:interest",
  "delete:interest",

  // appointment
  "view:appointment",
  "update:appointment",
  "delete:appointment",

  // enrollment
  "view:enrollment",
  "create:enrollment",
  "update:enrollment",
  "update-plot-id:enrollment",
  "delete:enrollment",
  "cancel:enrollment",
  "resume:enrollment",

  // invoice
  "view:invoice",
  "update:invoice",
  "resolve:invoice",
] as const;
export type AccountingManagerPermission = (typeof ACCOUNTING_MANAGER_ROLES)[number];

export const MEDIA_MANAGER_ROLES = [] as const;
export type MediaManagerPermission = (typeof MEDIA_MANAGER_ROLES)[number];

export const MANAGER_ROLES = [
  // interest
  "view:interest",
  "update:interest",
  "delete:interest",

  // appointment
  "view:appointment",
  "update:appointment",
  "delete:appointment",

  // enrollment
  "view:enrollment",
  "create:enrollment",
  "update:enrollment",
  "update-plot-id:enrollment",
  "delete:enrollment",
  "cancel:enrollment",
  "resume:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",
  "resolve:invoice",

  // release
  "view:release",
  "create:release",
  "update:release",
  "delete:release",

  // client
  "view:client",
  "create:client",
  "update:client",
  "delete:client",

  // agent
  "view:agent",
  "create:agent",
  "update:agent",
  "delete:agent",

  // cst
  "view:cst",
  "create:cst",
  "update:cst",
  "delete:cst",

  // cst-manager
  "view:cst-manager",
  "create:cst-manager",
  "update:cst-manager",
  "delete:cst-manager",

  // sales
  "view:sales",
  "create:sales",
  "update:sales",
  "delete:sales",

  // sales-manager
  "view:sales-manager",
  "create:sales-manager",
  "update:sales-manager",
  "delete:sales-manager",

  // operations
  "view:operations",
  "create:operations",
  "update:operations",
  "delete:operations",

  // operations-manager
  "view:operations-manager",
  "create:operations-manager",
  "update:operations-manager",
  "delete:operations-manager",

  // accounting
  "view:accounting",
  "create:accounting",
  "update:accounting",
  "delete:accounting",

  // accounting-manager
  "view:accounting-manager",
  "create:accounting-manager",
  "update:accounting-manager",
  "delete:accounting-manager",

  // media-manager
  "view:media-manager",
  "create:media-manager",
  "update:media-manager",
  "delete:media-manager",

  // media
  "view:media",
  "create:media",
  "update:media",
  "delete:media",

  // hr
  "view:hr",
  "create:hr",
  "update:hr",
  "delete:hr",

  // hr-manager
  "view:hr-manager",
  "create:hr-manager",
  "update:hr-manager",
  "delete:hr-manager",
] as const;
export type ManagerPermission = (typeof MANAGER_ROLES)[number];

export const ADMIN_ROLES = [
  // interest
  "view:interest",
  "update:interest",
  "delete:interest",

  // appointment
  "view:appointment",
  "update:appointment",
  "delete:appointment",

  // enrollment
  "view:enrollment",
  "create:enrollment",
  "update:enrollment",
  "update-plot-id:enrollment",
  "delete:enrollment",
  "cancel:enrollment",
  "resume:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",
  "resolve:invoice",

  // release
  "view:release",
  "create:release",
  "update:release",
  "delete:release",

  // client
  "view:client",
  "create:client",
  "update:client",
  "delete:client",

  // agent
  "view:agent",
  "create:agent",
  "update:agent",
  "delete:agent",

  // cst
  "view:cst",
  "create:cst",
  "update:cst",
  "delete:cst",

  // cst-manager
  "view:cst-manager",
  "create:cst-manager",
  "update:cst-manager",
  "delete:cst-manager",

  // sales
  "view:sales",
  "create:sales",
  "update:sales",
  "delete:sales",

  // sales-manager
  "view:sales-manager",
  "create:sales-manager",
  "update:sales-manager",
  "delete:sales-manager",

  // operations
  "view:operations",
  "create:operations",
  "update:operations",
  "delete:operations",

  // operations-manager
  "view:operations-manager",
  "create:operations-manager",
  "update:operations-manager",
  "delete:operations-manager",

  // accounting
  "view:accounting",
  "create:accounting",
  "update:accounting",
  "delete:accounting",

  // accounting-manager
  "view:accounting-manager",
  "create:accounting-manager",
  "update:accounting-manager",
  "delete:accounting-manager",

  // media-manager
  "view:media-manager",
  "create:media-manager",
  "update:media-manager",
  "delete:media-manager",

  // media
  "view:media",
  "create:media",
  "update:media",
  "delete:media",

  // hr
  "view:hr",
  "create:hr",
  "update:hr",
  "delete:hr",

  // hr-manager
  "view:hr-manager",
  "create:hr-manager",
  "update:hr-manager",
  "delete:hr-manager",

  // manager
  "view:manager",
  "create:manager",
  "update:manager",
  "delete:manager",
] as const;
export type AdminPermission = (typeof ADMIN_ROLES)[number];

export const ROLES = {
  client: CLIENT_ROLES,

  agent: AGENT_ROLES,

  cst: CST_ROLES,
  "cst-manager": CST_MANAGER_ROLES,

  hr: HR_ROLES,

  "sales-manager": SALES_MANAGER_ROLES,

  operations: OPERATIONS_ROLES,

  accounting: ACCOUNTING_ROLES,
  "accounting-manager": ACCOUNTING_MANAGER_ROLES,

  // media: ACCOUNTING_ROLES,
  "media-manager": MEDIA_MANAGER_ROLES,

  manager: MANAGER_ROLES,

  admin: ADMIN_ROLES,

  // "operations-manager": OPERATIONS_MANAGER_ROLES,
  // "hr-manager": HR_MANAGER_ROLES,
  // sales: SALES_ROLES,
};

export type Role = keyof typeof ROLES;
export type Permission = (typeof ROLES)[Role][number];

export const hasPermission = (roleId: string | undefined | null, permission: Permission): boolean => {
  if (!roleId) return false;
  const role = getRole(roleId);

  return (ROLES[role] as readonly Permission[]).includes(permission);
};

export const getRoleRoutes = (role: Role) => {
  switch (role) {
    case "admin":
      return managerPanelItems;
    case "manager":
      return managerPanelItems;
    // case "operations-manager":
    case "operations":
      return operationsPanelItems;
    // case "hr-manager":
    case "hr":
      return hrPanelItems;
    case "cst-manager":
      return cstManagerPanelItems;
    case "cst":
      return cstPanelItems;
    case "sales-manager":
      // case "sales":
      return salesPanelItems;
    case "accounting-manager":
      return accountingManagerPanelItems;
    case "accounting":
      return accountingPanelItems;
    case "agent":
      return agentPanelItems;
    case "media-manager":
      return mediaManagerPanelItems;
    default:
      return clientPanelItems;
  }
};

export const USER_ROLES = [
  // admin
  "admin",
  // manager
  "manager",
  // "operations",
  "operations-manager",
  // hr
  "hr",
  // "hr-manager",

  // accounting
  "accounting",
  "accounting-manager",

  // "sales",
  "sales-manager",

  // media
  "media-manager",

  // cst
  "cst",
  "cst-manager",
  // agent
  "agent",
  // client
  "client",
];

function getRole(roleId: string | null | undefined): Role {
  if (!roleId) return "client";
  return roleId as Role;
}

function getCreateRoles(userRole: string | null | undefined) {
  return (
    USER_ROLES.filter((role) => role !== "admin" && role !== "agent") // Exclude admin
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((role) => hasPermission(userRole, `create:${role}` as any)) // Check "create" permission
  );
}

function getHasRoleUpdatePermission(userRole: string | null | undefined, assigneeRole: string | null | undefined) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    hasPermission(userRole, `update:${assigneeRole}` as any)
  );
}

function getIsModerator(roleId: string | null | undefined): boolean {
  if (!roleId) return false;

  const role = getRole(roleId);

  return !(role === "agent" || role === "client");
}

export { getRole, getCreateRoles, getHasRoleUpdatePermission, getIsModerator };
