"use client";

import { Drawer } from "@/components/drawer";
import { AutoComplete, FileUpload, Select, TextField } from "@/components/Inputs";
import { GENDERS, User, UserFormPayload, UserPayload } from "@/lib/api/user/user.types";
import { useEffect, useState } from "react";
import { ValidationError } from "@/services/validation/zod";
import { FileType } from "@/lib/api/file-upload/file-upload.types";
import { Box, InputAdornment, Stack } from "@mui/material";
import { ErrorText, MobileH2MGray900 } from "@/utils/typography";
import { useUser } from "@/lib/api/user/useUser";
import { useAlertContext } from "@/contexts/AlertContext";
import { IconButton, LoadingButton } from "../buttons";
import { ApiResult } from "@/utils/global-types";
import { useSession } from "@/lib/session/client/useSession";
import { useUserContext } from "@/contexts/UserContext";
import { useLocation } from "@/lib/api/location/useLocation";
import { IState } from "@/lib/api/location/location.types";
import { capitalizeAndSpace } from "@/services/string";
import { Divider } from "../divider";
import { usePathname, useRouter } from "next/navigation";
import { Eye, EyeSlash, Gear } from "@phosphor-icons/react/dist/ssr";
import { COLORS } from "@/utils/colors";
import { ChangePasswordPayload } from "@/lib/api/auth/auth.types";
import { useAuth } from "@/lib/api/auth/useAuth";

interface UpdateProfileFormProps {
  isOpen: boolean;
  onClose?: () => void;
}

const UpdateProfileForm = ({ isOpen, onClose }: UpdateProfileFormProps) => {
  const [showUpdateProfile, setShowUpdateProfile] = useState(true);

  const handleClose = () => {
    onClose?.();
  };

  function toggleProfileView() {
    setShowUpdateProfile((prev) => !prev);
  }

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-16">
        <div className="mb-6">
          <Box px="16px">
            <Stack width={"100%"} direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
              <MobileH2MGray900>{showUpdateProfile ? "Update your profile" : "Update your password"}</MobileH2MGray900>
              <IconButton onClick={toggleProfileView} bg_color={COLORS.gray200}>
                <Gear weight="duotone" />
              </IconButton>
            </Stack>
          </Box>
          {showUpdateProfile ? <UpdateProfile onClose={handleClose} /> : <UpdatePassword onClose={handleClose} />}{" "}
        </div>
      </div>
    </Drawer>
  );
};

export interface UserProfileFormState {
  error: ValidationError<UserPayload>;
  result: ApiResult<User>;
}
interface UpdateProfileProps {
  onClose?: () => void;
}

function UpdateProfile({ onClose }: UpdateProfileProps) {
  const initialState: UserProfileFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const router = useRouter();
  const pathname = usePathname();

  const { updateSession } = useSession();

  const { updateUserProfile } = useUser();
  const { fetchStates } = useLocation();

  const [states, setStates] = useState<IState[] | null>(null);

  const [formState, setFormState] = useState<UserFormPayload>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [error, setError] = useState<ValidationError<UserPayload>>({});
  const [loading, setLoading] = useState(false);
  const [init, setInit] = useState(false);

  const [files, setFiles] = useState<FileType[]>([]);

  const handleClose = () => {
    onClose?.();
  };

  async function handleSubmit() {
    const payload: UserFormPayload = { ...formState };
    payload.profilePic = files[0];

    setLoading(true);
    const { error, result } = await updateUserProfile(initialState, payload);

    if (result && typeof result === "object") {
      updateSession(result);
      setAlert({ message: "Bio data saved", show: true, severity: "success" });
      handleClose();
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

  function handleChange(field: keyof UserPayload, value: string) {
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

  useEffect(() => {
    async function populateFormState() {
      if (!userData || init) return;

      setFormState({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
        residentialAddress: userData.residentialAddress || "",
        profilePic: userData?.profilePic || "",
        stateId: userData?.state?.id || "",
        lgaId: userData?.lga?.id || "",
        gender: userData?.gender || "",
        trafficSource: userData?.trafficSource,
      });

      if (userData.profilePic) {
        const response = await fetch(userData.profilePic);
        const blob = await response?.blob();

        const file: FileType = new File([blob], `user_${userData?.id}`, {
          type: blob.type,
          lastModified: Date.now(),
        });
        // Add custom properties to the file
        file.preview = URL.createObjectURL(blob);
        setFiles([file]);
      }

      setInit(true);
    }

    populateFormState();
  }, [init, userData]);

  return (
    <Stack spacing={"16px"} mt="32px">
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
              handleChange("lgaId", "");
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
    </Stack>
  );
}

export interface ChangePasswordFormState {
  error: ValidationError<ChangePasswordPayload>;
  result: ApiResult<boolean>;
}
interface UpdatePasswordProps {
  onClose?: () => void;
}
function UpdatePassword({ onClose }: UpdatePasswordProps) {
  const initialState: ChangePasswordFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();

  const { changePassword } = useAuth();
  const [formState, setFormState] = useState<ChangePasswordPayload>({
    oldPassword: "",
    newPassword: "",
  });
  const [error, setError] = useState<ValidationError<ChangePasswordPayload>>({});
  const [loading, setLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const handleClose = () => {
    onClose?.();
  };

  async function handleSubmit() {
    setLoading(true);
    const { error, result } = await changePassword(initialState, formState);

    if (result) {
      setAlert({ message: "Password changed!", show: true, severity: "success" });
      handleClose();
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

  function handleChange(field: keyof ChangePasswordPayload, value: string) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof ChangePasswordPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  return (
    <Stack spacing={"16px"} mt="32px">
      <Box px="16px">
        <TextField
          fullWidth
          type={showOldPassword ? "text" : "password"}
          onChange={(e) => handleChange("oldPassword", e.target.value)}
          name="oldPassword"
          label="Old password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  {showOldPassword ? (
                    <EyeSlash onClick={() => setShowOldPassword((prev) => !prev)} cursor={"pointer"} />
                  ) : (
                    <Eye onClick={() => setShowOldPassword((prev) => !prev)} cursor={"pointer"} />
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
        {error?.oldPassword?.map((error, i) => (
          <Box key={i}>
            <ErrorText>{error}</ErrorText>
          </Box>
        ))}
      </Box>

      <Box px="16px">
        <TextField
          fullWidth
          type={showNewPassword ? "text" : "password"}
          onChange={(e) => handleChange("newPassword", e.target.value)}
          name="newPassword"
          label="New password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="start">
                  {showNewPassword ? (
                    <EyeSlash onClick={() => setShowNewPassword((prev) => !prev)} cursor={"pointer"} />
                  ) : (
                    <Eye onClick={() => setShowNewPassword((prev) => !prev)} cursor={"pointer"} />
                  )}
                </InputAdornment>
              ),
            },
          }}
        />
        {error?.newPassword?.map((error, i) => (
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
    </Stack>
  );
}

export { UpdateProfileForm };
