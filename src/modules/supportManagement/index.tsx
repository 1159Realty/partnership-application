import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchSupportCategories, fetchSupportTickets } from "@/lib/api/support/server";

async function SupportManagement() {
  const supportDataResponse = fetchSupportTickets();
  const supportCategoriesDataResponse = fetchSupportCategories();

  const [supportData, supportCategoriesData] = await Promise.all([supportDataResponse, supportCategoriesDataResponse]);

  return (
    <ModulePageWrapper>
      <Main supportData={supportData} supportCategoriesData={supportCategoriesData} />
    </ModulePageWrapper>
  );
}

export { SupportManagement };
