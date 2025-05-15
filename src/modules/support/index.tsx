import { fetchSupportCategories, fetchSupportTickets } from "@/lib/api/support/server";
import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";

export default async function Support() {
  // TODO: filter by userid
  const supportDataResponse = fetchSupportTickets({
    // userId: session?.user?.id,
    limit: 6,
    status: "IN_PROGRESS",
  });
  const supportCategoriesDataResponse = fetchSupportCategories();

  const [supportData, supportCategoriesData] = await Promise.all([supportDataResponse, supportCategoriesDataResponse]);

  return (
    <ModulePageWrapper>
      <Main supportData={supportData} supportCategoriesData={supportCategoriesData} />
    </ModulePageWrapper>
  );
}
