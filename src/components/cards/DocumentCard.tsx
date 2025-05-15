import React from "react";
import { MobileB1SMBlackNormal, MobileCap2MGray500 } from "@/utils/typography";
import { DocumentCardWrapper } from "./cards.styles";
import { Stack } from "@mui/material";
import { DotOutline, FileText } from "@phosphor-icons/react/dist/ssr";
import { IDocument } from "@/lib/api/document/document.types";
import { SEVERITY_COLORS } from "@/utils/colors";

interface DocumentCardProps {
  document: IDocument | null;
  onClick?: (doc?: IDocument | null) => void;
  hideStatus?: boolean;
}

function DocumentCard({ document, onClick, hideStatus }: DocumentCardProps) {
  const getStatus = () => {
    if (!document || hideStatus) return null;
    if (document.status === "COMPLETED") {
      return {
        color: SEVERITY_COLORS.success.dark,
        label: "Approved",
      };
    }
    if (document.status === "REJECTED") {
      return {
        color: SEVERITY_COLORS.danger.dark,
        label: "Rejected",
      };
    }

    return null;
  };
  const handleClick = () => {
    onClick?.(document);
  };

  const status = getStatus();
  return (
    <DocumentCardWrapper onClick={handleClick}>
      <Stack justifyContent={"center"} alignItems={"center"} spacing={"10px"}>
        <Stack visibility={status ? "visible" : "hidden"} direction={"row"} alignItems={"center"} spacing={"0px"} width={"100%"}>
          <DotOutline weight="fill" color={status?.color || ""} size={30} />{" "}
          <MobileCap2MGray500>{status?.label}</MobileCap2MGray500>
        </Stack>
        <Stack>
          <Stack justifyContent={"center"} alignItems={"center"} textAlign={"center"}>
            <FileText size={80} />
            <section>
              <MobileB1SMBlackNormal>{document?.name}</MobileB1SMBlackNormal>
            </section>
          </Stack>
        </Stack>
      </Stack>
    </DocumentCardWrapper>
  );
}

export { DocumentCard };
