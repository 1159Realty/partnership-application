"use client";

import { Drawer } from "@/components/drawer";
import { Box, Stack } from "@mui/material";
import { MobileB1LightGray900 } from "@/utils/typography";
import ReactPlayer from "react-player";
import { TutorialPlayerWrapper } from "./styles";
import { COLORS } from "@/utils/colors";
import { IDocumentGroup } from "@/lib/api/document/document.types";
import { Button } from "@/components/buttons";
import { getIsModerator } from "@/lib/session/roles";
import { useUserContext } from "@/contexts/UserContext";

interface Props {
  onClose?: () => void;
  onCreate?: (data?: IDocumentGroup | null) => void;
  isOpen: boolean;
  documentGroup?: IDocumentGroup | null;
}

function DocumentTutorial({ onClose, isOpen, documentGroup }: Props) {
  const { userData } = useUserContext();
  const isModerator = getIsModerator(userData?.roleId);

  const handleClose = () => {
    onClose?.();
  };

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <Stack spacing={"24px"} pb="48px" mt="60px">
        {Boolean(documentGroup?.youtubeUrl?.trim()) && (
          <Box px="16px">
            <TutorialPlayerWrapper>
              <ReactPlayer controls width={"100%"} url={documentGroup?.youtubeUrl || ""} />
            </TutorialPlayerWrapper>
          </Box>
        )}

        <Box lineHeight={1.6} bgcolor={COLORS.gray100} p="20px">
          {isModerator ? (
            <MobileB1LightGray900>
              The Documents pipeline lets you configure and manage document requirements by organizing them into clearly defined
              groups. <br />
              <br />
              For each group, you can provide a reference document, this may be an original form that users need to download,
              fill, and re-upload, or a sample/example to guide them in preparing the correct documents.
              <br />
              <br />
              Users will see these reference files labeled as <strong>See Reference</strong>. You can also define descriptions to
              clarify what’s required in each group.
              <br />
              <br />
              Once users have reviewed the reference, they can upload one or more files under the group using the{" "}
              <strong>Upload files</strong> action.
              <br />
              <br />
              You can monitor document submission status, review uploaded files, and request resubmissions if needed.
              <br />
              <br />
            </MobileB1LightGray900>
          ) : (
            <MobileB1LightGray900>
              The Documents pipeline guides you through the upload process by organizing documents into clear groups.
              <br />
              <br /> Each group may include a reference document, this could be an original form you’re meant to fill, or an
              example to guide you.
              <br />
              <br />
              Click <strong>See Reference</strong> to preview or download the document. If it’s a form, fill it out and upload
              your completed version. Once ready, click <strong>Upload Files</strong> to submit your document(s) for that group.
            </MobileB1LightGray900>
          )}
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
