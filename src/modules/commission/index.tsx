import React from "react";
import { Main } from "./Main";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { fetchCommissions, fetchCommissionTotal } from "@/lib/api/commission/server";
import { getServerSession } from "@/lib/session/server";

async function Commission() {
  const session = await getServerSession();

  const commissionDataResponse = await fetchCommissions({ agentId: session?.user?.id });
  const commissionTotalDataResponse = await fetchCommissionTotal();

  const [commissionData, commissionTotalData] = await Promise.all([commissionDataResponse, commissionTotalDataResponse]);

  return (
    <ModulePageWrapper>
      <Main commissionsData={commissionData} commissionTotalData={commissionTotalData} />
    </ModulePageWrapper>
  );
}

export { Commission };
