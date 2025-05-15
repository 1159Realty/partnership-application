export const dynamic = "force-dynamic";

import { DocumentDetail } from "@/modules/documentDetail";

interface Props {
  params: Promise<{ documentId: string }>;
}
async function DocumentDetailPage({ params }: Props) {
  const { documentId } = await params;

  return <DocumentDetail documentGroupId={documentId} />;
}

export default DocumentDetailPage;
