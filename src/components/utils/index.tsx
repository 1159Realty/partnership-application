import { MobileH2MGray900 } from "@/utils/typography";
import { PageTitleBtnWrapper } from "./utils.styles";
import { ChildrenProps } from "@/utils/global-types";
import { X } from "@phosphor-icons/react/dist/ssr";
import { COLORS } from "@/utils/colors";
import { IconButton } from "../buttons";

interface Props extends ChildrenProps {
  hideCancel?: boolean;
  handleClick?: () => void;
}

export const PageTitleBtn = ({ children, hideCancel, handleClick }: Props) => {
  return (
    <PageTitleBtnWrapper>
      {!hideCancel && (
        <IconButton custom_size="30px" onClick={handleClick} bg_color={COLORS.gray300}>
          <X weight="bold" color={COLORS.gray900} />{" "}
        </IconButton>
      )}
      <MobileH2MGray900>{children}</MobileH2MGray900>
    </PageTitleBtnWrapper>
  );
};
