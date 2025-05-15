import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchReleases } from "@/lib/api/release/server";

async function Releases() {
  const releaseDataResponse = fetchReleases();

  const [releaseData] = await Promise.all([releaseDataResponse]);

  return (
    <ModulePageWrapper>
      <Main releasesData={releaseData} />
    </ModulePageWrapper>
  );
}

export { Releases };
