import React from "react";

// Styles
import { StyledLoadingButton } from "./button.styles";
import { MobileB1SMBlackNormal } from "@/utils/typography";
import { LoadingButtonProps } from "@mui/lab";

interface Props extends LoadingButtonProps {
  not_rounded?: boolean;
}

const LoadingButton = ({ children, not_rounded, ...props }: Props) => {
  return (
    <StyledLoadingButton
      fullWidth
      loadingPosition="end"
      variant="contained"
      color="secondary"
      disableElevation
      not_rounded={not_rounded ? `${not_rounded}` : undefined}
      {...props}
    >
      <MobileB1SMBlackNormal> {children}</MobileB1SMBlackNormal>
    </StyledLoadingButton>
  );
};

export { LoadingButton };
