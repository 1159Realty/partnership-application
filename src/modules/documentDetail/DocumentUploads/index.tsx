import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchDocumentGroup, fetchDocuments } from "@/lib/api/document/server.document";
import { getServerSession } from "@/lib/session/server";
import { getIsModerator } from "@/lib/session/roles";
import { ROUTES } from "@/utils/constants";
import { redirect } from "next/navigation";

interface Props {
  documentGroupId: string;
}

async function DocumentsUpload({ documentGroupId }: Props) {
  const session = await getServerSession();
  const isModerator = getIsModerator(session?.user?.roleId);

  const documentsDataResponse = fetchDocuments({ documentGroupId, type: "CLIENT", limit: 6 });
  const documentGroupDataResponse = fetchDocumentGroup(documentGroupId);
  const [documentsData, documentGroupData] = await Promise.all([documentsDataResponse, documentGroupDataResponse]);

  const isResourceOwner = documentGroupData?.client?.id === session?.user?.id;

  if (!isModerator && !isResourceOwner) {
    redirect(ROUTES["/documents"]);
  }
  return (
    <ModulePageWrapper>
      <Main documentsData={documentsData} documentGroupData={documentGroupData} />
    </ModulePageWrapper>
  );
}

export { DocumentsUpload };
