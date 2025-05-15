import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchDocumentGroups } from "@/lib/api/document/server.document";
import { getServerSession } from "@/lib/session/server";
import { getIsModerator } from "@/lib/session/roles";

async function Documents() {
  const session = await getServerSession();
  const isModerator = getIsModerator(session?.user?.roleId);
  const documentGroupsDataResponse = isModerator
    ? await fetchDocumentGroups()
    : await fetchDocumentGroups({ userId: session?.user?.id, limit: 6 });

  const [documentGroupsData] = await Promise.all([documentGroupsDataResponse]);

  return (
    <ModulePageWrapper>
      <Main documentGroupsData={documentGroupsData} />
    </ModulePageWrapper>
  );
}

export { Documents };
