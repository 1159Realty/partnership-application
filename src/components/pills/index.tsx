import React from "react";
import { ButtonPillWrapper, PillBadge, PillWithBadgeWrapper, PillWrapper, StatusPillWrapper } from "./pill.styles";
import { BoxProps, Stack } from "@mui/material";
import { COLORS, Severity, SEVERITY_COLORS } from "@/utils/colors";
import { transparentize } from "polished";
import { Check, Warning } from "@phosphor-icons/react";
import { CircleNotch } from "@phosphor-icons/react/dist/ssr";
import { MobileB1M } from "@/utils/typography";

function Pill({ children, ...props }: BoxProps) {
  return (
    <PillWrapper width={"fit-content"} color={COLORS.whiteNormal} bgcolor={transparentize(0.5, COLORS.blackNormal)} {...props}>
      {children}
    </PillWrapper>
  );
}

interface StatusPillProps extends BoxProps {
  status: Severity;
}

function StatusPill({ status, children, ...props }: StatusPillProps) {
  const { light, dark } = SEVERITY_COLORS[status];
  return (
    <StatusPillWrapper width={"fit-content"} color={dark} bgcolor={light} {...props}>
      {children}
    </StatusPillWrapper>
  );
}

interface StatusPillWithIconProps extends BoxProps {
  status: Severity;
  label?: string;
}

function StatusPillWithIcon({ status, label }: StatusPillWithIconProps) {
  if (status === "danger") {
    return (
      <StatusPill status="danger">
        <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
          <Warning weight="bold" /> <span>{label || "Overdue"}</span>
        </Stack>
      </StatusPill>
    );
  }
  if (status === "success") {
    return (
      <StatusPill status="success">
        <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
          <Check weight="bold" /> <span>{label || "Paid"}</span>
        </Stack>
      </StatusPill>
    );
  }
  return (
    <StatusPill status="warning">
      <Stack direction={"row"} spacing={"3px"} alignItems={"center"}>
        <CircleNotch weight="bold" /> <span>{label || "Pending"}</span>
      </Stack>
    </StatusPill>
  );
}

interface ButtonPillProps extends BoxProps {
  bg_color?: string;
}

function ButtonPill({ bg_color, children, ...props }: ButtonPillProps) {
  return (
    <ButtonPillWrapper bgcolor={COLORS.gray200 || bg_color} {...props}>
      {children}
    </ButtonPillWrapper>
  );
}

interface PillWithBadgeProps {
  text: string;
  badgeValue?: number;
  isActive: boolean;
  onClick?: () => void;
}

function PillWithBadge({ text, badgeValue, isActive, onClick }: PillWithBadgeProps) {
  return (
    <PillWithBadgeWrapper isActive={isActive} onClick={() => onClick?.()}>
      <MobileB1M>{text}</MobileB1M>
      {Boolean(badgeValue) && <PillBadge>{badgeValue}</PillBadge>}
    </PillWithBadgeWrapper>
  );
}

export { Pill, StatusPill, ButtonPill, StatusPillWithIcon, PillWithBadge };
