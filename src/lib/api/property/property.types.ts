import { IAvailableLandSize } from "@/utils/global-types";
import { FileType } from "../file-upload/file-upload.types";
import { ILga, IState, ISummarizedArea } from "../location/location.types";

const PROPERTY_LAND_TYPE = ["INDUSTRIAL", "COMMERCIAL", "RESIDENTIAL", "FARMLAND", "MIXED"] as const;

type PropertyLandType = (typeof PROPERTY_LAND_TYPE)[number];

type PropertyPayload = {
  propertyName: string;
  propertyPic: string;
  stateId: string;
  lgaId: string;
  areaId: string;
  totalLandSize: number;
  availableLandSizes: IAvailableLandSize[];
  paymentDurationOptions: number[];
  status?: PropertyStatus;
  installmentInterest: number;
  overDueInterest: number;
  installmentPeriod: number;
  youtubeUrl?: string;
  landType: string;
  address: string;
};

type PropertyFormPayload = {
  propertyName: string;
  propertyPic: FileType | "";
  stateId: string;
  lgaId: string;
  areaId: string;
  totalLandSize: number | "";
  installmentInterest: number | "";
  overDueInterest: number | "";
  installmentPeriod: number | "";
  availableLandSizes: IAvailableLandSize[];
  paymentDurationOptions: number[];
  youtubeUrl?: string;
  landType: string;
  address: string;
};

type UpdatePropertyFormPayload = {
  id: string;
  propertyName: string;
  propertyPic: FileType | string;
  totalLandSize: number | "";
  youtubeUrl?: string;
  status: string;
};

type IProperty = {
  id: string;
  propertyName: string;
  propertyPic: string;
  state: IState;
  lga: ILga;
  area: ISummarizedArea;
  totalLandSize: number;
  remainingLandSize: number;
  availableLandSizes: IAvailableLandSize[];
  paymentDurationOptions: number[];
  outrightPayment: boolean;
  status: PropertyStatus;
  installmentInterest: number;
  overDueInterest: number;
  createdAt: string;
  updatedAt: string;
  address: string;
  youtubeUrl: string;
  landType: PropertyLandType;
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

interface PropertyMarketPrice {
  marketValue: number;
  size: number;
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
};

export { PROPERTY_LAND_TYPE };
