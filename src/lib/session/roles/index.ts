import { User } from "@/lib/api/user/user.types";
import { agentPanelItems, clientPanelItems, managerPanelItems, operatorPanelItems } from "@/utils/constants";

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

export const OPERATOR_ROLES = [
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

  //partnership
  "view:partnership",
  "update:partnership",
  "delete:partnership",

  // invoice
  "view:invoice",

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

  // operator
  "view:operator",
  "create:operator",
] as const;
export type OperatorPermission = (typeof OPERATOR_ROLES)[number];

export const HOD_MEDIA_ROLES = [
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
  "delete:enrollment",
  "cancel:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",

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

  // operator
  "view:operator",
  "create:operator",
  "update:operator",
  "delete:operator",

  // manager
  "view:manager",
  "create:manager",
] as const;
export type HodMediaPermission = (typeof HOD_MEDIA_ROLES)[number];

export const HOD_SALES_ROLES = [
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
  "delete:enrollment",
  "cancel:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",

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

  // operator
  "view:operator",
  "create:operator",
  "update:operator",
  "delete:operator",

  // manager
  "view:manager",
  "create:manager",
] as const;
export type HodSalesPermission = (typeof HOD_SALES_ROLES)[number];

export const HOD_ACCOUNT_ROLES = [
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
  "delete:enrollment",
  "cancel:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",

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

  // operator
  "view:operator",
  "create:operator",
  "update:operator",
  "delete:operator",

  // manager
  "view:manager",
  "create:manager",
] as const;
export type HodAccountPermission = (typeof HOD_MEDIA_ROLES)[number];

export const HOD_OPERATIONS_ROLES = [
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
  "delete:enrollment",
  "cancel:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",

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

  // operator
  "view:operator",
  "create:operator",
  "update:operator",
  "delete:operator",

  // manager
  "view:manager",
  "create:manager",
] as const;
export type HodOperationsPermission = (typeof HOD_OPERATIONS_ROLES)[number];

export const HOD_LEGAL_ROLES = [
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
  "delete:enrollment",
  "cancel:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",

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

  // operator
  "view:operator",
  "create:operator",
  "update:operator",
  "delete:operator",

  // manager
  "view:manager",
  "create:manager",
] as const;
export type HodLegalPermission = (typeof HOD_LEGAL_ROLES)[number];

export const HOD_HR_ROLES = [
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
  "delete:enrollment",
  "cancel:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",

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

  // operator
  "view:operator",
  "create:operator",
  "update:operator",
  "delete:operator",

  // manager
  "view:manager",
  "create:manager",
] as const;
export type HodHrPermission = (typeof HOD_HR_ROLES)[number];

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
  "delete:enrollment",
  "cancel:enrollment",
  "resume:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",

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

  // operator
  "view:operator",
  "create:operator",
  "update:operator",
  "delete:operator",

  // manager
  "view:manager",
  "create:manager",
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
  "delete:enrollment",
  "cancel:enrollment",
  "resume:enrollment",

  // invoice
  "view:invoice",
  "create:invoice",
  "update:invoice",
  "delete:invoice",

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

  // operator
  "view:operator",
  "create:operator",
  "update:operator",
  "delete:operator",

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
  operator: OPERATOR_ROLES,
  manager: MANAGER_ROLES,
  admin: ADMIN_ROLES,
  hodMedia: HOD_MEDIA_ROLES,
  hodSales: HOD_HR_ROLES,
  hodAccount: HOD_ACCOUNT_ROLES,
  hodOperations: HOD_OPERATIONS_ROLES,
  hodLegal: HOD_LEGAL_ROLES,
  hodHr: HOD_HR_ROLES,
};

export type Role = keyof typeof ROLES;
export type Permission = (typeof ROLES)[Role][number];

export const hasPermission = (roleId: string | undefined, permission: Permission): boolean => {
  if (!roleId) return false;
  const role = ROLE_PAIR[roleId];

  return (ROLES[role] as readonly Permission[]).includes(permission);
};

export const getRoleRoutes = (role: Role) => {
  switch (role) {
    case "admin":
      return managerPanelItems;
    case "manager":
      return managerPanelItems;
    case "operator":
      return operatorPanelItems;
    case "agent":
      return agentPanelItems;
    default:
      return clientPanelItems;
  }
};

export const PERMISSION_ASSIGNMENTS = {
  operator: {
    create: [
      {
        label: "Client",
        id: "client",
      },
      {
        label: "Agent",
        id: "agent",
      },
      {
        label: "Operator",
        id: "operator",
      },
    ],
    update: [
      {
        label: "Client",
        id: "client",
      },
      {
        label: "Agent",
        id: "agent",
      },
    ],
  },
  manager: {
    create: [
      {
        label: "Client",
        id: "client",
      },
      {
        label: "Agent",
        id: "agent",
      },
      {
        label: "Operator",
        id: "operator",
      },
      {
        label: "Manger",
        id: "manager",
      },
    ],
    update: [
      {
        label: "Client",
        id: "client",
      },
      {
        label: "Agent",
        id: "agent",
      },
      {
        label: "Operator",
        id: "operator",
      },
    ],
  },
  admin: {
    create: [
      {
        label: "Client",
        id: "client",
      },
      {
        label: "Agent",
        id: "agent",
      },
      {
        label: "Operator",
        id: "operator",
      },
      {
        label: "Manger",
        id: "manager",
      },
    ],
    update: [
      {
        label: "Client",
        id: "client",
      },
      {
        label: "Agent",
        id: "agent",
      },
      {
        label: "Operator",
        id: "operator",
      },
      {
        label: "Manger",
        id: "manager",
      },
    ],
  },
};

export const ROLE_PAIR: { [key: string]: Role } = {
  "a7b3c9d2e1-admin": "admin",
  "x2y8z4q5w6-manager": "manager",
  "m5n1p6r9t4-operator": "operator",
  "k3l8j2h7v0-agent": "agent",
  "s4f6g8h2j1-client": "client",
  "g6b3q7u9j4-hod-media": "hodMedia",
  "a3b7c2d9e1-hod-sales": "hodSales",
  "x5y9z1w4v8-hod-account": "hodAccount",
  "m2n8p4q6r3-hod-operations": "hodOperations",
  "s1t7u3v5w9-hod-legal": "hodLegal",
  "k4j8h2l6g1-hod-hr": "hodHr",
};

function getRoleId(value: Role): string | undefined {
  return Object.keys(ROLE_PAIR).find((key) => ROLE_PAIR[key] === value);
}

function getRole(roleId: string | null | undefined) {
  if (!roleId) return "N/A";
  return ROLE_PAIR[roleId];
}

// function getRoles() {
//   return Object.entries(ROLE_PAIR)
//     .filter(([, role]) => role !== "admin")
//     .map(([key, role]) => ({ [role]: key }));
// }

function getRoles(user: User | null) {
  return (
    Object.entries(ROLE_PAIR)
      .filter(([, role]) => role !== "admin" && role !== "agent") // Exclude admin
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter(([, role]) => hasPermission(user?.roleId, `create:${role}` as any)) // Check "create" permission
      .map(([key, role]) => ({ [role]: key }))
  );
}

function getIsModerator(roleId: string | null | undefined): boolean {
  if (!roleId) return false;

  const role = getRole(roleId);

  return !(role === "agent" || role === "client");
}

export { getRole, getRoles, getIsModerator, getRoleId };
