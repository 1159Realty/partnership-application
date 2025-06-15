"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { AutoCompleteWithSub, AutoCompleteWithSubOptions, TextField } from "@/components/Inputs";
import { Button, IconButton, LoadingButton } from "@/components/buttons";
import { Box, Stack } from "@mui/material";
import { ErrorText, MobileB1MGray500, MobileB2MGray900 } from "@/utils/typography";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/contexts/AlertContext";
import { ValidationError } from "@/services/validation/zod";
import { ApiResult } from "@/utils/global-types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { useDebounce } from "use-debounce";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import {
  CampaignFormPayload,
  CampaignPayload,
  ICampaign,
  ICampaignRecipientsGroup,
  ICampaignTemplate,
  IDesign,
} from "@/lib/api/campaign/types";
import { getUserName } from "@/services/string";
import { User } from "@/lib/api/user/user.types";
import { useUser } from "@/lib/api/user/useUser";
import { COLORS } from "@/utils/colors";
import { Divider } from "../divider";
import { DateTimePicker } from "../Inputs/DatePicker";
import { Dayjs } from "dayjs";
import { formatAsIsoString } from "@/services/dateTime";

export interface CampaignFormState {
  error: ValidationError<CampaignFormPayload>;
  result: ApiResult<ICampaign>;
}

interface Props {
  onCreate?: (data: ICampaign) => void;
  onClose?: () => void;
  isOpen: boolean;
  designsData: PaginatedResponse<IDesign> | null;
  templatesData: PaginatedResponse<ICampaignTemplate> | null;
  recipientsGroupData: PaginatedResponse<ICampaignRecipientsGroup> | null;
  usersData: PaginatedResponse<User> | null;
}

