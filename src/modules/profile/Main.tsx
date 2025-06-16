"use client";
import { Avatar } from "@/components/avatar";
import { Divider } from "@/components/divider";
import { StatusPill } from "@/components/pills";
import { COLORS } from "@/utils/colors";
import { Font5001421Gray900, MobileB1LightGray900, MobileCap2MGray600, MobileH1SMGray900 } from "@/utils/typography";
import { Box, Stack } from "@mui/material";
import React, { useState } from "react";
import { ProfileDetailWrapper } from "./styles";
import { Button, IconButton } from "@/components/buttons";
import { UpdateProfileForm } from "@/components/forms/UpdateProfileForm";
import { PageTitle } from "@/components/typography";
import { useSession } from "@/lib/session/client/useSession";
import { ConfirmationDialog } from "@/components/dialog/Confirmation";
import { useUserContext } from "@/contexts/UserContext";
import { capitalize, capitalizeAndSpace, phoneNumberToReferralId } from "@/services/string";
import { getRole, hasPermission } from "@/lib/session/roles";
import { Bank, Copy, Pencil } from "@phosphor-icons/react/dist/ssr";
import { Share } from "@/components/share";
import { WEB_APP_URL } from "@/utils/constants";
import { Handshake } from "@phosphor-icons/react";
import { UpdateBankAccountForm } from "@/components/forms/UpdateBankAccountForm";
import { usePartners } from "@/lib/api/partners/usePartners";
import { useAlertContext } from "@/contexts/AlertContext";
import { Tooltip } from "@/components/tooltip";

function Main() {
  const { userData } = useUserContext();
  const { setAlert } = useAlertContext();

  const { requestPartnerShip } = usePartners();
  const { updateSession } = useSession();
  const { logout } = useSession();

  const [showEdit, setShowEdit] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showBankAccountForm, setShowBankAccountForm] = useState<boolean>(false);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [loadingPartnership, setLoadingPartnership] = useState(false);

  const role = getRole(userData?.roleId);
  const isAgent = role === "agent";

  const toggleEdit = () => {
    setShowEdit(!showEdit);
  };

  const handleLogout = () => {
    setLoading(true);
    logout();
  };

  async function confirmRequestPartnership() {
    setLoadingPartnership(true);
    const res = await requestPartnerShip();
    if (res) {
      updateSession(res?.client);
      setAlert({
        message: "Partnership request acknowledged",
        severity: "success",
        show: true,
      });
      setShowPartnershipModal(false);
    }
    setLoadingPartnership(false);
  }

  return (
    <Box>
      <Stack rowGap={"10px"} mb="32px" flexWrap={"wrap"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <PageTitle mr={"5px"}>Profile</PageTitle>

        <IconButton onClick={() => setShowBankAccountForm(true)}>
          <Bank />
        </IconButton>
      </Stack>

      <Stack spacing={"15px"} justifyContent={"center"} alignItems={"center"}>
        <Avatar size="100px" src={userData?.profilePic || ""} />
        <Stack spacing={"5px"} justifyContent={"center"} alignItems={"center"}>
          <MobileH1SMGray900 style={{ cursor: "pointer" }} onClick={toggleEdit}>
            {userData?.firstName || ""} {userData?.lastName || ""}{" "}
            <Pencil onClick={toggleEdit} cursor={"pointer"} weight="duotone" />
          </MobileH1SMGray900>
          <MobileCap2MGray600>{userData?.email || ""}</MobileCap2MGray600>
        </Stack>
        {role !== "client" && (
          <StatusPill p="5px 15px!important" sx={{ borderRadius: "100px!important" }} status="warning">
            {capitalize(role)}
          </StatusPill>
        )}
        {hasPermission(userData?.roleId, "create:partnership") && (
          <Tooltip title="Partnership request received. We'll be in touch shortly.">
            <span>
              <Button
                onClick={() => setShowPartnershipModal(true)}
                startIcon={<Handshake weight="fill" />}
                color="info"
                disableElevation={false}
                not_rounded
                padding="5px 12px"
                disabled={userData?.requestPartnership}
              >
                Become a partner
              </Button>
            </span>
          </Tooltip>
        )}
      </Stack>

      <Box mx="auto" maxWidth={"600px"} my="24px">
        <Divider border={`1px solid ${COLORS.gray200}`} />
        <ProfileDetailWrapper>
          <Stack spacing={"8px"}>
            <MobileB1LightGray900>Phone number</MobileB1LightGray900>
            <MobileB1LightGray900>Gender</MobileB1LightGray900>
            <MobileB1LightGray900>State</MobileB1LightGray900>
            <MobileB1LightGray900>Residential address</MobileB1LightGray900>
            {isAgent && <MobileB1LightGray900>Referral link</MobileB1LightGray900>}
          </Stack>
          <Stack spacing={"8px"}>
            <Font5001421Gray900>{userData?.phoneNumber}</Font5001421Gray900>
            <Font5001421Gray900>{capitalizeAndSpace(userData?.gender || "") || "N/A"}</Font5001421Gray900>
            <Font5001421Gray900>{userData?.state?.state || "N/A"}</Font5001421Gray900>{" "}
            <Font5001421Gray900>{userData?.residentialAddress?.trim() || "N/A"}</Font5001421Gray900>
            {isAgent && (
              <Font5001421Gray900>
                <Share value={`${WEB_APP_URL}/?referralId=${phoneNumberToReferralId(userData?.phoneNumber || "")}`}>
                  <Copy weight="bold" cursor={"pointer"} />
                </Share>
              </Font5001421Gray900>
            )}
          </Stack>
        </ProfileDetailWrapper>
        <Box mx="auto" maxWidth={"300px"} mt="32px">
          <Button onClick={() => setShowLogout(true)} fullWidth variant="outlined">
            Logout
          </Button>
        </Box>
      </Box>
      <UpdateProfileForm isOpen={showEdit} onClose={toggleEdit} />
      <ConfirmationDialog
        message="Are you sure you want to log out?"
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        loading={loading}
      />

      <ConfirmationDialog
        message="Are you sure you want to log out?"
        isOpen={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={handleLogout}
        loading={loading}
      />

      <ConfirmationDialog
        message="Do you want to become a partner and earn commissions when you close deals?"
        isOpen={showPartnershipModal}
        onClose={() => setShowPartnershipModal(false)}
        onConfirm={confirmRequestPartnership}
        loading={loadingPartnership}
        confirmText="Yes"
        declineText="No"
      />

      <UpdateBankAccountForm isManualOpen={showBankAccountForm} onManualClose={() => setShowBankAccountForm(false)} />
    </Box>
  );
}

export { Main };
