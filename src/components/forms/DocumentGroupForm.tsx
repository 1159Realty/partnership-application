"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { TextField } from "@/components/Inputs";
import { Box, Stack } from "@mui/material";
import { ErrorText } from "@/utils/typography";
import { AutoCompleteWithSub } from "../Inputs/AutoComplete";
import { ValidationError } from "@/services/validation/zod";
import { ApiResult } from "@/utils/global-types";
import { useAlertContext } from "@/contexts/AlertContext";
import { useEffect, useState } from "react";
import { LoadingButton } from "../buttons";
import { useUser } from "@/lib/api/user/useUser";
import { PaginatedResponse } from "@/lib/api/api.types";
import { User } from "@/lib/api/user/user.types";
import { useDebounce } from "use-debounce";
import { useProperty } from "@/lib/api/property/useProperty";
import { IProperty } from "@/lib/api/property/property.types";
import { useUserContext } from "@/contexts/UserContext";
import { getUserName } from "@/services/string";
import { DocumentGroupFormPayload, DocumentGroupPayload, IDocumentGroup } from "@/lib/api/document/document.types";
import { useDocument } from "@/lib/api/document/useDocument";

export interface DocumentGroupFormState {
  error: ValidationError<DocumentGroupPayload>;
  result: ApiResult<IDocumentGroup>;
}

interface EnrollClientFormProps {
  onClose?: () => void;
  onCreate?: (data?: IDocumentGroup | null) => void;
  isOpen: boolean;
  documentGroup?: IDocumentGroup | null;
}

function DocumentGroupForm({ onClose, onCreate, isOpen, documentGroup }: EnrollClientFormProps) {
  const initialState: DocumentGroupFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const { createDocumentGroup } = useDocument();
  const { fetchUsers } = useUser();
  const { fetchProperties } = useProperty();

  const [formState, setFormState] = useState<DocumentGroupFormPayload>({
    title: "",
    description: "",
  });
  const [error, setError] = useState<ValidationError<DocumentGroupPayload>>({});
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [clientQuery, setClientQuery] = useState("");
  const [debouncedQuery] = useDebounce(clientQuery, 700);

  const [properties, setProperties] = useState<PaginatedResponse<IProperty> | null>(null);
  const [propertyQuery, setPropertyQuery] = useState("");
  const [debouncedPropertyQuery] = useDebounce(propertyQuery, 700);

  function handleChange(field: keyof DocumentGroupFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof DocumentGroupFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  async function handleSubmit() {
    setLoading(true);
    const payload: DocumentGroupPayload = {
      title: formState.title,
      description: formState.description,
      propertyId: formState?.propertyId?.id,
      clientId: formState.clientId?.id,
      documentGroupId: documentGroup?.id,
      instagramUrl: formState?.instagramUrl,
    };

    const { error, result } = await createDocumentGroup(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Document group created", show: true, severity: "success" });
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

  const handleClose = () => {
    onClose?.();
  };

  useEffect(() => {
    async function fetchUsersAsync() {
      const response = await fetchUsers({
        byClientOnly: true,
        keyword: debouncedQuery,
      });
      if (response) {
        setUsers(response);
      }
    }
    fetchUsersAsync();
  }, [fetchUsers, debouncedQuery, userData?.roleId, userData?.phoneNumber]);

  useEffect(() => {
    async function fetchPropertiesAsync() {
      const response = await fetchProperties({ page: 1, limit: 10, propertyName: debouncedPropertyQuery });
      if (response) {
        setProperties(response);
      }
    }

    fetchPropertiesAsync();
  }, [fetchProperties, debouncedPropertyQuery]);

  useEffect(() => {
    async function populate() {
      if (documentGroup) {
        setFormState({
          title: documentGroup?.title || "",
          description: documentGroup?.description,
          instagramUrl: documentGroup?.instagramUrl,
        });
      }
    }

    populate();
  }, [documentGroup]);

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <Box pb="48px" mt="60px">
        <Box px="16px">
          <PageTitleBtn hideCancel>Document Group</PageTitleBtn>
        </Box>

        <Stack mt="16px" spacing={"25px"}>
          <Box px="16px">
            <TextField onChange={(e) => handleChange("title", e.target.value)} fullWidth value={formState.title} label="Title" />
            {error?.title?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <TextField
              onChange={(e) => handleChange("description", e.target.value)}
              fullWidth
              value={formState.description}
              label="Description"
              multiline
              rows={4}
            />
            {error?.description?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <TextField
              fullWidth
              onChange={(e) => handleChange("instagramUrl", e.target.value)}
              name="instagramUrl"
              value={formState.instagramUrl}
              label="Instagram link"
            />
            {error?.instagramUrl?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          {!Boolean(documentGroup) && (
            <>
              <Box px="16px">
                <AutoCompleteWithSub
                  renderInputLabel="Client"
                  onBlur={() => setClientQuery("")}
                  options={
                    users?.items?.map((i) => ({
                      label: getUserName(i),
                      sub: `${i?.email}"`,
                      id: i?.id,
                    })) || []
                  }
                  onChange={(_, value) => {
                    if (value) {
                      handleChange("clientId", value);
                    }
                  }}
                  onInputChange={(_, value) => {
                    if (!value) {
                      handleChange("clientId", null);
                    }
                    setClientQuery(value);
                  }}
                  value={formState.clientId?.label || ""}
                />
                {error?.clientId?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>

              <Box px="16px">
                <AutoCompleteWithSub
                  fullWidth
                  renderInputLabel="Property"
                  onBlur={() => setPropertyQuery("")}
                  options={
                    properties?.items?.map((x) => ({
                      label: x?.propertyName,
                      id: x?.id,
                    })) || []
                  }
                  onChange={(_, value) => {
                    if (value) {
                      handleChange("propertyId", value);
                    }
                  }}
                  onInputChange={(_, value) => {
                    if (!value) {
                      handleChange("propertyId", null);
                    }
                    setPropertyQuery(value);
                  }}
                  value={formState?.propertyId?.label || ""}
                />
                {error?.propertyId?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>
            </>
          )}

          <Box px="16px">
            <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
              Submit
            </LoadingButton>
          </Box>
        </Stack>
      </Box>
    </Drawer>
  );
}

export { DocumentGroupForm };