function CampaignForm({ onCreate, onClose, isOpen, templatesData, recipientsGroupData, usersData }: Props) {
  const initialState: CampaignFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();

  const { fetchCampaignTemplates, fetchCampaignRecipientsGroups, createCampaign } = useCampaign();
  const { fetchUsers } = useUser();

  const [formState, setFormState] = useState<CampaignFormPayload>({
    name: "",
    type: "EMAIL",
  });

  const [error, setError] = useState<ValidationError<CampaignFormPayload>>({});
  const [loading, setLoading] = useState(false);

  const [selectedRecipient, setSelectedRecipient] = useState<AutoCompleteWithSubOptions | null>(null);

  // const [designs, setDesigns] = useState(designsData);
  // const [designQuery, setDesignQuery] = useState("");
  // const [debouncedDesignQuery] = useDebounce(designQuery, 700);

  const [templates, setTemplates] = useState(templatesData);
  const [templateQuery, setTemplateQuery] = useState("");
  const [debouncedTemplateQuery] = useDebounce(templateQuery, 700);

  const [recipientsGroups, setRecipientsGroups] = useState(recipientsGroupData);
  const [recipientsGroupsQuery, setRecipientsGroupsQuery] = useState("");
  const [debouncedRecipientsGroupsQuery] = useDebounce(recipientsGroupsQuery, 700);

  const [users, setUsers] = useState(usersData);
  const [usersQuery, setUsersQuery] = useState("");
  const [debouncedUsersQuery] = useDebounce(usersQuery, 700);

  const handleClose = () => {
    onClose?.();
  };

  async function handleSubmit() {
    setLoading(true);
    const brevoListId = formState?.recipientsGroupId?.id?.split("__")?.[1]
      ? parseInt(formState?.recipientsGroupId?.id?.split("__")?.[1])
      : undefined;

    const payload: CampaignPayload = {
      name: formState.name,
      type: formState.type,
      designId: formState?.designId?.id,
      message: formState?.message,
      subject: formState?.subject,
      templateId: formState?.templateId?.id,
      recipientsGroupId: formState?.recipientsGroupId?.id?.split("__")?.[0],
      brevoListId,
      recipientIds: formState?.recipientIds?.map((x) => x.id),
      brevoScheduledAt: formatAsIsoString(formState?.brevoScheduledAt),
      brevoScheduled: Boolean(formState?.brevoScheduledAt),
    };

    const { error, result } = await createCampaign(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Campaign created", show: true, severity: "success" });
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

  function handleChange(field: keyof CampaignFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof CampaignFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  function handleAddRecipient() {
    if (!selectedRecipient || formState?.recipientIds?.some((x) => x?.id === selectedRecipient?.id)) return;

    const tempFormState = { ...formState };
    if (!tempFormState?.recipientIds?.length) tempFormState.recipientIds = [];
    tempFormState?.recipientIds?.push(selectedRecipient);

    setFormState(tempFormState);
    setSelectedRecipient(null);
  }

  function handleRemoveRecipient(recipient: AutoCompleteWithSubOptions) {
    const tempFormState = { ...formState };
    tempFormState.recipientIds = tempFormState?.recipientIds?.filter((x) => x?.id !== recipient?.id);

    setFormState(tempFormState);
  }

  // useEffect(() => {
  //   async function get() {
  //     const response = await fetchDesign({ keyword: debouncedDesignQuery });
  //     if (response) {
  //       setDesigns(response);
  //     }
  //   }

  //   get();
  // }, [debouncedDesignQuery, fetchDesign]);

  useEffect(() => {
    async function get() {
      const response = await fetchCampaignTemplates({ keyword: debouncedTemplateQuery });
      if (response) {
        setTemplates(response);
      }
    }

    get();
  }, [debouncedTemplateQuery, fetchCampaignTemplates]);

  useEffect(() => {
    async function get() {
      const response = await fetchCampaignRecipientsGroups({ keyword: debouncedRecipientsGroupsQuery });
      if (response) {
        setRecipientsGroups(response);
      }
    }

    get();
  }, [fetchCampaignRecipientsGroups, debouncedRecipientsGroupsQuery]);

  useEffect(() => {
    async function get() {
      const response = await fetchUsers({ keyword: debouncedUsersQuery, byClientOnly: true });
      if (response) {
        setUsers(response);
      }
    }

    get();
  }, [fetchUsers, debouncedUsersQuery]);

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-16 pb-8">
        <div className="mb-6">
          <Box px="16px">
            <PageTitleBtn hideCancel>Create Campaign</PageTitleBtn>
          </Box>

          <Stack mt="24px" spacing={"16px"} px="16px">
            <Box>
              <TextField
                onChange={(e) => handleChange("name", e.target.value)}
                name="campaignName"
                value={formState?.name}
                label="Campaign name"
              />
              {error?.name?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            {/* <Box>
              <Select
                label="Campaign Type"
                items={campaignTypeArr.map((x) => ({
                  id: x,
                  label: capitalizeAndSpace(x),
                }))}
                onChange={(e) => {
                  handleChange("type", e.target.value as string);
                }}
                value={formState.type}
              />
              {error?.type?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box> */}
            <Box>
              <TextField
                onChange={(e) => handleChange("subject", e.target.value)}
                name="subject"
                value={formState?.subject}
                label="Subject"
              />

              {error?.subject?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            {!formState?.designId && !formState?.message?.trim() && (
              <Box>
                <AutoCompleteWithSub
                  renderInputLabel="Template"
                  onBlur={() => setTemplateQuery("")}
                  options={
                    templates?.items?.map((x) => ({
                      label: x?.name,
                      id: x?.id,
                    })) || []
                  }
                  onChange={(_, value) => {
                    if (value) {
                      handleChange("templateId", value);
                    }
                  }}
                  onInputChange={(_, value) => {
                    if (!value) {
                      handleChange("templateId", undefined);
                    }
                    setTemplateQuery(value);
                  }}
                  value={formState.templateId?.label || ""}
                />
                {error?.templateId?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>
            )}

            {!formState?.templateId && (
              <>
                {/* {formState.type === "EMAIL" && (
                  <>
                    <Box>
                      <AutoCompleteWithSub
                        renderInputLabel="Design"
                        onBlur={() => setDesignQuery("")}
                        options={
                          designs?.items?.map((x) => ({
                            label: x?.name,
                            id: x?.id,
                          })) || []
                        }
                        onChange={(_, value) => {
                          if (value) {
                            handleChange("designId", value);
                          }
                        }}
                        onInputChange={(_, value) => {
                          if (!value) {
                            handleChange("designId", undefined);
                          }
                          setDesignQuery(value);
                        }}
                        value={formState.designId?.label || ""}
                      />
                      {error?.designId?.map((error, i) => (
                        <Box key={i}>
                          <ErrorText>{error}</ErrorText>
                        </Box>
                      ))}
                    </Box>
                  </>
                )} */}

                <Box>
                  <TextField
                    onChange={(e) => handleChange("message", e.target.value)}
                    name="templateMessage"
                    value={formState?.message}
                    label="Message here..."
                    rows={4}
                    multiline
                  />

                  {error?.message?.map((error, i) => (
                    <Box key={i}>
                      <ErrorText>{error}</ErrorText>
                    </Box>
                  ))}
                </Box>
              </>
            )}

            <Box>
              <DateTimePicker
                onChange={(value: Dayjs | null) => {
                  handleChange("brevoScheduledAt", value);
                }}
                value={formState?.brevoScheduledAt}
                label="Schedule"
              />

              {error?.message?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            {!Boolean(formState?.recipientIds?.length) && (
              <Box>
                <AutoCompleteWithSub
                  renderInputLabel="Recipients group"
                  onBlur={() => setRecipientsGroupsQuery("")}
                  options={
                    recipientsGroups?.items?.map((x) => ({
                      label: x?.name,
                      id: `${x?.id}__${x?.brevoListId}`,
                    })) || []
                  }
                  onChange={(_, value) => {
                    if (value) {
                      handleChange("recipientsGroupId", value);
                    }
                  }}
                  onInputChange={(_, value) => {
                    if (!value) {
                      handleChange("recipientsGroupId", undefined);
                    }
                    setRecipientsGroupsQuery(value);
                  }}
                  value={formState.recipientsGroupId?.label || ""}
                />
                {error?.recipientsGroupId?.map((error, i) => (
                  <Box key={i}>
                    <ErrorText>{error}</ErrorText>
                  </Box>
                ))}
              </Box>
            )}

            {!formState?.recipientsGroupId && (
              <>
                <Stack mt="32px" spacing={"20px"}>
                  <Box>
                    <AutoCompleteWithSub
                      renderInputLabel="Recipients"
                      onBlur={() => setUsersQuery("")}
                      options={
                        users?.items?.map((i) => ({
                          label: getUserName(i),
                          sub: `${i?.email}`,
                          id: i?.id,
                        })) || []
                      }
                      onChange={(_, value) => {
                        if (value) {
                          // eslint-disable-next-line @typescript-eslint/no-explicit-any
                          setSelectedRecipient(value as any);
                        }
                      }}
                      onInputChange={(_, value) => {
                        if (!value) {
                          setSelectedRecipient(null);
                        }
                        setUsersQuery(value);
                      }}
                      value={selectedRecipient?.label || ""}
                    />
                  </Box>
                  <Box px="16px">
                    <Stack alignItems={"flex-end"}>
                      <Button onClick={handleAddRecipient}>Add</Button>
                    </Stack>
                  </Box>

                  <Stack px="16px" spacing={"10px"}>
                    {formState?.recipientIds?.map((x) => (
                      <Stack
                        direction={"row"}
                        spacing={"10px"}
                        borderRadius={"10px"}
                        px="15px"
                        py="10px"
                        bgcolor={COLORS.gray200}
                        key={x?.id}
                        justifyContent={"space-between"}
                      >
                        <Stack sx={{ wordBreak: "break-word" }}>
                          <MobileB2MGray900>{x?.label}</MobileB2MGray900>
                          <MobileB1MGray500>{x?.sub}</MobileB1MGray500>
                        </Stack>
                        <IconButton onClick={() => handleRemoveRecipient(x)} sx={{ width: 30, height: 30 }}>
                          <X />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </Stack>
              </>
            )}
          </Stack>
          <Divider />
          <Box px="16px" mt="24px">
            <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
              Submit
            </LoadingButton>
          </Box>
        </div>
      </div>
    </Drawer>
  );
}

export { CampaignForm };
