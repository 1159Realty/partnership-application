"use client";

import { Backdrop, HiddenOnDesktop, HiddenOnMobile } from "@/styles/globals.styles";
import { fadeVariants } from "@/utils/animation-variants";
import { AnimatePresence } from "framer-motion";
import React, { useCallback, useEffect } from "react";
import { DrawerWrapper } from "./drawer.styles";
import { ChildrenProps } from "@/utils/global-types";
import { IconButton } from "../buttons";
import { X } from "@phosphor-icons/react/dist/ssr";
import { COLORS } from "@/utils/colors";
import { Box } from "@mui/material";

interface Props extends ChildrenProps {
  isOpen: boolean;
  handleClose?: () => void;
  hideCloseButton?: boolean;
  disableOverlayClick?: boolean;
  disableEsc?: boolean;
}

export const desktopVariants = {
  open: { x: 0, transition: { type: "tween", stiffness: 350, damping: 27 } },
  closed: { x: "100%", transition: { type: "tween", stiffness: 350, damping: 27 } },
};

export const mobileVariants = {
  open: { y: 0, transition: { type: "tween", stiffness: 350, damping: 27 } },
  closed: { y: "100%", transition: { type: "tween", stiffness: 350, damping: 27 } },
};

const Drawer = ({ isOpen, handleClose, children, hideCloseButton, disableEsc, disableOverlayClick }: Props) => {
  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !disableOverlayClick) {
      onClose();
    }
  };

  const onClose = useCallback(() => {
    handleClose?.();
  }, [handleClose]);

  const handleKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (disableEsc) return;
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [disableEsc, handleKeyDown, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <Backdrop
          aria-hidden="true"
          variants={fadeVariants}
          initial="closed"
          animate={"open"}
          exit={"closed"}
          onClick={handleOverlayClick}
          aria-labelledby="Side panel backdrop"
          key={isOpen ? 1 : 2}
        >
          <HiddenOnDesktop>
            <DrawerWrapper
              variants={mobileVariants}
              initial="closed"
              animate={"open"}
              exit={"closed"}
              aria-labelledby="Side panel mobile"
              aria-hidden={!isOpen}
              key={isOpen ? 1 : 2}
            >
              {!hideCloseButton && (
                <Box width={"fit-content"} position={"sticky"} top={10} left={10} zIndex={1}>
                  <IconButton bg_color={COLORS.gray200} onClick={onClose}>
                    <X color={COLORS.blackNormal} />
                  </IconButton>
                </Box>
              )}
              {children}
            </DrawerWrapper>
          </HiddenOnDesktop>

          <HiddenOnMobile>
            <DrawerWrapper
              variants={desktopVariants}
              initial="closed"
              animate={"open"}
              exit={"closed"}
              aria-labelledby="Side panel mobile"
              aria-hidden={!isOpen}
              key={isOpen ? 1 : 2}
            >
              {children}
            </DrawerWrapper>
          </HiddenOnMobile>
        </Backdrop>
      )}
    </AnimatePresence>
  );
};

export { Drawer };
