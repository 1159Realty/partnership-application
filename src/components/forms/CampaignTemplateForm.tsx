"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { TextField } from "@/components/Inputs";
import { LoadingButton } from "@/components/buttons";
import { Box, Stack } from "@mui/material";
import { ErrorText } from "@/utils/typography";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/contexts/AlertContext";
import { ValidationError } from "@/services/validation/zod";
import { ApiResult } from "@/utils/global-types";
import { PaginatedResponse } from "@/lib/api/api.types";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import { CampaignTemplateFormPayload, CampaignTemplatePayload, ICampaignTemplate, IDesign } from "@/lib/api/campaign/types";

export interface CampaignTemplateFormState {
  error: ValidationError<CampaignTemplateFormPayload>;
  result: ApiResult<ICampaignTemplate>;
}

interface Props {
  onCreate?: (data: ICampaignTemplate) => void;
  onClose?: () => void;
  data?: ICampaignTemplate | null;
  isOpen: boolean;
  designsData: PaginatedResponse<IDesign> | null;
}

function CampaignTemplateForm({ onCreate, onClose, isOpen, data }: Props) {
  const initialState: CampaignTemplateFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();

  const { createCampaignTemplate } = useCampaign();

  const [formState, setFormState] = useState<CampaignTemplateFormPayload>({
    name: "",
    type: "EMAIL",
    message: "",
    subject: "",
  });

  const [error, setError] = useState<ValidationError<CampaignTemplatePayload>>({});
  const [loading, setLoading] = useState(false);

  // const [designs, setDesigns] = useState(designsData);
  // const [designQuery, setDesignQuery] = useState("");
  // const [debouncedDesignQuery] = useDebounce(designQuery, 700);

  const handleClose = () => {
    onClose?.();
  };

  async function handleSubmit() {
    setLoading(true);
    const payload: CampaignTemplatePayload = {
      name: formState.name,
      type: formState.type,
      designId: formState.designId?.id,
      message: formState.message,
      subject: formState?.subject,
    };

    const { error, result } = await createCampaignTemplate(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Template updated", show: true, severity: "success" });
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

  function handleChange(field: keyof CampaignTemplateFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof CampaignTemplateFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  // useEffect(() => {
  //   async function get() {
  //     const response = await fetchDesign();
  //     if (response) {
  //       setDesigns(response);
  //     }
  //   }

  //   get();
  // }, [debouncedDesignQuery, fetchDesign]);

  useEffect(() => {
    if (!data) return;
    setFormState({
      name: data?.name || "",
      type: data?.type || "EMAIL",
      designId: {
        id: data?.design?.id,
        label: data?.design?.name,
      },
      message: data?.message || "",
      subject: data?.subject,
    });
  }, [data]);

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-16 pb-8">
        <div className="mb-6">
          <Box px="16px">
            <PageTitleBtn hideCancel>Template</PageTitleBtn>
          </Box>

          <Stack mt="24px" spacing={"16px"} px="16px">
            <Box>
              <TextField
                onChange={(e) => handleChange("name", e.target.value)}
                name="templateName"
                value={formState?.name}
                label="Template name"
              />
              {error?.name?.map((error, i) => (
                <Box key={i}>
                  <ErrorText>{error}</ErrorText>
                </Box>
              ))}
            </Box>

            {/* <Box>
              <Select
                label="Template type"
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

            {formState.type === "EMAIL" && (
              <>
                {/* <Box>
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
                        handleChange("designId", null);
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
                </Box> */}

                <Box>
                  <TextField
                    onChange={(e) => handleChange("subject", e.target.value)}
                    name="templateSubject"
                    value={formState?.subject}
                    label="Subject"
                  />

                  {error?.subject?.map((error, i) => (
                    <Box key={i}>
                      <ErrorText>{error}</ErrorText>
                    </Box>
                  ))}
                </Box>
              </>
            )}

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

            <Box>
              <LoadingButton loadingPosition="end" loading={loading} onClick={handleSubmit}>
                Submit
              </LoadingButton>
            </Box>
          </Stack>
        </div>
      </div>
    </Drawer>
  );
}

export { CampaignTemplateForm };
