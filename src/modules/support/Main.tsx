"use client";

import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Headset } from "@phosphor-icons/react";
import { ISupport, ISupportCategory, SupportStatus, supportStatusArray } from "@/lib/api/support/types";
import { capitalizeAndSpace } from "@/services/string";
import { PillWithBadge } from "@/components/pills";
import { StatusWrapper } from "./support.styles";
import { SupportCard } from "./Cards";
import { useSupport } from "@/lib/api/support/useSupport";
import { PageTitle } from "@/components/typography";
import { Button } from "@/components/buttons";
import { Plus } from "@phosphor-icons/react/dist/ssr";
import { PaginatedResponse } from "@/lib/api/api.types";
import { Pagination } from "@/components/pagination";
import { SupportForm } from "@/components/forms/SupportForm";
import { useUserContext } from "@/contexts/UserContext";

interface Props {
  supportData: PaginatedResponse<ISupport> | null;
  supportCategoriesData: PaginatedResponse<ISupportCategory> | null;
}

function Main({ supportData, supportCategoriesData }: Props) {
  const { userData } = useUserContext();
  const { fetchSupportTickets, fetchSupportCategories } = useSupport();

  const [supportTickets, setSupportTickets] = useState(supportData);
  const [supportCategories, setSupportCategories] = useState(supportCategoriesData);
  const [showCreateSupport, setShowCreateSupport] = useState(false);

  const [page, setPage] = useState(1);
  const [reload, setReload] = useState(false);

  const [currentStatus, setCurrentStatus] = React.useState<SupportStatus>("IN_PROGRESS");

  const hasItem = Boolean(supportTickets?.items?.length);

  useEffect(() => {
    async function getProperties() {
      const response = await fetchSupportTickets({
        // TODO: filter by userid
        userId: userData?.id,
        status: currentStatus,
        limit: 6,
        page,
      });
      if (response) {
        setSupportTickets(response);
      }
    }
    getProperties();
  }, [fetchSupportTickets, page, reload, currentStatus, userData?.id]);

  useEffect(() => {
    async function getProperties() {
      const response = await fetchSupportCategories();
      if (response) {
        setSupportCategories(response);
      }
    }
    getProperties();
  }, [fetchSupportCategories]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <PageTitle mr={"5px"}>Support</PageTitle>
        {hasItem && (
          <Button onClick={() => setShowCreateSupport(true)} startIcon={<Plus weight="bold" />}>
            Add new
          </Button>
        )}
      </Stack>
      <StatusWrapper>
        {supportStatusArray.map((x) => (
          <Box key={x} mr="10px">
            <PillWithBadge text={capitalizeAndSpace(x)} isActive={currentStatus === x} onClick={() => setCurrentStatus(x)} />
          </Box>
        ))}
      </StatusWrapper>
      {!hasItem ? (
        <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
          <NoListItemCard
            action="Add new ticket"
            Icon={Headset}
            onClick={() => {
              setShowCreateSupport(true);
            }}
            noItemCreatedDescription="You haven't created any ticket!"
            noItemFoundDescription="No tickets found"
            noItemCreated={Boolean(!supportTickets?.items?.length && !supportData?.items?.length)}
          />
        </Stack>
      ) : (
        <Box>
          <Stack spacing={"30px"} mt="30px">
            <Grid2 container spacing={{ xxs: 2, md: 3 }}>
              {supportTickets?.items?.map((x) => (
                <Grid2 key={x?.id} size={{ xxs: 12, xs: 6, lg: 4 }}>
                  <SupportCard support={x} />
                </Grid2>
              ))}
            </Grid2>
            <Stack alignItems={"center"}>
              {Boolean(supportTickets?.totalPages && supportTickets.totalPages > 1) && (
                <Pagination
                  onChange={(_, newPage) => {
                    setPage(newPage);
                  }}
                  count={supportTickets?.totalPages || 1}
                  variant="outlined"
                  color="secondary"
                  size="large"
                />
              )}
            </Stack>
          </Stack>
        </Box>
      )}
      <SupportForm
        supportCategories={supportCategories}
        isOpen={showCreateSupport}
        onClose={() => setShowCreateSupport(false)}
        onCreate={() => setReload(!reload)}
      />
    </Box>
  );
}

export { Main };
