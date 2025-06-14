import { Session } from "@/lib/api/api.types";
import { AuthResponse } from "@/lib/api/auth/auth.types";
import GoogleAuth from "@/modules/googleAuth";

interface Props {
  searchParams: Promise<{ authResponse: string }>;
}

async function GoogleAuthPage({ searchParams: searchParamsAsync }: Props) {
  const searchParams = await searchParamsAsync;
  const decodedResponse = decodeURIComponent(searchParams?.authResponse || "");
  const parsedResponse: AuthResponse = JSON.parse(decodedResponse || "null");

  const session: Session = {
    token: {
      access: parsedResponse?.accessToken,
      refresh: parsedResponse?.refreshToken,
    },
    user: parsedResponse?.user,
  };

  return <GoogleAuth session={session} />;
}

export default GoogleAuthPage;
