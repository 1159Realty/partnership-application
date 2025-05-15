import MuiPopper from "@mui/material/Popper";
import { ReactNode } from "react";

interface Props {
  anchorEl: null | HTMLElement;
  children: ReactNode;
}

function Popper({ anchorEl, children }: Props) {
  return (
    <MuiPopper id="ele" sx={{ zIndex: 1000000 }} placement="bottom-start" open={Boolean(anchorEl)} anchorEl={anchorEl} transition>
      {children}
    </MuiPopper>
  );
}

export { Popper };
