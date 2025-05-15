export const dynamic = "force-dynamic";

import { ClientDetail } from "@/modules/clientDetail";

interface Props {
  params: Promise<{ clientId: string }>;
}
async function ClientDetailPage({ params }: Props) {
  const { clientId } = await params;

  return <ClientDetail clientId={clientId} />;
}

export default ClientDetailPage;
