"use client";

import { Avatar } from "@/components/avatar";
import { Box, Stack, Typography } from "@mui/material";
import { COLORS } from "@/utils/colors";
import { PublicProfile } from "@/lib/api/public-profile/public-profile.types";
import NotFound from "./profile-not-found";

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

const PublicProfileViewer = ({
  profile,
}: {
  profile: PublicProfile | null;
}) => {
  if (!profile) return null;

  // If API might return a message when user isn't found
  if ((profile as any).message === "User not found") {
    return <NotFound message="Oops! This profile doesn't exist." />;
  }

  // Assume profile is the actual user object directly
  const result = profile as any; // Or define a more accurate type if needed

  // Check if it contains meaningful data
  if (!result || Object.keys(result).length === 0) {
    return <NotFound message="No profile data available." />;
  }

  const fullName =
    [result.firstName, result.lastName].filter(Boolean).join(" ").trim() ||
    "N/A";

  return (
    <Box py={5} px={2} maxWidth="600px" mx="auto">
      <Stack spacing={3} alignItems="center">
        <Avatar size="100px" src={result.profilePic} />
        <Typography variant="h5">{fullName}</Typography>

        <FieldBox label="First Name" value={result.firstName} />
        <FieldBox label="Last Name" value={result.lastName} />
      </Stack>
    </Box>
  );
};

export default PublicProfileViewer;
