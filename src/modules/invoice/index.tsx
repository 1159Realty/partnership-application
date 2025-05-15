import React from "react";
import { Main } from "./Main";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { getServerSession } from "@/lib/session/server";
import { getRole } from "@/lib/session/roles";
import { fetchInvoices, fetchInvoiceTotal } from "@/lib/api/invoice/server";

async function Invoice() {
  const session = await getServerSession();
  const role = getRole(session?.user?.roleId);

  const invoicesDataResponse =
    role === "client" || role === "agent" ? fetchInvoices({ userId: session?.user?.id }) : fetchInvoices();
  const invoiceTotalResponse = fetchInvoiceTotal();

  const [invoicesData, invoiceTotalData] = await Promise.all([invoicesDataResponse, invoiceTotalResponse]);

  return (
    <ModulePageWrapper>
      <Main invoicesData={invoicesData} invoiceTotalData={invoiceTotalData} />
    </ModulePageWrapper>
  );
}

export { Invoice };
