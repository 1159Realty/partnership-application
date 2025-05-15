"use client";

import { NoListItemCard } from "@/components/cards/NoItemCard";
import { DocumentCard } from "@/components/cards/DocumentCard";
import { Pagination } from "@/components/pagination";
import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IDocument, IDocumentGroup } from "@/lib/api/document/document.types";
import { useDocument } from "@/lib/api/document/useDocument";
import { Box, Grid2, Stack, useMediaQuery } from "@mui/material";
import { FileText } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { DocumentForm } from "@/components/forms/DocumentForm";
import { ScrollableTabs } from "@/components/tabs";
import { useUserContext } from "@/contexts/UserContext";
import { getIsModerator } from "@/lib/session/roles";
import { Button, IconButton } from "@/components/buttons";
import { Gear, Plus } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/utils/constants";
import { COLORS } from "@/utils/colors";
import { DocumentGroupForm } from "@/components/forms/DocumentGroupForm";

interface Props {
  documentsData: PaginatedResponse<IDocument> | null;
  documentGroupData: IDocumentGroup | null;
}

function Main({ documentsData, documentGroupData }: Props) {
  const { userData } = useUserContext();

  const { fetchDocuments } = useDocument();

  const [documents, setDocuments] = useState<PaginatedResponse<IDocument> | null>(documentsData);
  const [document, setDocument] = useState<IDocument | null>(null);
  const [page, setPage] = useState(0);
  const [currentTabIndex, setCurrentTabIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showDocumentGroup, setShowDocumentGroup] = useState(false);
  const [reload, setReload] = useState(false);

  const hasItem = Boolean(documents?.items?.length);
  const isModerator = getIsModerator(userData?.roleId);
  const tabs = isModerator ? ["client", "administrative"] : ["uploaded", "required"];
  const maxWidth = useMediaQuery("(max-width: 375px)");
  const canAddItem = (isModerator && currentTabIndex === 1) || (!isModerator && currentTabIndex === 0);

  const canUpdate = (isModerator && currentTabIndex === 1) || (!isModerator && currentTabIndex === 0);

  function handleTabChange(index: number) {
    setCurrentTabIndex(index);
  }

  const handleClick = (doc?: null | IDocument) => {
    if (!doc) return;
    setDocument(doc);
  };

  function handleClose() {
    setDocument(null);
    setIsOpen(false);
  }

  useEffect(() => {
    async function getProperties() {
      const response = await fetchDocuments({
        page,
        limit: 6,
        documentGroupId: documentGroupData?.id,
        type: currentTabIndex === 0 ? "CLIENT" : "MODERATOR",
      });
      if (response) {
        setDocuments(response);
      }
    }
    getProperties();
  }, [currentTabIndex, documentGroupData?.id, fetchDocuments, page, reload]);

  return (
    <Box>
      <Stack rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle backUrl={ROUTES["/documents"]} mr={"5px"}>
            <Box textTransform={"capitalize"}>{documentGroupData?.title || "Documents"}</Box>
          </PageTitle>
        </Stack>
        <IconButton onClick={() => setShowDocumentGroup(true)} bg_color={COLORS.gray200}>
          <Gear weight="duotone" />
        </IconButton>
      </Stack>
      {canAddItem && (
        <Stack mt="30px" alignItems={"flex-end"}>
          <Button endIcon={<Plus size={15} weight="bold" />} onClick={() => setIsOpen(true)}>
            Add Item
          </Button>
        </Stack>
      )}

      <Box mt="20px">
        <Box mb="30px" mt="20px">
          <ScrollableTabs showScroll={maxWidth} onChange={handleTabChange} value={currentTabIndex} tabs={tabs} />
        </Box>

        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={FileText}
              noItemCreatedDescription={`No documents to show`}
              noItemFoundDescription="No documents found"
              noItemCreated={Boolean(!documents?.items?.length && !documents?.items?.length)}
            />
          </Stack>
        ) : (
          <Stack spacing={"30px"}>
            <Grid2 container spacing={{ xxs: 2, md: 3 }}>
              {documents?.items.map((x, index) => (
                <Grid2 key={index} size={{ xxs: 12, xs: 6, lg: 4 }}>
                  <DocumentCard hideStatus={currentTabIndex === 1} onClick={handleClick} document={x} />
                </Grid2>
              ))}
            </Grid2>
            <Stack alignItems={"center"}>
              {Boolean(documents?.totalPages && documents.totalPages > 1) && (
                <Pagination
                  onChange={(_, newPage) => {
                    setPage(newPage);
                  }}
                  count={documents?.totalPages || 1}
                  variant="outlined"
                  color="secondary"
                  size="large"
                />
              )}
            </Stack>
          </Stack>
        )}
      </Box>
      <DocumentForm
        documentGroupId={documentGroupData?.id || ""}
        isOpen={isOpen || Boolean(document)}
        onClose={handleClose}
        canUpdate={canUpdate}
        document={document}
        onCreate={() => setReload(!reload)}
        formType={currentTabIndex === 0 ? "CLIENT" : "MODERATOR"}
      />

      <DocumentGroupForm
        documentGroup={documentGroupData}
        isOpen={showDocumentGroup}
        onClose={() => setShowDocumentGroup(false)}
      />
    </Box>
  );
}

export { Main };
