// import React from "react";
// import { Avatar, Box, Typography } from "@mui/material";
// import {
//   PublicProfile,
//   result,
// } from "@/lib/api/public-profile/public-profile.types";

// type Props = {
//   profile: result | null;
//   onClick?: () => void;
// };

// const UserRow = ({ profile, onClick }: Props) => {
//   if (!profile) return null;

//   const { firstName, lastName, profilePic } = profile;

//   return (
//     <div
//       className="flex items-center p-3 rounded-md bg-gray-200 hover:bg-gray-50 w-full min-w-max"
//       onClick={onClick}
//     >
//       {/* <Avatar src={profilePic} sx={{ width: 36, height: 36 }} /> */}
//       <Typography fontWeight="medium">
//         {firstName} {lastName}
//       </Typography>
//       <Box flexGrow={1} />
//     </div>
//   );
// };

// export default UserRow;
