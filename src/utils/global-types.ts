import { ReactNode } from "react";

export type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export interface ChildrenProps {
  children: ReactNode;
}

export interface RouteParams {
  propertyId: string;
}

type Visible = "visible";

export const QUERY_PARAMS_VALUES = {
  visible: "visible",
};

export interface SearchParams {
  onboardingModal: Visible;
  propertyFilterModal: Visible;
  propertyInterestId: string;
  managedPropertyId: string;
  onboardingForm: Visible;
  enrollClient: Visible;
  createProperty: Visible;
  addClient: Visible;
  resetClientPassword: Visible;
  updateClientRole: Visible;
  addAgent: Visible;
  resetAgentPassword: Visible;
  updateAgentRole: Visible;
  addOperator: Visible;
  resetOperatorPassword: Visible;
  updateOperatorRole: Visible;
  addManager: Visible;
  resetManagerPassword: Visible;
  updateManagerRole: Visible;
}

export interface IParams {
  pageParams: IPageParams;
}
export interface IPageParams {
  params: Promise<RouteParams>;
  searchParams: Promise<SearchParams>;
}

export type ApiResult<T> = true | null | T;

export interface IAvailableLandSize {
  size: number;
  price: number;
}
