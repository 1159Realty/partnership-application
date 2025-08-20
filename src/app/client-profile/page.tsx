import { fetchPublicProfile } from "@/lib/api/public-profile/server.public-profile";
import PublicProfileViewer from "@/modules/client-profile/client-profile";

interface Props {
  searchParams: { publicId?: string };
}

export default async function PublicProfilePage({ searchParams }: Props) {
  const { publicId } = searchParams;

  const profile = publicId ? await fetchPublicProfile(publicId) : null;

  return <PublicProfileViewer profile={profile} />;
}
