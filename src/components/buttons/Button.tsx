import { ButtonProps } from "@mui/material";

// Styles
import { ArrowBackButton, StyledButton } from "./button.styles";
import { MobileB1SM } from "@/utils/typography";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

interface Props extends ButtonProps {
  not_rounded?: boolean;
  width?: string;
  height?: string;
  padding?: string;
}

const Button = ({ children, not_rounded, width, height, padding, sx, ...props }: Props) => {
  return (
    <StyledButton
      variant="contained"
      color="secondary"
      disableElevation
      not_rounded={not_rounded ? `${not_rounded}` : undefined}
      sx={{ width, height, padding, ...sx }}
      {...props}
    >
      <MobileB1SM> {children}</MobileB1SM>
    </StyledButton>
  );
};

<Button variant="contained" color="info" disableElevation={false} sx={{ borderRadius: "5px!important", p: "5px 12px" }}>
  Release
</Button>;

const GoBackButton = () => {
  return (
    <ArrowBackButton>
      <MobileB1SM>
        <ArrowLeft size={32} />
      </MobileB1SM>
    </ArrowBackButton>
  );
};

export { Button, GoBackButton };
