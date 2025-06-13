"use client";

import { PaginatedResponse } from "@/lib/api/api.types";
import { Box, Grid2, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { FileText, Plus } from "@phosphor-icons/react/dist/ssr";
import { PageTitle } from "@/components/typography";
import { getClientSession } from "@/lib/session/client";
import { useUserContext } from "@/contexts/UserContext";
import { getIsModerator } from "@/lib/session/roles";
import { IDocumentGroup } from "@/lib/api/document/document.types";
import { useDocument } from "@/lib/api/document/useDocument";
import { DocumentTable } from "@/components/tables/DocumentTable";
import { Button } from "@/components/buttons";
import { DocumentGroupForm } from "@/components/forms/DocumentGroupForm";
import { DocumentGroupFilters, IDocumentGroupFilters } from "@/components/filters/DocumentGroupFilters";
import { DescriptionCard } from "@/components/cards/DescriptionCard";
import { Pagination } from "@/components/pagination";

interface Props {
  documentGroupsData: PaginatedResponse<IDocumentGroup> | null;
}

function Main({ documentGroupsData }: Props) {
  const { userData } = useUserContext();

  const { fetchDocumentGroups } = useDocument();

  const [documentGroups, setDocumentGroups] = useState<PaginatedResponse<IDocumentGroup> | null>(documentGroupsData);

  const [filters, setFilters] = useState<IDocumentGroupFilters>({});
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [reload, setReload] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const hasItem = Boolean(documentGroups?.items?.length);
  const isModerator = getIsModerator(userData?.roleId);

  function handleCreate(data?: IDocumentGroup | null) {
    if (!data) return;
    setReload(!reload);
  }

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }
  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  useEffect(() => {
    async function getProperties() {
      const session = getClientSession();

      const response = isModerator
        ? await fetchDocumentGroups({ ...filters, keyword: searchQuery, page, limit })
        : await fetchDocumentGroups({ keyword: searchQuery, userId: session?.user?.id, page, limit: 6 });
      if (response) {
        setDocumentGroups(response);
      }
    }
    getProperties();
  }, [fetchDocumentGroups, reload, filters, searchQuery, isModerator, limit, page]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>Documents</Box>
          </PageTitle>
        </Stack>
        {hasItem && isModerator && (
          <Button onClick={() => setIsOpen(true)} startIcon={<Plus weight="bold" />}>
            Add new
          </Button>
        )}
      </Stack>

      <Box my="20px">
        <DocumentGroupFilters
          filters={filters}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilters={setFilters}
          showFiltersControl={isModerator}
        />
      </Box>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              action={isModerator ? "Add new" : undefined}
              onClick={isModerator ? () => setIsOpen(true) : undefined}
              Icon={FileText}
              noItemCreatedDescription={`No documents to show`}
              noItemFoundDescription="No documents found"
              noItemCreated={Boolean(!documentGroups?.items?.length && !documentGroupsData?.items?.length)}
            />
          </Stack>
        ) : isModerator ? (
          <DocumentTable
            data={documentGroups}
            onLimitChange={onLimitChange}
            onPageChange={onPageChange}
            page={page}
            limit={limit}
          />
        ) : (
          <Stack spacing={"30px"}>
            <Grid2 container spacing={{ xxs: 2, md: 3 }}>
              {documentGroups?.items.map((x, index) => (
                <Grid2 key={index} size={{ xxs: 12, xs: 6, lg: 4 }}>
                  <DescriptionCard documentGroup={x}></DescriptionCard>
                </Grid2>
              ))}
            </Grid2>
            <Stack alignItems={"center"}>
              {Boolean(documentGroups?.totalPages && documentGroups.totalPages > 1) && (
                <Pagination
                  onChange={(_, newPage) => {
                    setPage(newPage);
                  }}
                  count={documentGroups?.totalPages || 1}
                  variant="outlined"
                  color="secondary"
                  size="large"
                />
              )}
            </Stack>
          </Stack>
        )}
      </Box>
      <DocumentGroupForm onCreate={handleCreate} isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </Box>
  );
}

export { Main };
