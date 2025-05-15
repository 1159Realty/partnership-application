import { ModulePageWrapper } from "@/styles/globals.styles";
import { Main } from "./Main";
import { fetchSupportCategories } from "@/lib/api/support/server";

async function SupportCategory() {
  const supportCategoriesDataResponse = fetchSupportCategories();

  const [supportCategoriesData] = await Promise.all([supportCategoriesDataResponse]);

  return (
    <ModulePageWrapper>
      <Main supportCategoriesData={supportCategoriesData} />
    </ModulePageWrapper>
  );
}

export { SupportCategory };
