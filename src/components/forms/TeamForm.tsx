"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { AutoCompleteWithSub, Select } from "@/components/Inputs";
import { LoadingButton } from "@/components/buttons";
import { Box, capitalize, Stack } from "@mui/material";
import { ErrorText } from "@/utils/typography";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/contexts/AlertContext";
import { ValidationError } from "@/services/validation/zod";
import { ApiResult } from "@/utils/global-types";
import { agentTypes, User, UserRoleFormPayload, UserRolePayload } from "@/lib/api/user/user.types";
import { useUser } from "@/lib/api/user/useUser";
import { getRole, getCreateRoles } from "@/lib/session/roles";
import { PaginatedResponse } from "@/lib/api/api.types";
import { useDebounce } from "use-debounce";
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { useUserContext } from "@/contexts/UserContext";

export interface UserRoleFormState {
  error: ValidationError<UserRoleFormPayload>;
  result: ApiResult<User>;
}

interface FormProps {
  onCreate?: (user?: User) => void;
  onClose?: () => void;
  isOpen: boolean;
  user?: User | null;
}

function TeamForm({ onCreate, onClose, isOpen, user }: FormProps) {
  const initialState: UserRoleFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const { addRole, fetchUsers } = useUser();

  const [formState, setFormState] = useState<UserRoleFormPayload>({
    roleId: "",
    userId: null,
    agentType: "PRIVATE",
  });
  const [error, setError] = useState<ValidationError<UserRoleFormPayload>>({});
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);

  const [debouncedQuery] = useDebounce(query, 700);
  const isUpdate = Boolean(user);

  const accessRoles = getCreateRoles(userData?.roleId);

  const handleClose = () => {
    onClose?.();
  };

  async function handleSubmit() {
    setLoading(true);

    const payload: UserRolePayload = {
      userId: formState?.userId?.id || "",
      roleId: formState?.roleId,
      agentType: formState?.agentType,
    };

    const { error, result } = await addRole(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Area added", show: true, severity: "success" });
      handleClose();
    }
    if (error.requestError) {
      setAlert({ message: error.requestError, show: true, severity: "error" });
      delete error.requestError;
    } else if (Object.keys(error).length) {
      setError(error);
      setAlert({ message: "Complete the required fields", show: true, severity: "error" });
    }
    setLoading(false);
  }

  function handleChange(field: keyof UserRoleFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof UserRoleFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  useEffect(() => {
    async function fetchUserAsync() {
      const response = await fetchUsers({ page: 1, limit: 10, keyword: debouncedQuery });
      if (response) {
        setUsers(response);
      }
    }

    fetchUserAsync();
  }, [fetchUsers, debouncedQuery]);

  useEffect(() => {
    if (user) {
      setFormState({
        userId: {
          id: user?.id,
          label: getUserName(user),
        },
        roleId: user?.roleId,
      });
    }
  }, [user]);

  return (
    <Drawer isOpen={isOpen} handleClose={onClose}>
      <div className="mt-16 pb-8">
        <div className="mb-6">
          <Box px="16px">
            <PageTitleBtn hideCancel>{isUpdate ? "Update member role" : "Add new member"}</PageTitleBtn>
          </Box>

          <Stack mt="24px" spacing={"16px"} px="16px">
            <Box>
              <AutoCompleteWithSub
                renderInputLabel="User"
                onBlur={() => setQuery("")}
                options={
                  users?.items
                    ?.filter((x) => accessRoles?.includes(x?.roleId))
                    ?.map((x) => ({
                      label: getUserName(x),
                      sub: `${x?.email}"`,
                      id: x?.id,
                    })) || []
                }
                onChange={(_, value) => {
                  if (value) {
                    handleChange("userId", value);
                  }
                }}
                onInputChange={(_, value) => {
                  if (!value) {
                    handleChange("userId", null);
                  }
                  setQuery(value);
                }}
                value={formState.userId?.label || ""}
              />
              {error?.userId?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            <Box>
              <Select
                label="Role"
                items={[
                  ...getCreateRoles(userData?.roleId).map((x) => {
                    return {
                      label: capitalize(x),
                      id: x,
                    };
                  }),
                ]}
                onChange={(e) => {
                  handleChange("roleId", e.target.value as string);
                }}
                value={formState.roleId}
              />
              {error?.roleId?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            {getRole(formState.roleId) === "agent" && (
              <Box>
                <Select
                  label="Agent type"
                  items={agentTypes.map((x) => ({
                    id: x,
                    label: capitalizeAndSpace(x),
                  }))}
                  onChange={(e) => {
                    handleChange("agentType", e.target.value as string);
                  }}
                  value={formState.agentType}
                />
                {error?.agentType?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>
            )}

            <Box>
              <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
                {isUpdate ? "Update" : "Add member"}
              </LoadingButton>
            </Box>
          </Stack>
        </div>
      </div>
    </Drawer>
  );
}

export { TeamForm };
