// import { fetchPublicProfile } from "@/lib/api/public-profile/server.public-profile";
// import QrScanner from "../qrCodeScanner";
// import { HomeWrapper } from "./home.styles";
// import PublicProfileViewer from "../client-profile/client-profile";

// export default async function Home({
//   searchParams,
// }: {
//   searchParams?: Record<string, string | string[] | undefined>;
// }) {
//   const publicIdParam = searchParams?.publicId;

//   const publicId = Array.isArray(publicIdParam)
//     ? publicIdParam[0]
//     : publicIdParam;

//   const profile = publicId ? await fetchPublicProfile(publicId) : null;

//   return (
//     <HomeWrapper>
//       <QrScanner initialSearchTerm={publicId || ""} initialProfile={profile} />
//       <PublicProfileViewer profile={profile} />
//     </HomeWrapper>
//   );
// }
