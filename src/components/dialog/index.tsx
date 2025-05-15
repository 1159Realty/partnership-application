"use client";
import { AnimatePresence } from "framer-motion";
import { X } from "@phosphor-icons/react/dist/ssr";
import { DialogBackdrop, DialogContentWrapper, ModalCloseBtn } from "./dialog.styles";
import { fadeVariants } from "@/utils/animation-variants";
import { COLORS } from "@/utils/colors";
import { useCallback, useEffect } from "react";

export interface GenericDialogProps {
  isOpen: boolean;
  onClose?: () => void;
  disableOverlayClick?: boolean;
  disableEsc?: boolean;
  showCloseButton?: boolean;
}

interface Props extends GenericDialogProps {
  children: React.ReactNode;
}

const dialogVariants = {
  open: { y: 0, transition: { type: "tween", stiffness: 350, damping: 27 } },
  closed: { y: "-100%", transition: { type: "tween", stiffness: 350, damping: 27 } },
};

const Dialog = ({ children, isOpen, onClose, disableOverlayClick, disableEsc, showCloseButton }: Props) => {
  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  const handleKeyDown = useCallback(
    (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    },
    [handleClose]
  );

  const handleOverlayClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget && !disableOverlayClick) {
      handleClose();
    }
  };

  useEffect(() => {
    if (disableEsc) return;
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleClose, handleKeyDown, isOpen, disableEsc]);

  return (
    <AnimatePresence>
      {isOpen && (
        <DialogBackdrop
          key={`${isOpen}`}
          variants={fadeVariants}
          initial="closed"
          animate={"open"}
          exit={"closed"}
          onClick={handleOverlayClick}
          aria-labelledby="Modal backdrop"
        >
          <DialogContentWrapper
            variants={dialogVariants}
            initial="closed"
            animate={"open"}
            exit={"closed"}
            aria-labelledby="Side panel mobile"
            aria-hidden={!isOpen}
            key={isOpen ? 1 : 2}
          >
            {showCloseButton && (
              <ModalCloseBtn whileHover={{ scale: 1.1 }} whileTap={{ scale: 1.1 }} onClick={handleClose}>
                <X color={COLORS.gray800} />
              </ModalCloseBtn>
            )}

            {children}
          </DialogContentWrapper>
        </DialogBackdrop>
      )}
    </AnimatePresence>
  );
};

export { Dialog };
