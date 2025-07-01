import { PropertyManagementWrapper } from "./propertyManagement.styles";
import { fetchStates } from "@/lib/api/location/server.location";
import { Properties } from "./Properties";
import { PropertyManagementContextProvider } from "./PropertyManagementContext";
import { fetchProperties } from "@/lib/api/property/server.property";

async function PropertyManagement() {
  const propertiesDataResponse = fetchProperties({ includeDisabled: true });
  const statesDataResponse = fetchStates();
  const [propertiesData, states] = await Promise.all([propertiesDataResponse, statesDataResponse]);

  return (
    <PropertyManagementContextProvider>
      <PropertyManagementWrapper>
        <Properties propertiesData={propertiesData} states={states} />
      </PropertyManagementWrapper>
    </PropertyManagementContextProvider>
  );
}

export { PropertyManagement };
