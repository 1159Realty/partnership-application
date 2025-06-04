import { Button } from "@/components/buttons";
import { COLORS } from "@/utils/colors";
import { Font50018125p, MobileH4SM } from "@/utils/typography";
import { Stack } from "@mui/material";
import { Plugs } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

function NotAvailable() {
  // TODO: Add support number
  const whatsappNumber = "8061747003"; // No + or spaces
  const message = "Hello, I encountered an error while using your web application...";
  const encodedMessage = encodeURIComponent(message);

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
      <Plugs weight="duotone" size={100} />
      <MobileH4SM>Temporarily Unavailable</MobileH4SM>

      <Font50018125p>
        We’re working on resolving this. <br />
        Please try again later or return home.
      </Font50018125p>
      <Stack alignItems={"center"} direction={"row"}>
        <Link href={"/"}>
          <Button variant="outlined" sx={{ mr: "20px" }}>
            Back Home
          </Button>
        </Link>
        <Link href={`https://wa.me/${whatsappNumber}?text=${encodedMessage}`} target="_blank" rel="noopener noreferrer">
          <Button>Contact us</Button>
        </Link>
      </Stack>
    </Stack>
  );
}

export { NotAvailable };
