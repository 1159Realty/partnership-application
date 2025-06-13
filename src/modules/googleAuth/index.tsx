"use client";

import { Spinner } from "@/components/loaders";
import { Session } from "@/lib/api/api.types";
import { useSession } from "@/lib/session/client/useSession";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  session: Session;
}
function GoogleAuth({ session }: Props) {
  const { push } = useRouter();
  const { saveSession } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      saveSession(session);
      push("/");
    }
  }, [push, saveSession, session]);
  return <Spinner />;
}

export default GoogleAuth;
