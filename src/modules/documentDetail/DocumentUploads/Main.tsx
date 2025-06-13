"use client";

import { NoListItemCard } from "@/components/cards/NoItemCard";
import { DocumentCard } from "@/components/cards/DocumentCard";
import { Pagination } from "@/components/pagination";
import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IDocument, IDocumentGroup } from "@/lib/api/document/document.types";
import { useDocument } from "@/lib/api/document/useDocument";
import { Box, Grid2, Stack } from "@mui/material";
import { FileText } from "@phosphor-icons/react";
import React, { useEffect, useState } from "react";
import { DocumentForm } from "@/components/forms/DocumentForm";
import { useUserContext } from "@/contexts/UserContext";
import { getIsModerator } from "@/lib/session/roles";
import { Plus, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/utils/constants";
import { DocumentTutorial } from "../DocumentTutorial";
import { Button } from "@/components/buttons";

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
  const [isOpen, setIsOpen] = useState(false);
  const [reload, setReload] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const hasItem = Boolean(documents?.items?.length);
  const isModerator = getIsModerator(userData?.roleId);
  const canAddItem = !isModerator;

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
        type: "CLIENT",
      });
      if (response) {
        setDocuments(response);
      }
    }
    getProperties();
  }, [documentGroupData?.id, fetchDocuments, page, reload]);

  return (
    <Box>
      <Stack rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle backUrl={`${ROUTES["/documents"]}/${documentGroupData?.id}`} mr={"5px"}>
            <Box textTransform={"capitalize"}>{documentGroupData?.title || "Documents"}</Box>
          </PageTitle>
        </Stack>
        {canAddItem && (
          <Stack mt="30px" alignItems={"flex-end"}>
            <Button endIcon={<Plus size={15} weight="bold" />} onClick={() => setIsOpen(true)}>
              Add Item
            </Button>
          </Stack>
        )}
      </Stack>

      <Box mt="20px">
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
                  <DocumentCard onClick={handleClick} document={x} />
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

        {Boolean(documentGroupData?.youtubeUrl?.trim()) && (
          <Box position={"fixed"} bottom={"30px"} right={"20px"}>
            <Button
              sx={{ px: "20px" }}
              size="small"
              color="info"
              endIcon={<YoutubeLogo size={20} weight="bold" />}
              onClick={() => setShowTutorial(true)}
            >
              See quick tutorial
            </Button>
          </Box>
        )}
      </Box>
      <DocumentForm
        documentGroupId={documentGroupData?.id || ""}
        isOpen={isOpen || Boolean(document)}
        onClose={handleClose}
        canUpdate={canAddItem}
        document={document}
        onCreate={() => setReload(!reload)}
        onDelete={() => setReload(!reload)}
        formType={"CLIENT"}
      />

      <DocumentTutorial onClose={() => setShowTutorial(false)} isOpen={showTutorial} documentGroup={documentGroupData} />
    </Box>
  );
}

export { Main };
