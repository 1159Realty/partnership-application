import { Button } from "@/components/buttons";
import { COLORS } from "@/utils/colors";
import { Font50018125p, MobileH4SM } from "@/utils/typography";
import { Stack } from "@mui/material";
import { Dog } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

function Notfound() {
  return (
    <Stack
      color={COLORS.blackNormal}
      spacing={"24px"}
      height={"70vh"}
      width={"100%"}
      alignItems={"center"}
      justifyContent={"center"}
      textAlign={"center"}
      px="20px"
    >
      <Dog weight="duotone" size={100} />
      <MobileH4SM>Page Not Found</MobileH4SM>

      <Font50018125p>
        Woof! The page you&apos;re looking for does not exist.
        <br /> Let bingo help you find your way back.
      </Font50018125p>

      <Link href={"/"}>
        <Button endIcon={<Dog weight="fill" />}>Back Home</Button>
      </Link>
    </Stack>
  );
}

export { Notfound };
