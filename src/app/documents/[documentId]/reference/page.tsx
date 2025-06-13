import { ReferenceDocument } from "@/modules/documentDetail/DocumentReference";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ documentId: string }>;
}

async function ReferenceDocumentPage({ params: paramsAsync }: Props) {
  const { documentId } = await paramsAsync;

  return <ReferenceDocument documentGroupId={documentId} />;
}

export default ReferenceDocumentPage;
