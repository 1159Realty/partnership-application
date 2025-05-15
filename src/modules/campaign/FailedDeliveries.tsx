"use client";

import { IFailedCampaignDelivery } from "@/lib/api/campaign/types";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Search } from "@/components/Inputs";
import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Stack } from "@mui/material";
import { Megaphone } from "@phosphor-icons/react/dist/ssr";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import { useEffect, useState } from "react";
import { FailedDeliveriesTable } from "@/components/tables/FailedDeliveriesTable";
import { useDebounce } from "use-debounce";

interface Props {
  failedCampaignDeliveriesData: PaginatedResponse<IFailedCampaignDelivery> | null;
}

function FailedDeliveries({ failedCampaignDeliveriesData }: Props) {
  const { fetchFailedCampaignDeliveries } = useCampaign();

  const [failedCampaignDeliveries, setFailedCampaignDeliveriesData] = useState(failedCampaignDeliveriesData);

  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");

  const [debouncedSearchQuery] = useDebounce(searchQuery, 700);
  const hasItem = Boolean(failedCampaignDeliveries?.items?.length);

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  useEffect(() => {
    async function get() {
      const response = await fetchFailedCampaignDeliveries({ keyword: debouncedSearchQuery, page: page + 1, limit });
      if (response) {
        setFailedCampaignDeliveriesData(response);
      }
    }
    get();
  }, [debouncedSearchQuery, fetchFailedCampaignDeliveries, limit, page]);

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
            placeholder="Recipient's name or email..."
          />
        </Box>
      </Stack>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Megaphone}
              noItemCreatedDescription={`No failed deliveries to show`}
              noItemFoundDescription="No failed deliveries found"
              noItemCreated={Boolean(!failedCampaignDeliveries?.items?.length && !failedCampaignDeliveriesData?.items?.length)}
            />
          </Stack>
        ) : (
          <FailedDeliveriesTable
            data={failedCampaignDeliveries}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
          />
        )}
      </Box>
    </Box>
  );
}

export { FailedDeliveries };
