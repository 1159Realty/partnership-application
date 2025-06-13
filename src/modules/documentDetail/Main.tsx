"use client";

import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import { IDocument, IDocumentGroup } from "@/lib/api/document/document.types";
import { Box, Stack } from "@mui/material";
import { useState } from "react";

import { Button, IconButton } from "@/components/buttons";
import { Folders, Gear, YoutubeLogo } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/utils/constants";
import { COLORS } from "@/utils/colors";
import { DocumentGroupForm } from "@/components/forms/DocumentGroupForm";
import { DocumentTutorial } from "./DocumentTutorial";
import { Pill } from "@/components/pills";
import Link from "next/link";

interface Props {
  documentsData: PaginatedResponse<IDocument> | null;
  documentGroupData: IDocumentGroup | null;
}

function Main({ documentGroupData }: Props) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [showDocumentGroup, setShowDocumentGroup] = useState(false);

  return (
    <Box>
      <Stack rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle backUrl={ROUTES["/documents"]} mr={"5px"}></PageTitle>
        </Stack>
        <IconButton onClick={() => setShowDocumentGroup(true)} bg_color={COLORS.gray200}>
          <Gear weight="duotone" />
        </IconButton>
      </Stack>

      <Stack mx="auto" maxWidth={500} spacing={"32px"} mt="40px" alignItems={"center"}>
        <Stack
          borderRadius={"50%"}
          bgcolor={COLORS.greenNormal}
          justifyContent={"center"}
          alignItems={"center"}
          width={"100px"}
          height={"100px"}
        >
          <Folders size={50} weight="regular" />
        </Stack>

        <Box textAlign={"center"} fontWeight={400} fontSize={30}>
          {documentGroupData?.title}
        </Box>

        <Box p="20px" fontSize={13} lineHeight={1.8} width={"100%"} bgcolor={COLORS.gray50} color={COLORS.gray700}>
          <Box mb="10px">
            <Pill color={"#a71010"} bgcolor={"white"}>
              <span style={{ fontSize: 12 }}>Important</span>
            </Pill>
          </Box>
          {documentGroupData?.description}
        </Box>

        <Stack justifyContent={"center"} direction={"row"} flexWrap={"wrap"} rowGap={"20px"}>
          <Link href={`/documents/${documentGroupData?.id}/reference`}>
            <Button variant="outlined" sx={{ mr: "20px" }}>
              View Reference
            </Button>
          </Link>

          <Link href={`/documents/${documentGroupData?.id}/uploads`}>
            <Button sx={{ mr: "20px" }}>Upload Document</Button>
          </Link>
        </Stack>
      </Stack>
      {Boolean(documentGroupData?.youtubeUrl?.trim()) && (
        <Box position={"fixed"} bottom={"30px"} right={"20px"}>
          <IconButton color="error" onClick={() => setShowTutorial(true)}>
            <YoutubeLogo weight="fill" />
          </IconButton>
        </Box>
      )}
      <DocumentTutorial onClose={() => setShowTutorial(false)} isOpen={showTutorial} documentGroup={documentGroupData} />

      <DocumentGroupForm
        documentGroup={documentGroupData}
        isOpen={showDocumentGroup}
        onClose={() => setShowDocumentGroup(false)}
      />
    </Box>
  );
}

export { Main };
