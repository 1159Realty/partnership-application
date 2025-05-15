interface IState {
  id: string;
  state: string;
}

interface ILga {
  id: string;
  lga: string;
  stateId: string;
}

interface IArea {
  id: string;
  area: string;
  lga: ILga;
  state: IState;
}
interface ISummarizedArea {
  id: string;
  area: string;
  lga: ILga;
  state: IState;
}

interface AreaPayload {
  area: string;
  lgaId: string;
  stateId: string;
}
interface FetchAllAreasArgs {
  page?: number;
  limit?: number;
  keyword?: string;
  stateId?: string;
  lgaId?: string;
}

interface IStateReport {
  state: string;
  clientsTotal: number;
}

interface CountriesReport {
  nigeria: number;
  others: number;
}

export type { IState, ILga, IArea, AreaPayload, FetchAllAreasArgs, ISummarizedArea, IStateReport, CountriesReport };
