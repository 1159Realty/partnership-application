"use client";
import { useCallback, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";

import {
  StyledMobileSidePanel,
  SidePanelWrapper,
  StyledPanelItem,
  PanelItemsWrapper,
  StyledDesktopSidePanel,
  SidePanelFooterLinks,
  SidePanelFooterLink,
} from "./layout.styles";

import { useGlobalContext } from "@/contexts/GlobalContext";

import Logo from "../../assets/images/logo.svg";
import { MobileB2MGray700, MobileB2MGray900 } from "@/utils/typography";
import { usePathname } from "next/navigation";
import { fadeVariants } from "@/utils/animation-variants";
import { Backdrop } from "@/styles/globals.styles";
import { useUserContext } from "@/contexts/UserContext";
import { IPanelItem, NeutralLinks } from "@/utils/constants";
import { getRoleRoutes, ROLE_PAIR } from "@/lib/session/roles";

interface SidePanelContentProps {
  onClose?: () => void;
}

const SidePanelContent = ({ onClose }: SidePanelContentProps) => {
  const pathname = usePathname();
  const { userData } = useUserContext();

  return (
    <SidePanelWrapper>
      <Image alt="Logo" width={40} height={40} src={Logo} />
      <PanelItemsWrapper>
        {userData?.roleId &&
          getRoleRoutes(ROLE_PAIR[userData?.roleId]).map((pi) => (
            <PanelItem
              onClose={onClose}
              key={pi.route}
              item={pi}
              isActive={(pi.route === "/" && pathname === "/") || (pathname.includes(pi.route) && pi.route !== "/")}
            />
          ))}
      </PanelItemsWrapper>
      <SidePanelFooterLinks>
        {NeutralLinks.map((x) => (
          <SidePanelFooterLink
            key={x.route}
            href={x.route}
            active={`${(x.route === "/" && pathname === "/") || (pathname.includes(x.route) && x.route !== "/")}`}
          >
            {x.label}
          </SidePanelFooterLink>
        ))}
      </SidePanelFooterLinks>
    </SidePanelWrapper>
  );
};

interface PanelItemProps {
  item: IPanelItem;
  isActive: boolean;
  onClose?: () => void;
}

const PanelItem = ({ item, isActive, onClose }: PanelItemProps) => {
  const { Icon, label, route } = item;

  return (
    <StyledPanelItem onClick={() => onClose?.()} active={`${isActive}`} href={route}>
      <Icon size={24} weight="bold" />{" "}
      {isActive ? <MobileB2MGray900>{label}</MobileB2MGray900> : <MobileB2MGray700>{label}</MobileB2MGray700>}
    </StyledPanelItem>
  );
};

const drawerVariants = {
  open: { x: 0, transition: { type: "tween", stiffness: 350, damping: 27 } },
  closed: { x: "-100%", transition: { type: "tween", stiffness: 350, damping: 27 } },
};

const DesktopSidePanel = () => {
  return (
    <StyledDesktopSidePanel aria-labelledby="Side panel desktop">
      <SidePanelContent />
    </StyledDesktopSidePanel>
  );
};

const MobileSidePanel = () => {
  const { showMenu, setShowMenu } = useGlobalContext();

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const onClose = useCallback(() => {
    setShowMenu(false);
  }, [setShowMenu]);

  const handleKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown, onClose, setShowMenu]);

  return (
    <AnimatePresence>
      {showMenu && (
        <Backdrop
          aria-hidden="true"
          variants={fadeVariants}
          initial="closed"
          animate={"open"}
          exit={"closed"}
          onClick={handleOverlayClick}
          aria-labelledby="Side panel backdrop"
          key={showMenu ? 1 : 2}
        >
          <StyledMobileSidePanel
            variants={drawerVariants}
            initial="closed"
            animate={"open"}
            exit={"closed"}
            aria-labelledby="Side panel mobile"
            aria-hidden={!showMenu}
            key={showMenu ? 1 : 2}
          >
            <SidePanelContent onClose={onClose} />
          </StyledMobileSidePanel>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export { MobileSidePanel, DesktopSidePanel };
