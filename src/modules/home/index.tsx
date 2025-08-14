import { HomeWrapper } from "./home.styles";
// import { Properties } from "./Properties";
import { HomeContextProvider } from "./HomeContext";
import { fetchStates } from "@/lib/api/location/server.location";
import { fetchAvailabilities } from "@/lib/api/availability/server.availability";
import {
  fetchProperties,
  fetchProperty,
} from "@/lib/api/property/server.property";
import QrScanner from "../qrCodeScanner";
import { Search } from "@/components/Inputs";

interface Props {
  propertyId?: string;
}

async function Home({ propertyId }: Props) {
  const propertiesDataResponse = fetchProperties();
  const propertyDataResponse = propertyId
    ? fetchProperty(propertyId)
    : undefined;

  const statesDataResponse = fetchStates();
  const availabilityResponse = fetchAvailabilities();

  const [propertiesData, states, availabilityData, propertyData] =
    await Promise.all([
      propertiesDataResponse,
      statesDataResponse,
      availabilityResponse,
      propertyDataResponse,
    ]);

  return (
    <HomeContextProvider>
      <HomeWrapper>
        <Search placeholder="Search by User ID" />
        <QrScanner />
      </HomeWrapper>
    </HomeContextProvider>
  );
}

export { Home };
