import { IProperty } from "../property/property.types";
import { User } from "../user/user.types";

interface IInterest {
  id: string;
  property: IProperty;
  createdBy: User;
  contactedBy: User;
  createdAt: string;
  updatedAt: string;
}

interface FetchInterestsArgs {
  page?: number;
  limit?: number;
  keyword?: string;
  propertyId?: string;
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  userId?: string;
}

interface InterestPayload {
  propertyId: string;
}

export type { IInterest, FetchInterestsArgs, InterestPayload };
