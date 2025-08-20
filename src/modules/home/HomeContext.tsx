// "use client";

// import { SetState } from "@/utils/global-types";
// import { createContext, useContext, useState } from "react";

// export interface Props {
//   children?: React.ReactNode;
// }

// export interface IPropertyFilter {
//   stateId?: string;
//   lgaId?: string;
//   areaId?: string;
// }

// interface IContext {
//   query: string;
//   setQuery: SetState<string>;
//   filters: IPropertyFilter;
//   setFilters: SetState<IPropertyFilter>;
//   // enrollPropertyId: string | null;
//   setEnrollPropertyId: SetState<string | null>;
//   // schedulePropertyId: string | null;
//   setSchedulePropertyId: SetState<string | null>;
// }

// export const Context = createContext<IContext>({} as IContext);

// export const useHomeContext = () => {
//   return useContext(Context);
// };

// // export const HomeContextProvider = ({ children }: Props) => {
// //   const [enrollPropertyId, setEnrollPropertyId] = useState<string | null>(null);
// //   const [schedulePropertyId, setSchedulePropertyId] = useState<string | null>(
// //     null
// //   );
//   const [query, setQuery] = useState("");
//   const [filters, setFilters] = useState<IPropertyFilter>({});

//   const value = {
//     query,
//     setQuery,
//     filters,
//     setFilters,
//     // enrollPropertyId,
//     setEnrollPropertyId,
//     // schedulePropertyId,
//     setSchedulePropertyId,
//   };

//   return <Context.Provider value={value}>{children} </Context.Provider>;
// };
