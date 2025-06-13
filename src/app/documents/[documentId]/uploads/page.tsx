import { DocumentsUpload } from "@/modules/documentDetail/DocumentUploads";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ documentId: string }>;
}

async function DocumentUploadsPage({ params: paramsAsync }: Props) {
  const { documentId } = await paramsAsync;

  return <DocumentsUpload documentGroupId={documentId} />;
}

export default DocumentUploadsPage;
