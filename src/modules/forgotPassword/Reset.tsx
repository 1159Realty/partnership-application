import { Box, Stack } from "@mui/material";
import Logo from "@/assets/images/logo.svg";
import Image from "next/image";
import { MobileCap2MGray500, MobileH2SMGray900 } from "@/utils/typography";
import { ResetPasswordForm } from "./ResetForm";

interface Props {
  userId: string;
  token: string;
}

const ResetPassword = ({ userId, token }: Props) => {
  return (
    <Box mt="60px" maxWidth={"400px"} mx="auto" px="16px" width={"100%"}>
      <Stack alignItems={"center"} justifyContent={"center"} textAlign={"center"} spacing={"8px"}>
        <Image style={{ borderRadius: "9px" }} width={60} height={55} src={Logo} alt="logo" />
        <MobileH2SMGray900>Let&apos;s help you reset your password</MobileH2SMGray900>
        <MobileCap2MGray500>Enter a new password</MobileCap2MGray500>
      </Stack>
      <ResetPasswordForm userId={userId} token={token} />
    </Box>
  );
};

export { ResetPassword };
