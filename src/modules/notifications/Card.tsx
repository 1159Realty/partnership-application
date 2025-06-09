"use client";

import { Avatar } from "@/components/avatar";
import { useNotificationAlert } from "@/hooks/useNotificationAlert";
import { INotification } from "@/lib/api/notifications/types";
import { COLORS } from "@/utils/colors";
import { MobileB1M, MobileB1MGray500 } from "@/utils/typography";
import { Stack } from "@mui/material";

interface Props {
  notification: INotification | null;
}

function Card({ notification }: Props) {
  const { content } = useNotificationAlert(notification);

  if (!content) return null;
  return (
    <Stack
      onClick={() => content?.handleNavigation()}
      borderRadius={"5px"}
      padding={"15px 20px"}
      bgcolor={COLORS.gray50}
      spacing={"10px"}
      direction={"row"}
      alignItems={"center"}
      sx={{ cursor: "pointer", "&:hover": { backgroundColor: COLORS.gray100 } }}
      mb={1}
    >
      {content?.Icon && <Avatar size="44px">{<content.Icon />}</Avatar>}
      <Stack color={"#272835"}>
        <MobileB1M>{content?.title}</MobileB1M>
        <MobileB1MGray500>{content?.description}</MobileB1MGray500>
      </Stack>
    </Stack>
  );
}

export default Card;
