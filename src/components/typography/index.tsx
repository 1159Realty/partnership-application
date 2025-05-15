import { HiddenOnDesktop, HiddenOnMobile } from "@/styles/globals.styles";
import { COLORS } from "@/utils/colors";
import { MobileH2SMGray900, MobileH3SMGray900 } from "@/utils/typography";
import { BoxProps, Stack } from "@mui/material";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

interface Props extends BoxProps {
  backUrl?: string;
}

export const PageTitle = ({ children, backUrl, ...etc }: Props) => {
  const showBackButton = Boolean(backUrl?.trim());
  return (
    <>
      <HiddenOnDesktop {...etc}>
        {showBackButton ? (
          <Stack spacing={"10px"} direction={"row"} alignItems={"center"} justifyContent={"center"}>
            <Link href={backUrl!}>
              <Stack
                borderRadius={"5px"}
                justifyContent={"center"}
                alignItems={"center"}
                width={25}
                height={25}
                bgcolor={COLORS.greenNormal}
              >
                <ArrowLeft size={20} weight="fill" cursor={"pointer"} color="white" />{" "}
              </Stack>
            </Link>
            <MobileH2SMGray900>{children}</MobileH2SMGray900>
          </Stack>
        ) : (
          <MobileH2SMGray900>{children}</MobileH2SMGray900>
        )}
      </HiddenOnDesktop>
      <HiddenOnMobile {...etc}>
        {showBackButton ? (
          <Stack spacing={"10px"} direction={"row"} alignItems={"center"} justifyContent={"center"}>
            <Link href={backUrl!}>
              <Stack
                borderRadius={"5px"}
                justifyContent={"center"}
                alignItems={"center"}
                width={25}
                height={25}
                bgcolor={COLORS.greenNormal}
              >
                <ArrowLeft size={20} weight="fill" cursor={"pointer"} color="white" />{" "}
              </Stack>
            </Link>
            <MobileH3SMGray900>{children}</MobileH3SMGray900>
          </Stack>
        ) : (
          <MobileH3SMGray900>{children}</MobileH3SMGray900>
        )}
      </HiddenOnMobile>
    </>
  );
};
