import { COLORS, SEVERITY_COLORS } from "@/utils/colors";
import { MobileB1MGray500 } from "@/utils/typography";
import { Box, ChipProps, Chip as MuiChip, Stack, StackProps } from "@mui/material";
import { DotOutline } from "@phosphor-icons/react/dist/ssr";

function Chip({ ...props }: ChipProps) {
  return <MuiChip {...props} />;
}

interface StatusChipProps extends StackProps {
  value: string;
}

function StatusChip({ value, ...props }: StatusChipProps) {
  return (
    <Stack
      width={"fit-content"}
      bgcolor={COLORS.gray200}
      padding={"3px 10px"}
      borderRadius={"8px"}
      direction={"row"}
      alignItems="center"
      {...props}
    >
      <Box>
        <MobileB1MGray500>{value}</MobileB1MGray500>
      </Box>

      <DotOutline size={"30px"} weight="fill" color={SEVERITY_COLORS.success.dark} />
    </Stack>
  );
}

export { Chip, StatusChip };
