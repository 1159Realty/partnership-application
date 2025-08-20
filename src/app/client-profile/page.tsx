import { fetchPublicProfile } from "@/lib/api/public-profile/server.public-profile";
import PublicProfileViewer from "@/modules/client-profile/client-profile";

export default async function PublicProfilePage({ searchParams }: any) {
  const publicId = searchParams?.publicId;

  const profile = publicId ? await fetchPublicProfile(publicId) : null;

  return <PublicProfileViewer profile={profile} />;
}
