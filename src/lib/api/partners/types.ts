import { User } from "../user/user.types";

const partnersArr = ["APPROVED", "PENDING", "REJECTED"] as const;
type PartnerStatus = (typeof partnersArr)[number];

interface IPartner {
  id: string;
  status: PartnerStatus;
  client: User;
}

interface FetchPartnersArgs {
  page?: number;
  limit?: number;
  status?: PartnerStatus;
  keyword?: string; // Search by name or email
}

export type { IPartner, PartnerStatus, FetchPartnersArgs };
export { partnersArr };
