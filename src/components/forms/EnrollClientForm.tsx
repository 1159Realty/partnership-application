"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { Select, TextField } from "@/components/Inputs";
import { Box, InputAdornment, Stack } from "@mui/material";
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
import { capitalizeAndSpace, getUserName } from "@/services/string";
import { getRole } from "@/lib/session/roles";
import {
  EnrollmentFormPayload,
  EnrollmentPayload,
  EnrollmentValidationPayload,
  IEnrollment,
  leadTypes,
} from "@/lib/api/enrollment/types";
import { useEnrollment } from "@/lib/api/enrollment/useEnrollment";

export interface EnrollmentFormState {
  error: ValidationError<EnrollmentPayload>;
  result: ApiResult<IEnrollment>;
}

interface EnrollClientFormProps {
  showEnrollClient: boolean;
  onClose?: () => void;
  onCreate?: (lead: IEnrollment) => void;
  propertyId?: string | null;
  clientId?: string | null;
}

function EnrollClientForm({ showEnrollClient, onClose, onCreate, propertyId, clientId }: EnrollClientFormProps) {
  const initialState: EnrollmentFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const { createEnrollment } = useEnrollment();
  const { fetchUsers } = useUser();
  const { fetchProperty, fetchProperties } = useProperty();

  const [formState, setFormState] = useState<EnrollmentFormPayload>({
    landSize: "",
    price: "",
    installmentInterest: "",
    installmentDuration: "",
    outrightPayment: false,
    overDueInterest: "",
    leadType: "PRIVATE",
  });
  const [error, setError] = useState<ValidationError<EnrollmentValidationPayload>>({});
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(null);
  const [clientQuery, setClientQuery] = useState("");
  const [debouncedQuery] = useDebounce(clientQuery, 700);

  const [agents, setAgents] = useState<PaginatedResponse<User> | null>(null);
  const [agentsQuery, setAgentsQuery] = useState("");
  const [debouncedAgentQuery] = useDebounce(agentsQuery, 700);

  const [property, setProperty] = useState<IProperty | null>(null);
  const [properties, setProperties] = useState<PaginatedResponse<IProperty> | null>(null);
  const [propertyQuery, setPropertyQuery] = useState("");
  const [debouncedPropertyQuery] = useDebounce(propertyQuery, 700);

  const interest = property?.paymentDurationOptions?.find((x) => x?.duration == formState?.installmentDuration)?.interest;
  const price = property?.availableLandSizes?.find((x) => x?.size == formState?.landSize)?.price;

  function handleChange(field: keyof EnrollmentFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof EnrollmentFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));

    if (field === "installmentDuration") {
      setError((prev) => ({ ...prev, installmentInterest: undefined, error: undefined }));
    }

    if (field === "landSize") {
      setError((prev) => ({ ...prev, price: undefined, error: undefined }));
    }
  }

  async function handleSubmit() {
    setLoading(true);
    const payload: EnrollmentValidationPayload = {
      outrightPayment: formState.outrightPayment,
      agentId: getRole(userData?.roleId) === "agent" ? userData?.id : formState?.agentId?.id,
      propertyId: propertyId || formState?.propertyId?.id,
      clientId: clientId || formState.clientId?.id || "",
      landSize: +formState.landSize,
      price: price || 0,
      installmentInterest: formState.outrightPayment ? 0 : interest || 0,
      installmentDuration: +formState.installmentDuration,
      leadType: formState?.leadType,
    };

    const { error, result } = await createEnrollment(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Client enrolled", show: true, severity: "success" });
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
      const role = getRole(userData?.roleId);
      let response: PaginatedResponse<User> | null = null;
      if (role === "agent") {
        response = await fetchUsers({
          referralId: userData?.myReferralId,
          keyword: debouncedQuery,
        });
      } else {
        response = await fetchUsers({
          byClientOnly: true,
          keyword: debouncedQuery,
        });
      }
      if (response) {
        setUsers(response);
      }
    }
    fetchUsersAsync();
  }, [fetchUsers, debouncedQuery, userData]);

  useEffect(() => {
    async function fetchUsersAsync() {
      const response = await fetchUsers({
        roleId: "agent",
        keyword: debouncedAgentQuery,
      });

      if (response) {
        setAgents(response);
      }
    }
    fetchUsersAsync();
  }, [fetchUsers, debouncedAgentQuery]);

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
    async function fetchPropertyAsync() {
      const propertyIdValue = propertyId || formState?.propertyId?.id;
      if (!propertyIdValue) return;
      const response = await fetchProperty(propertyIdValue);
      if (response) {
        setProperty(response);
      }
    }
    fetchPropertyAsync();
  }, [propertyId, fetchProperty, formState.propertyId?.id]);

  return (
    <Drawer isOpen={showEnrollClient} handleClose={handleClose}>
      <Box pb="48px" mt="60px">
        <Box px="16px">
          <PageTitleBtn hideCancel>Enroll Client</PageTitleBtn>
        </Box>

        <Stack mt="16px" spacing={"25px"}>
          {userData?.agentType === "COMPANY" && (
            <Box px="16px">
              <Select
                label="Lead type"
                items={
                  leadTypes?.map((x) => ({
                    id: x,
                    label: capitalizeAndSpace(x),
                  })) || []
                }
                onChange={(e) => {
                  handleChange("leadType", e.target.value);
                }}
                name="leadType"
                value={formState.leadType}
              />
              {error?.leadType?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>
          )}

          {!clientId && (
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
          )}

          {userData?.roleId !== "agent" && (
            <Box px="16px">
              <AutoCompleteWithSub
                renderInputLabel="Agent"
                onBlur={() => setAgentsQuery("")}
                options={
                  agents?.items?.map((i) => ({
                    label: getUserName(i),
                    sub: `${i?.email}"`,
                    id: i?.id,
                  })) || []
                }
                onChange={(_, value) => {
                  if (value) {
                    handleChange("agentId", value);
                  }
                }}
                onInputChange={(_, value) => {
                  if (!value) {
                    handleChange("agentId", null);
                  }
                  setAgentsQuery(value);
                }}
                value={formState.agentId?.label || ""}
              />
              {error?.agentId?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>
          )}

          {!propertyId && (
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
          )}

          <Box px="16px">
            <Select
              label="Payment type"
              items={[
                { label: "Installment", id: "false" },
                { label: "Outright", id: "true" },
              ]}
              onChange={(e) => {
                handleChange("outrightPayment", e.target.value === "true");
                if (!e.target.value) {
                  handleChange("installmentDuration", false);
                }
              }}
              name="outrightPayment"
              value={formState.outrightPayment ? "true" : "false"}
            />
            {error?.outrightPayment?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <Select
              label="Payment duration"
              items={
                formState?.outrightPayment
                  ? [1, 2, 3].map((x) => ({
                      id: x.toString(),
                      label: x.toString(),
                    }))
                  : property?.paymentDurationOptions?.map((paymentDurationOption) => ({
                      id: paymentDurationOption.duration.toString(),
                      label: paymentDurationOption.duration.toString(),
                    })) || []
              }
              onChange={(e) => {
                handleChange("installmentDuration", e.target.value);
              }}
              name="paymentDuration"
              value={formState.installmentDuration}
            />
            {error?.installmentDuration?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <Select
              label="Land Sizes"
              items={
                property?.availableLandSizes?.map((availableLandSize) => ({
                  id: availableLandSize?.size?.toString(),
                  label: availableLandSize?.size?.toString(),
                })) || []
              }
              onChange={(e) => {
                handleChange("landSize", e.target.value);
              }}
              name="landSize"
              value={formState.landSize}
            />
            {error?.landSize?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          <Box px="16px">
            <TextField
              disabled
              fullWidth
              value={price}
              label="Price"
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
            {error?.price?.map((error, i) => (
              <Box key={i}>
                <ErrorText>{error}</ErrorText>
              </Box>
            ))}
          </Box>

          {!formState.outrightPayment && (
            <Box px="16px">
              <TextField
                disabled
                fullWidth
                value={interest}
                label="Interest"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              {error?.installmentInterest?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>
          )}

          <Box px="16px">
            <TextField
              disabled
              fullWidth
              name="overDueInterest"
              value={property?.overDueInterest}
              label="Overdue interest"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  endAdornment: <InputAdornment position="start">%</InputAdornment>,
                },
              }}
            />
          </Box>

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

export { EnrollClientForm };
