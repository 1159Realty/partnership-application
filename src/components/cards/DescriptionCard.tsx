import React, { useState } from "react";
import { MobileB1MGray800, MobileB1SMGray900 } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import { truncateString } from "@/services/string";
import { COLORS } from "@/utils/colors";
import { DescriptionCardContentText, DescriptionCardContentWrapper, DescriptionCardWrapper } from "./cards.styles";

interface Props {
  title: string;
  description: string;
  children?: React.ReactNode;
}
function DescriptionCard({ title, description, children }: Props) {
  const maxLength = 100;

  const [showAll, setShowAll] = useState(false);
  return (
    <DescriptionCardWrapper>
      <Stack direction={"row"} alignItems={"center"} justifyContent={"space-between"} spacing={"10px"} px="10px" py="5px">
        <MobileB1SMGray900 style={{ textTransform: "capitalize" }}>{title}</MobileB1SMGray900>
        {children}
      </Stack>
      <DescriptionCardContentWrapper>
        <DescriptionCardContentText>
          <MobileB1MGray800>
            {truncateString(description, maxLength, showAll ? "show-all" : undefined)}
            {showAll ? (
              <Box sx={{ cursor: "pointer" }} onClick={() => setShowAll(false)} display={"inline"} color={COLORS.gray500}>
                {" "}
                less
              </Box>
            ) : (
              !showAll &&
              description.length > maxLength && (
                <Box sx={{ cursor: "pointer" }} onClick={() => setShowAll(true)} display={"inline"} color={COLORS.gray500}>
                  {" "}
                  more
                </Box>
              )
            )}
          </MobileB1MGray800>
        </DescriptionCardContentText>
      </DescriptionCardContentWrapper>
    </DescriptionCardWrapper>
  );
}

export { DescriptionCard };
