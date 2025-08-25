import { Avatar } from "@/components/avatar";
import { Box, Stack, Typography } from "@mui/material";
import { COLORS } from "@/utils/colors";
import { Customer } from "@/lib/api/customer/types";
import { getUserName } from "@/services/string";

interface Props {
  customer: Customer | null;
}

const PublicProfileViewer = ({ customer }: Props) => {
  if (!customer) return null;

  const fullName = getUserName(customer, "full");

  return (
    <Box py={5} px={2} maxWidth="600px" mx="auto">
      <Stack spacing={3} alignItems="center">
        <Avatar size="100px" src={customer?.profilePic} />
        <Typography variant="h5">{fullName}</Typography>

        <FieldBox label="First Name" value={customer?.firstName} />
        <FieldBox label="Last Name" value={customer?.lastName} />
      </Stack>
    </Box>
  );
};

export default PublicProfileViewer;

const FieldBox = ({ label, value }: { label: string; value?: string }) => {
  const display = value?.trim() || "N/A";

  return (
    <Box
      bgcolor={COLORS.gray100}
      p={2}
      borderRadius={2}
      width="100%"
      maxWidth="500px"
      mx="auto"
      mb={2}
    >
      <Typography variant="caption" color={COLORS.gray600}>
        {label}
      </Typography>
      <Typography variant="body1" fontWeight="bold" color={COLORS.gray900}>
        {display}
      </Typography>
    </Box>
  );
};
