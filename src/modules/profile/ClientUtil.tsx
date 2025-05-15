"use client";

import { Button } from "@/components/buttons";
import { useSession } from "@/lib/session/client/useSession";
import React from "react";

function Logout() {
  const { logout } = useSession();

  return <Button onClick={logout}>Logout</Button>;
}

export { Logout };
