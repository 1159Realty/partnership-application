"use client";

import React from "react";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/buttons";

function HasItemCreateButton() {
  return <Button startIcon={<Plus weight="bold" />}>Add new</Button>;
}

export { HasItemCreateButton };
