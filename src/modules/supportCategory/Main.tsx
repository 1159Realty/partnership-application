"use client";

import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Headset } from "@phosphor-icons/react/dist/ssr";
import { PageTitle } from "@/components/typography";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { ISupportCategory } from "@/lib/api/support/types";
import { useSupport } from "@/lib/api/support/useSupport";
import { SupportCategoryTable } from "@/components/tables/SupportCategoryTable";
import { Button } from "@/components/buttons";
import { SupportCategoryForm } from "@/components/forms/SupportCategoryForm";
import { ROUTES } from "@/utils/constants";

interface Props {
  supportCategoriesData: PaginatedResponse<ISupportCategory> | null;
}

function Main({ supportCategoriesData }: Props) {
  const { fetchSupportCategories, deleteSupportCategory } = useSupport();

  const [supportCategories, setSupportCategories] = useState(supportCategoriesData);
  const [supportCategory, setSupportCategory] = useState<ISupportCategory | null>(null);
  const [resolving, setResolving] = useState(false);
  const [reload, setReload] = useState(false);
  const [showCreateSupport, setShowCreateSupport] = useState(false);

  const hasItem = Boolean(supportCategories?.items?.length);

  async function handleDelete() {
    if (!supportCategory) return;
    setResolving(true);
    await deleteSupportCategory(supportCategory?.id);
    setReload(!reload);
    setSupportCategory(null);
    setResolving(false);
  }

  useEffect(() => {
    async function getProperties() {
      const response = await fetchSupportCategories();
      if (response) {
        setSupportCategories(response);
      }
    }
    getProperties();
  }, [fetchSupportCategories, reload]);

  return (
    <Box>
      <Stack mb="20" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle backUrl={ROUTES["/support-management"]} mr={"5px"}>
            <Box textTransform={"capitalize"}>Support Categories</Box>
          </PageTitle>
        </Stack>
        <Button onClick={() => setShowCreateSupport(true)}>Add Item</Button>
      </Stack>

      <Box mt="30px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={Headset}
              noItemCreatedDescription={`No support to show`}
              noItemFoundDescription="No support found"
              noItemCreated={Boolean(!supportCategories?.items?.length && !supportCategoriesData?.items?.length)}
            />
          </Stack>
        ) : (
          <SupportCategoryTable data={supportCategories} onRowClick={(data) => setSupportCategory(data)} />
        )}
      </Box>
      <ConfirmationDialog
        message="Are you sure you want to delete this support category?"
        isOpen={Boolean(supportCategory)}
        onClose={() => setSupportCategory(null)}
        onConfirm={handleDelete}
        loading={resolving}
      />
      <SupportCategoryForm
        isOpen={showCreateSupport}
        onClose={() => setShowCreateSupport(false)}
        onCreate={() => setReload(!reload)}
      />
    </Box>
  );
}

export { Main };
