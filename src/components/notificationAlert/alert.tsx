"use client";

import { AnimatePresence } from "framer-motion";
import { AlertWrapper } from "./styles";
import { Alert } from "@mui/material";
import { IconButton } from "../buttons";
import { BellRinging, X } from "@phosphor-icons/react/dist/ssr";
import { useNotificationContext } from "@/contexts/NotificationContext";
import { useNotificationAlert } from "../../hooks/useNotificationAlert";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/utils/constants";

export const slideVariants = {
  open: { y: 0, transition: { type: "tween", stiffness: 350, damping: 27 } },
  closed: { y: "-100%", transition: { type: "tween", stiffness: 350, damping: 27 } },
};

function NotificationAlert() {
  const { newNotification } = useNotificationContext();
  const { content, setContent } = useNotificationAlert(newNotification);

  const { push } = useRouter();

  return (
    <AnimatePresence>
      {Boolean(content) ? (
        <AlertWrapper
          onClick={() => push(ROUTES["/notifications"])}
          variants={slideVariants}
          initial="closed"
          animate={"open"}
          exit={"closed"}
          key={Boolean(content) ? 1 : 2}
        >
          <Alert
            action={
              <IconButton
                aria-label="close"
                bg_color="#f1e8bf"
                size="small"
                onClick={() => {
                  setContent(null);
                }}
              >
                <X fontSize="inherit" color="red" />
              </IconButton>
            }
            icon={<BellRinging />}
            severity="warning"
          >
            {content?.title}
          </Alert>
        </AlertWrapper>
      ) : null}
    </AnimatePresence>
  );
}

export default NotificationAlert;
