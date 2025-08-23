import { fetchPublicProfile } from "@/lib/api/public-profile/server.public-profile";
import PublicProfileViewer from "@/modules/client-profile/client-profile";
import { HomeWrapper } from "@/modules/home/home.styles";
import QrScanner from "@/modules/qrCodeScanner";

export default async function Home({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const publicIdParam = searchParams?.publicId;

  const publicId = Array.isArray(publicIdParam)
    ? publicIdParam[0]
    : publicIdParam;

  const profile = publicId ? await fetchPublicProfile(publicId) : null;
  console.log("publicIdParam", publicId, profile);

  return (
    <HomeWrapper>
      <QrScanner />
      {/* <PublicProfileViewer profile={profile} /> */}
    </HomeWrapper>
  );
}
