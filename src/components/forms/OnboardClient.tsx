"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { AutoComplete, FileUpload, Select, TextField } from "@/components/Inputs";
import { useGlobalContext } from "@/contexts/GlobalContext";
import { GENDERS, INVITATIONSOURCES, User, UserFormPayload, UserPayload } from "@/lib/api/user/user.types";
import { useEffect, useState } from "react";
import { ValidationError } from "@/services/validation/zod";
import { FileType } from "@/lib/api/file-upload/file-upload.types";
import { Box, InputAdornment } from "@mui/material";
import { ErrorText } from "@/utils/typography";
import { useUser } from "@/lib/api/user/useUser";
import { useAlertContext } from "@/contexts/AlertContext";
import { LoadingButton } from "../buttons";
import { ApiResult } from "@/utils/global-types";
import { useSession } from "@/lib/session/client/useSession";
import { useUserContext } from "@/contexts/UserContext";
import { useLocation } from "@/lib/api/location/useLocation";
import { IState } from "@/lib/api/location/location.types";
import { capitalizeAndSpace } from "@/services/string";
import { Divider } from "../divider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export interface UserFormState {
  error: ValidationError<UserPayload>;
  result: ApiResult<User>;
}

const ClientOnboarding = () => {
  const initialState: UserFormState = {
    error: {},
    result: null,
  };

  const { showOnboardingForm, setShowOnboardingForm } = useGlobalContext();
  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const searchParams = useSearchParams();
  const referralId = searchParams.get("referralId");
  const router = useRouter();
  const pathname = usePathname();

  const { updateSession } = useSession();

  const { onboardUser } = useUser();
  const { fetchStates } = useLocation();

  const [states, setStates] = useState<IState[] | null>(null);
  // const [lgas, setLgas] = useState<ILga[] | null>([]);

  const [formState, setFormState] = useState<UserFormPayload>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState<ValidationError<UserPayload>>({});
  const [loading, setLoading] = useState(false);

  const [files, setFiles] = useState<FileType[]>([]);

  const onClose = () => {
    setShowOnboardingForm(false);
  };

  async function handleSubmit() {
    const payload: UserFormPayload = { ...formState, referralId: referralId || undefined };
    payload.profilePic = files[0];

    setLoading(true);
    const { error, result } = await onboardUser(initialState, payload);

    if (result && typeof result === "object") {
      updateSession(result);
      setAlert({ message: "Bio data saved", show: true, severity: "success" });
      setShowOnboardingForm(false);
      router.push(pathname);
    } else {
      if (error.requestError) {
        setAlert({ message: error.requestError, show: true, severity: "error" });
        delete error.requestError;
      } else if (Object.keys(error).length) {
        setError(error);
        setAlert({ message: "Complete the required fields", show: true, severity: "error" });
      }
    }
    setLoading(false);
  }

  function handleChange(field: keyof UserPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof UserPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  useEffect(() => {
    async function populateStates() {
      if (!userData) return;
      const s = await fetchStates();
      setStates(s);
    }

    populateStates();
  }, [fetchStates, userData]);

  // useEffect(() => {
  //   if (!formState?.stateId) return;
  //   async function populateLgas() {
  //     if (!formState?.stateId) return;
  //     const response = await fetchLgas(formState?.stateId);
  //     setLgas(response);
  //   }

  //   populateLgas();
  // }, [fetchLgas, formState?.stateId]);

  useEffect(() => {
    async function populateFormState() {
      if (!userData) {
        setFiles([]);
        return;
      }
      setFormState({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        residentialAddress: userData.residentialAddress || "",
        profilePic: userData?.profilePic || "",
        stateId: userData?.state?.id || "",
        lgaId: userData?.lga?.id || "",
        gender: userData?.gender || "",
        trafficSource: userData?.trafficSource || "",
      });

      if (userData.profilePic) {
        const response = await fetch(userData.profilePic);
        const blob = await response?.blob();

        const photo: FileType = new File([blob], `user_${userData?.id}`, {
          type: blob.type,
          lastModified: Date.now(),
        });
        // Add custom properties to the file
        photo.preview = URL.createObjectURL(blob);

        setFiles([photo]);
      }
    }

    populateFormState();
  }, [userData]);

  return (
    <Drawer isOpen={showOnboardingForm} handleClose={onClose}>
      <div className="mt-16">
        <div className="mb-6">
          <Box px="16px">
            <PageTitleBtn hideCancel>Update your profile</PageTitleBtn>
          </Box>

          <div className="flex flex-col gap-4 mt-8">
            <Box px="16px">
              <TextField
                onChange={(e) => handleChange("firstName", e.target.value)}
                name="firstName"
                value={formState?.firstName}
                label="First name"
              />
              {error?.firstName?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box px="16px">
              <TextField
                onChange={(e) => handleChange("lastName", e.target.value)}
                name="lastName"
                value={formState?.lastName}
                label="Last name"
              />
              {error?.lastName?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box px="16px">
              <TextField
                onChange={(e) => handleChange("phoneNumber", e.target.value)}
                name="phoneNumber"
                value={formState?.phoneNumber}
                label="Phone number"
                slotProps={{
                  input: {
                    startAdornment: <InputAdornment position="start">+234</InputAdornment>,
                  },
                }}
              />
              {error?.phoneNumber?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box px="16px">
              <Select
                label="Gender"
                items={GENDERS.map((g) => ({ id: g, label: capitalizeAndSpace(g) }))}
                onChange={(e) => {
                  handleChange("gender", e.target.value as string);
                }}
                name="gender"
                value={formState?.gender}
              />
              {error?.gender?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Divider />

            <Box px="16px">
              <AutoComplete
                fullWidth
                isOptionEqualToValue={(option, value) => option.id === value.id}
                options={(states || []).map((s) => ({ label: s.state, id: s.id }))}
                renderInputLabel="State"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_, value: any) => {
                  if (value.id) {
                    handleChange("stateId", value.id);
                  }
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onInputChange={(_, value: any) => {
                  if (!value) {
                    handleChange("stateId", undefined);
                  }
                }}
                value={(states || []).find((s) => s.id === formState?.stateId)?.state || ""}
              />
              {error?.stateId?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            {/* <Box px="16px">
              <AutoComplete
                options={(lgas || []).map((lga) => ({ label: lga.lga, id: lga.id }))}
                renderInputLabel="Lga"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                onChange={(_, value: any) => {
                  handleChange("lgaId", value.id);
                }}
                value={(lgas || []).find((lga) => lga.id === formState?.lgaId)?.lga || ""}
              />
              {error?.lgaId?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box> */}

            <Box px="16px">
              <TextField
                onChange={(e) => handleChange("residentialAddress", e.target.value)}
                name="residentialAddress"
                value={formState?.residentialAddress}
                label="Residential address"
              />
              {error?.residentialAddress?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Divider />

            <Box px="16px">
              <Select
                label="Source"
                items={[
                  ...INVITATIONSOURCES.map((x) => ({ id: x, label: capitalizeAndSpace(x) })),
                  { id: undefined, label: "None" },
                ]}
                onChange={(e) => {
                  handleChange("trafficSource", e.target.value as string);
                }}
                name="trafficSource"
                value={formState?.trafficSource}
              />
              {error?.trafficSource?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box px="16px">
              <TextField
                onChange={(e) => handleChange("referralId", e.target.value)}
                name="referralId"
                value={formState?.referralId || referralId}
                label="Referral Id"
              />
              {error?.referralId?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Divider />

            <Box px="16px">
              <FileUpload
                handleReset={() => handleReset("profilePic")}
                files={files}
                setFiles={setFiles}
                label="Add profile image"
                prefix={`user_${userData?.id}`}
              />
              {error?.profilePic?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Divider />
            <Box px="16px">
              <LoadingButton loading={loading} onClick={handleSubmit}>
                Save
              </LoadingButton>
            </Box>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export { ClientOnboarding };
