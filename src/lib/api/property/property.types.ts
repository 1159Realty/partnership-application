import { FileType } from "../file-upload/file-upload.types";
import { ILga, IState, ISummarizedArea } from "../location/location.types";

const PROPERTY_LAND_TYPE = ["INDUSTRIAL", "COMMERCIAL", "RESIDENTIAL", "FARMLAND", "MIXED"] as const;
type PropertyLandType = (typeof PROPERTY_LAND_TYPE)[number];

const PROPERTY_CATEGORY = ["LAND", "HOSTEL"] as const;
type PropertyCategory = (typeof PROPERTY_CATEGORY)[number];

export interface IAvailableLandSize {
  size: number;
  price: number;
  marketValue?: number;
}
export interface IPaymentDuration {
  duration: number;
  interest: number;
}

type PropertyPayload = {
  category: PropertyCategory;
  propertyName: string;
  propertyPic: string;
  stateId: string;
  lgaId: string;
  areaId: string;
  totalLandSize: number;
  availableLandSizes: IAvailableLandSize[];
  price?: number;
  paymentDurationOptions: IPaymentDuration[];
  status?: PropertyStatus;
  overDueInterest: number;
  installmentPeriod: number;
  videoUrl?: string;
  landType: string;
  address: string;
  residentialAddress: string,
  country: string,
};

type PropertyFormPayload = {
  category: PropertyCategory;
  propertyName: string;
  propertyPic: FileType | "";
  stateId: string;
  lgaId: string;
  areaId: string;
  totalLandSize: number | "";
  overDueInterest: number | "";
  installmentPeriod: number | "";
  availableLandSizes: IAvailableLandSize[];
  price?: number | "";
  paymentDurationOptions: IPaymentDuration[];
  videoUrl?: string;
  landType: string;
  address: string;
  residentialAddress: string,
  country: string,
};

type UpdatePropertyFormPayload = {
  id: string;
  propertyName: string;
  propertyPic: FileType | string;
  totalLandSize: number | "";
  videoUrl?: string;
  status: string;
};

type IProperty = {
  category: PropertyCategory;
  id: string;
  propertyName: string;
  propertyPic: string;
  state: IState;
  lga: ILga;
  area: ISummarizedArea;
  totalLandSize: number;
  remainingLandSize: number;
  availableLandSizes: IAvailableLandSize[];
  paymentDurationOptions: IPaymentDuration[];
  outrightPayment: boolean;
  status: PropertyStatus;
  overDueInterest: number;
  createdAt: string;
  updatedAt: string;
  address: string;
  videoUrl: string;
  landType: PropertyLandType;
  isMigrated: boolean;
};

interface FetchPropertiesArgs {
  propertyName?: string;
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  status?: string;
  includeDisabled?: boolean;
  page?: number;
  limit?: number;
}

interface FetchPropertiesTotalArgs {
  propertyName?: string;
  stateId?: string;
  lgaId?: string;
  areaId?: string;
  status?: PropertyStatus;
  includeDisabled?: boolean;
  page?: number;
  limit?: number;
}

interface PropertyMarketPrice {
  marketValue: number;
  size: number;
}

interface PropertyTotal {
  count: number;
}

type PropertyStatus = "AVAILABLE" | "SOLD_OUT" | "RESERVED" | "DISABLED" | "ARCHIVED";

export type {
  IProperty,
  PropertyPayload,
  PropertyFormPayload,
  FetchPropertiesArgs,
  PropertyStatus,
  UpdatePropertyFormPayload,
  PropertyMarketPrice,
  PropertyLandType,
  PropertyTotal,
  FetchPropertiesTotalArgs,
  PropertyCategory,
};

export { PROPERTY_LAND_TYPE, PROPERTY_CATEGORY };
