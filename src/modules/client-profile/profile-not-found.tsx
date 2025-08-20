"use client";

import { Box, Stack, Typography } from "@mui/material";
import { Dog } from "@phosphor-icons/react";
import { COLORS } from "@/utils/colors";

const NotFound = ({ message }: { message: string }) => {
  return (
    <Box textAlign="center" mt={10}>
      <Stack spacing={2} alignItems="center">
        <Dog size={72} weight="duotone" color={COLORS.gray400} />
        <Typography variant="h6" color={COLORS.gray700}>
          {message}
        </Typography>
      </Stack>
    </Box>
  );
};

export default NotFound;
