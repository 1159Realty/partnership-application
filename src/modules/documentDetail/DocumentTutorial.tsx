"use client";

import { Drawer } from "@/components/drawer";
import { Box, Stack } from "@mui/material";
import { MobileB1LightGray900 } from "@/utils/typography";
import ReactPlayer from "react-player";
import { TutorialPlayerWrapper } from "./styles";
import { COLORS } from "@/utils/colors";
import { IDocumentGroup } from "@/lib/api/document/document.types";
import { Button } from "@/components/buttons";

interface Props {
  onClose?: () => void;
  onCreate?: (data?: IDocumentGroup | null) => void;
  isOpen: boolean;
  documentGroup?: IDocumentGroup | null;
}

function DocumentTutorial({ onClose, isOpen, documentGroup }: Props) {
  const handleClose = () => {
    onClose?.();
  };

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <Stack spacing={"24px"} pb="48px" mt="60px">
        <Box px="16px">
          <TutorialPlayerWrapper>
            <ReactPlayer width={"100%"} url={documentGroup?.youtubeUrl || ""} />
          </TutorialPlayerWrapper>
        </Box>
        <Box lineHeight={1.6} bgcolor={COLORS.gray100} p="20px">
          <MobileB1LightGray900>
            The Documents pipeline guides you through the upload process by organizing documents into clear groups. Each group may
            include a reference document, this could be an original form you’re meant to fill, or an example to guide you. Click{" "}
            <strong>View Reference</strong> to preview or download the document. If it’s a form, fill it out and upload your
            completed version. Once ready, click <strong>Upload Files </strong>to submit your document(s) for that group.
          </MobileB1LightGray900>
        </Box>

        <Box px="16px">
          <Button onClick={handleClose} fullWidth>
            Close tutorial
          </Button>
        </Box>
      </Stack>
    </Drawer>
  );
}

export { DocumentTutorial };
