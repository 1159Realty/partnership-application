import { NeutralLinks } from "@/utils/constants";
import { SideLinkWrapper, SidePanelFooterLink, SidePanelFooterLinks } from "./layout.styles";

export default function FooterLink() {
  return (
    <SideLinkWrapper>
      <SidePanelFooterLinks>
        {NeutralLinks.map((x) => (
          <SidePanelFooterLink key={x.route} href={x.route}>
            {x.label}
          </SidePanelFooterLink>
        ))}
      </SidePanelFooterLinks>
    </SideLinkWrapper>
  );
}
