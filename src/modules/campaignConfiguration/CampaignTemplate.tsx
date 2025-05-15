"use client";

import { Button } from "@/components/buttons";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { CampaignTemplateForm } from "@/components/forms/CampaignTemplateForm";
import { Search } from "@/components/Inputs";
import { CampaignTemplateTable } from "@/components/tables/CampaignTemplateTable";
import { PaginatedResponse } from "@/lib/api/api.types";
import { ICampaignTemplate, IDesign } from "@/lib/api/campaign/types";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import { Box, Stack } from "@mui/material";
import { Megaphone } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {
  campaignTemplatesData: PaginatedResponse<ICampaignTemplate> | null;
  designsData: PaginatedResponse<IDesign> | null;
}

function CampaignTemplate({ campaignTemplatesData, designsData }: Props) {
  const { fetchCampaignTemplates } = useCampaign();

  const [campaignTemplates, setCampaignTemplates] = useState(campaignTemplatesData);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");

  const [reload, setReload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [template, setTemplate] = useState<ICampaignTemplate | null>(null);

  const hasItem = Boolean(campaignTemplates?.items?.length);
  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);

  function handleClose() {
    setIsOpen(false);
    setTemplate(null);
  }

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function onCreate() {
    setReload(!reload);
  }

  useEffect(() => {
    async function get() {
      const response = await fetchCampaignTemplates({ page: page + 1, limit, keyword: debouncedSearchQuery });
      if (response) {
        setCampaignTemplates(response);
      }
    }
    get();
  }, [fetchCampaignTemplates, limit, page, reload, debouncedSearchQuery]);

  return (
    <Box>
      <Stack
        rowGap={"10px"}
        columnGap={"10px"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        flexWrap={"wrap"}
      >
        <Box flexGrow={1} maxWidth={300}>
          <Search
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
            }}
            placeholder="Campaign template..."
          />
        </Box>

        {hasItem && <Button onClick={() => setIsOpen(true)}>Add Template</Button>}
      </Stack>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Megaphone}
              onClick={() => setIsOpen(true)}
              action="Add Campaign Template"
              noItemCreatedDescription={`No campaign template to show`}
              noItemFoundDescription="No campaign template found"
              noItemCreated={Boolean(!campaignTemplates?.items?.length && !campaignTemplatesData?.items?.length)}
            />
          </Stack>
        ) : (
          <CampaignTemplateTable
            data={campaignTemplates}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
            onRowClick={(data) => setTemplate(data)}
          />
        )}
      </Box>
      <CampaignTemplateForm
        isOpen={isOpen || Boolean(template)}
        onClose={handleClose}
        data={template}
        designsData={designsData}
        onCreate={onCreate}
      />
    </Box>
  );
}

export { CampaignTemplate };
