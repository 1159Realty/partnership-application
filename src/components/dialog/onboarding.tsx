"use client";

import React from "react";
import { Dialog } from ".";
import {
  GenericDialogWrapper,
  OnboardingDialogEditIconWrapper,
  OnboardingDialogMessage,
  OnboardingDialogTitle,
  OnboardingDialogWrapper,
} from "./dialog.styles";
import { ShakeWrapper } from "@/styles/globals.styles";
import { UserCheck } from "@phosphor-icons/react/dist/ssr";
import { COLORS } from "@/utils/colors";
import { Button } from "../buttons";
import { useUserContext } from "@/contexts/UserContext";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { getClientSession } from "@/lib/session/client";

const OnboardingDialog = () => {
  const { userData } = useUserContext();
  const { showOnboardingForm, setShowOnboardingForm } = useGlobalContext();
  const isAuthenticated = getClientSession();

  return (
    <Dialog disableOverlayClick disableEsc isOpen={Boolean(isAuthenticated && !userData?.isCompleted && !showOnboardingForm)}>
      <GenericDialogWrapper>
        <OnboardingDialogWrapper>
          <OnboardingDialogEditIconWrapper>
            <ShakeWrapper>
              <UserCheck size={48} weight="bold" color={COLORS.blackNormal} />
            </ShakeWrapper>
          </OnboardingDialogEditIconWrapper>
          <OnboardingDialogTitle>Set up your profile</OnboardingDialogTitle>
          <OnboardingDialogMessage>
            Setting up your account account helps us create perfect user experience for you
          </OnboardingDialogMessage>
          <div className="mt-8">
            <Button
              onClick={() => {
                setShowOnboardingForm(true);
              }}
              fullWidth
            >
              Set Now
            </Button>
          </div>
        </OnboardingDialogWrapper>
      </GenericDialogWrapper>
    </Dialog>
  );
};

export { OnboardingDialog };
