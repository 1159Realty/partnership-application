import { fetchCustomerProfile } from "@/lib/api/customer/server";
import PublicProfileViewer from "@/modules/client-profile/client-profile";

interface Props {
  params: Promise<{ customerId: string }>;
}

export default async function PublicProfilePage({ params }: Props) {
  const { customerId } = await params;

  const customer = await fetchCustomerProfile(customerId);

  return <PublicProfileViewer customer={customer} />;
}
