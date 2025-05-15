import React from "react";
import { Box, Stack } from "@mui/material";
import { MobileB1MGray700 } from "@/utils/typography";
import { COLORS } from "@/utils/colors";
import { Icon as SvgIcon } from "@phosphor-icons/react";
import { CreateItemWrapper, NoItemWrapper } from "./cards.styles";
import { Button } from "../buttons";

interface CreateItemCardProps {
  description: string;
  Icon: SvgIcon;
}

function NoPropertyClient({ description, Icon }: CreateItemCardProps) {
  return (
    <NoItemWrapper>
      <Stack justifyContent={"center"} alignItems={"center"}>
        <Box>
          <Icon weight="bold" size={56} color={COLORS.gray400} />
        </Box>
        <MobileB1MGray700>{description}</MobileB1MGray700>
      </Stack>
    </NoItemWrapper>
  );
}

interface NoListItemCardProps {
  action?: string;
  Icon: SvgIcon;
  onClick?: () => void;
  noItemCreated: boolean;
  noItemCreatedDescription?: string;
  noItemFoundDescription?: string;
}

function NoListItemCard({
  action,
  Icon,
  onClick,
  noItemCreated,
  noItemCreatedDescription,
  noItemFoundDescription,
}: NoListItemCardProps) {
  return (
    <CreateItemWrapper>
      <Stack justifyContent={"center"} alignItems={"center"}>
        <Box>
          <Icon weight="bold" size={56} color={COLORS.gray400} />
        </Box>
        <MobileB1MGray700 style={{textAlign: 'center'}}>{noItemCreated ? noItemCreatedDescription : noItemFoundDescription}</MobileB1MGray700>
      </Stack>
      {Boolean(onClick && noItemCreated) && <Button onClick={onClick}>{action}</Button>}
    </CreateItemWrapper>
  );
}

export { NoPropertyClient, NoListItemCard };
