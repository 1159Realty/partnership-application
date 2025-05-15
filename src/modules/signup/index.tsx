import { Box, Stack } from "@mui/material";
import Logo from "@/assets/images/logo.svg";
import Image from "next/image";
import { MobileCap2MGray500, MobileH2SMGray900 } from "@/utils/typography";
import { SignUpForm } from "./SignupForm";
import FooterLink from "@/components/layout/FooterLink";

const SignUp = () => {
  return (
    <Box mt="60px" maxWidth={"400px"} mx="auto" px="16px" width={"100%"}>
      <Stack alignItems={"center"} justifyContent={"center"} textAlign={"center"} spacing={"8px"}>
        <Image style={{ borderRadius: "9px" }} width={60} height={55} src={Logo} alt="logo" />
        <MobileH2SMGray900>Create an account</MobileH2SMGray900>
        <MobileCap2MGray500>Enter your details below correctly</MobileCap2MGray500>
      </Stack>
      <SignUpForm />
      <FooterLink />
    </Box>
  );
};

export { SignUp };
