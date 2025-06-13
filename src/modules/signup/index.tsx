import { Box, Stack } from "@mui/material";
import Logo from "@/assets/images/logo.svg";
import Image from "next/image";
import { MobileH2SMGray900 } from "@/utils/typography";
import { SignUpForm } from "./SignupForm";
import FooterLink from "@/components/layout/FooterLink";
import { GoogleButton } from "@/components/buttons/GoogleButton";
import Divider from "@mui/material/Divider";
import { COLORS } from "@/utils/colors";

const SignUp = () => {
  return (
    <Box mt="60px" maxWidth={"400px"} mx="auto" px="16px" width={"100%"}>
      <Stack alignItems={"center"} justifyContent={"center"} textAlign={"center"} spacing={"8px"}>
        <Image style={{ borderRadius: "9px" }} width={60} height={55} src={Logo} alt="logo" />
        <MobileH2SMGray900>Create an account</MobileH2SMGray900>
      </Stack>

      <Stack mt="20px" spacing={"20px"}>
        <GoogleButton />
        <Divider sx={{ color: COLORS.gray600, mt: 1 }}>OR</Divider>
        <SignUpForm />
      </Stack>
      <FooterLink />
    </Box>
  );
};

export { SignUp };
