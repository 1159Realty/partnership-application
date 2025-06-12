import { IAvailableLandSize } from "@/utils/global-types";
import { FileType } from "../file-upload/file-upload.types";
import { ILga, IState, ISummarizedArea } from "../location/location.types";

type PropertyPayload = {
  propertyName: string;
  propertyPic: string;
  stateId: string;
  lgaId: string;
  areaId: string;
  address: string;
  totalLandSize: number;
  availableLandSizes: IAvailableLandSize[];
  paymentDurationOptions: number[];
  status?: PropertyStatus;
  installmentInterest: number;
  overDueInterest: number;
  installmentPeriod: number;
};

type PropertyFormPayload = {
  propertyName: string;
  propertyPic: FileType | "";
  stateId: string;
  lgaId: string;
  areaId: string;
  address?: string;
  totalLandSize: number | "";
  installmentInterest: number | "";
  overDueInterest: number | "";
  installmentPeriod: number | "";
  availableLandSizes: IAvailableLandSize[];
  paymentDurationOptions: number[];
};

type UpdatePropertyFormPayload = {
  id: string;
  propertyName: string;
  propertyPic: FileType | string;
  totalLandSize: number | "";
  status: string;
};

type IProperty = {
  id: string;
  propertyName: string;
  propertyPic: string;
  state: IState;
  lga: ILga;
  area: ISummarizedArea;
  address: string;
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
  marketPrice: number;
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
};
