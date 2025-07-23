import { HomeWrapper } from "./home.styles";
import { Properties } from "./Properties";
import { HomeContextProvider } from "./HomeContext";
import { fetchStates } from "@/lib/api/location/server.location";
import { fetchAvailabilities } from "@/lib/api/availability/server.availability";
import { fetchProperties, fetchPropertiesTotal, fetchProperty } from "@/lib/api/property/server.property";

interface Props {
  propertyId?: string;
}

async function Home({ propertyId }: Props) {
  const propertiesTotalDataResponse = fetchPropertiesTotal();
  const propertiesDataResponse = fetchProperties();
  const propertyDataResponse = propertyId ? fetchProperty(propertyId) : undefined;

  const statesDataResponse = fetchStates();
  const availabilityResponse = fetchAvailabilities();

  const [propertiesData, states, availabilityData, propertyData, totalProperties] = await Promise.all([
    propertiesDataResponse,
    statesDataResponse,
    availabilityResponse,
    propertyDataResponse,
    propertiesTotalDataResponse,
  ]);

  return (
    <HomeContextProvider>
      <HomeWrapper>
        <Properties
          propertyData={propertyData}
          states={states}
          availabilityData={availabilityData}
          propertiesData={propertiesData}
          totalProperties={totalProperties}
        />
      </HomeWrapper>
    </HomeContextProvider>
  );
}

export { Home };
