import React, { useState } from "react";
import { Font5001218Gray500, Font5001421Gray900 } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import { truncateString } from "@/services/string";
import { COLORS } from "@/utils/colors";
import { DescriptionCardContentText, DescriptionCardWrapper } from "./cards.styles";
import { Folders } from "@phosphor-icons/react/dist/ssr";
import { ROUTES } from "@/utils/constants";
import Link from "next/link";
import { IDocumentGroup } from "@/lib/api/document/document.types";

interface Props {
  documentGroup: IDocumentGroup | null;
}
function DescriptionCard({ documentGroup }: Props) {
  const maxLength = 100;

  const description = documentGroup?.description;

  const [showAll, setShowAll] = useState(false);
  return (
    <DescriptionCardWrapper>
      <Link style={{ textDecoration: "underline" }} href={`${ROUTES["/documents"]}/${documentGroup?.id}`}>
        <Folders size={50} weight="duotone" />
      </Link>

      <Stack spacing={"10px"} mt="30px">
        <Link style={{ textDecoration: "underline", width: "fit-content" }} href={`${ROUTES["/documents"]}/${documentGroup?.id}`}>
          <Font5001421Gray900>{documentGroup?.title || "N/A"}</Font5001421Gray900>
        </Link>

        <DescriptionCardContentText>
          <Font5001218Gray500>
            {truncateString(description, maxLength, showAll ? "show-all" : undefined)}
            {showAll ? (
              <Box sx={{ cursor: "pointer" }} onClick={() => setShowAll(false)} display={"inline"} color={COLORS.gray700}>
                {" "}
                less
              </Box>
            ) : (
              !showAll &&
              (description?.length || 0) > maxLength && (
                <Box sx={{ cursor: "pointer" }} onClick={() => setShowAll(true)} display={"inline"} color={COLORS.gray700}>
                  {" "}
                  more
                </Box>
              )
            )}
          </Font5001218Gray500>
        </DescriptionCardContentText>
      </Stack>
    </DescriptionCardWrapper>
  );
}

export { DescriptionCard };
