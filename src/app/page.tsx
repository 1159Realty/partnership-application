import { HomeWrapper } from "@/modules/home/home.styles";
import QrScanner from "@/modules/qrCodeScanner";

export default async function Home() {
  return (
    <HomeWrapper>
      <QrScanner />
    </HomeWrapper>
  );
}
