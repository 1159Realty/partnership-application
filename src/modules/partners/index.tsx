import React from "react";
import { Main } from "./Main";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { fetchPartners } from "@/lib/api/partners/server";

async function Partners() {
  const partnersDataResponse = fetchPartners();
  const [partnersData] = await Promise.all([partnersDataResponse]);

  return (
    <ModulePageWrapper>
      <Main partnersData={partnersData} />
    </ModulePageWrapper>
  );
}

export { Partners };
