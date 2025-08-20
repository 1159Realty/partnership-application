import { HomeWrapper } from "./home.styles";
import QrScanner from "../qrCodeScanner";

async function Home() {
  // const propertiesDataResponse = fetchProperties();
  // const propertyDataResponse = propertyId
  //   ? fetchProperty(propertyId)
  //   : undefined;

  // const statesDataResponse = fetchStates();
  // const availabilityResponse = fetchAvailabilities();

  // const [propertiesData, states, availabilityData, propertyData] =
  //   await Promise.all([
  //     propertiesDataResponse,
  //     statesDataResponse,
  //     availabilityResponse,
  //     propertyDataResponse,
  //   ]);

  return (
    // <HomeContextProvider>
    <HomeWrapper>
      <QrScanner />
    </HomeWrapper>
    // </HomeContextProvider>
  );
}

export { Home };
