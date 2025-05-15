import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchAreas, fetchStates } from "@/lib/api/location/server.location";

async function Locations() {
  const areasDataResponse = fetchAreas();
  const statesDataResponse = fetchStates();

  const [areasData, statesData] = await Promise.all([areasDataResponse, statesDataResponse]);

  return (
    <ModulePageWrapper>
      <Main areasData={areasData} states={statesData} />
    </ModulePageWrapper>
  );
}

export { Locations };
