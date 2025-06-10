"use client";

import { Drawer } from "@/components/drawer";
import { PageTitleBtn } from "@/components/utils";
import { FileUpload, TextField } from "@/components/Inputs";
import { Button, LoadingButton } from "@/components/buttons";
import { Box, Stack } from "@mui/material";
import { ErrorText, MobileB1MGray500, MobileB1MGray900, MobileB2MGray900 } from "@/utils/typography";
import { useEffect, useState } from "react";
import { useAlertContext } from "@/contexts/AlertContext";
import { ValidationError } from "@/services/validation/zod";
import { FileType } from "@/lib/api/file-upload/file-upload.types";
import { ApiResult } from "@/utils/global-types";
import { DocumentFormPayload, IDocument } from "@/lib/api/document/document.types";
import { useDocument } from "@/lib/api/document/useDocument";
import { useUserContext } from "@/contexts/UserContext";
import { SelectWithStatus } from "../Inputs/Select";
import MultilineTextFields from "../Inputs/MultilineTextField";
import { DocumentCard } from "../cards/DocumentCard";
import { DotOutline } from "@phosphor-icons/react/dist/ssr";
import { getIsModerator } from "@/lib/session/roles";
import { downloadBlob } from "@/services/blob";

export interface DocumentFormState {
  error: ValidationError<DocumentFormPayload>;
  result: ApiResult<IDocument>;
}

interface DocumentFormProps {
  onCreate?: (doc: IDocument) => void;
  onDelete?: () => void;
  onClose?: () => void;
  document: IDocument | null;
  canUpdate?: boolean;
  isOpen: boolean;
  documentGroupId: string;
  formType: "MODERATOR" | "CLIENT";
}

function DocumentForm({
  onCreate,
  onClose,
  onDelete,
  document,
  canUpdate,
  isOpen,
  documentGroupId,
  formType,
}: DocumentFormProps) {
  const initialState: DocumentFormState = {
    error: {},
    result: null,
  };

  const { setAlert } = useAlertContext();
  const { userData } = useUserContext();

  const { createDocument, deleteDocument } = useDocument();

  const [formState, setFormState] = useState<DocumentFormPayload>({
    status: "PENDING",
  });

  const [error, setError] = useState<ValidationError<DocumentFormPayload>>({});
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [isUpdateMode, setIsUpdateMode] = useState(false);

  const [files, setFiles] = useState<FileType[]>([]);

  const isModerator = getIsModerator(userData?.roleId);
  const disableUpdate = !isModerator && document?.status === "COMPLETED";

  function getDocumentStatusLabel() {
    const status = document?.status;
    if (status === "COMPLETED") {
      return (
        <Stack direction={"row"} alignItems={"center"}>
          <MobileB1MGray500>Approved</MobileB1MGray500>
          <DotOutline size={30} weight="fill" color={"green"} />
        </Stack>
      );
    }

    if (status === "REJECTED") {
      return (
        <Stack direction={"row"} alignItems={"center"}>
          <MobileB1MGray500>Rejected</MobileB1MGray500>
          <DotOutline size={30} weight="fill" color={"red"} />
        </Stack>
      );
    }

    return (
      <Stack direction={"row"} alignItems={"center"}>
        <MobileB1MGray500>Pending</MobileB1MGray500>
        <DotOutline size={30} weight="fill" color={"orange"} />
      </Stack>
    );
  }

  async function handleDelete() {
    setDeleting(true);
    const res = await deleteDocument(document?.id || "");
    if (res) {
      setAlert({ message: "Document deleted", show: true, severity: "success" });
      onDelete?.();
      handleClose?.();
    }
    setDeleting(false);
  }

  const handleClose = () => {
    onClose?.();
    setIsUpdateMode(false);
    setFormState({});
    setFiles([]);
  };

  async function handleSubmit() {
    setLoading(true);
    const payload: DocumentFormPayload = {
      name: formState?.name || "",
      document: document ? undefined : files[0],
      documentGroupId,
      type: formType,
      status: formState?.status || "PENDING",
      message: formState?.message,
      documentId: document?.id,
    };

    const { error, result } = await createDocument(initialState, payload);

    if (result) {
      if (typeof result === "object") {
        onCreate?.(result);
      }
      setAlert({ message: "Document created", show: true, severity: "success" });
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

  function handleChange(field: keyof DocumentFormPayload, value: unknown) {
    handleReset(field);
    setFormState((prev) => ({ ...prev, [field]: value }));
  }

  function handleReset(field: keyof DocumentFormPayload) {
    setError((prev) => ({ ...prev, [field]: undefined, error: undefined }));
  }

  useEffect(() => {
    async function populate() {
      if (document) {
        if (document?.link) {
          const response = await fetch(document?.link);
          const blob = await response?.blob();

          const file: FileType = new File([blob], `user_${userData?.id}`, {
            type: blob.type,
            lastModified: Date.now(),
          });
          // Add custom properties to the file
          file.preview = URL.createObjectURL(blob);

          setFiles([file]);
        }

        setFormState({
          name: document?.name || "",
          status: document?.status || "PENDING",
          message: document?.message,
        });
      }
    }

    populate();
  }, [document, isModerator, userData?.id]);

  return (
    <Drawer isOpen={isOpen} handleClose={handleClose}>
      <div className="mt-16 pb-8">
        <div className="mb-6">
          <Box px="16px">
            <PageTitleBtn hideCancel>Document</PageTitleBtn>
          </Box>

          {Boolean(document) && !isUpdateMode ? (
            <Stack px="16px" spacing={"20px"} mt="30px">
              <Stack>
                <MobileB2MGray900>Title</MobileB2MGray900>
                <MobileB1MGray500>{document?.name || "N/A"}</MobileB1MGray500>
              </Stack>
              {formType === "CLIENT" && (
                <Stack>
                  <MobileB2MGray900>Status</MobileB2MGray900>
                  {getDocumentStatusLabel()}
                </Stack>
              )}
              <Stack>
                <MobileB2MGray900>{formType === "MODERATOR" ? "Instructions" : "Feedback"}</MobileB2MGray900>
                <MobileB1MGray500>
                  {document?.message?.trim() ||
                    (formType === "MODERATOR" ? "No instructions available" : "No feedback available")}
                </MobileB1MGray500>
              </Stack>
              {canUpdate && !disableUpdate && (
                <Box width={"fit-content"}>
                  <Button
                    onClick={handleDelete}
                    loading={deleting}
                    fullWidth={false}
                    color="error"
                    disableElevation={false}
                    not_rounded
                    padding="5px 12px"
                  >
                    Delete document
                  </Button>
                </Box>
              )}

              <DocumentCard hideStatus document={document} />
              <Stack direction={"row"} alignItems={"center"} spacing={"10px"}>
                <Button
                  onClick={() => {
                    downloadBlob(document?.link || "", document?.name || "");
                  }}
                  fullWidth
                >
                  Download
                </Button>
                {(canUpdate || isModerator) && !disableUpdate && (
                  <Button onClick={() => setIsUpdateMode(true)} variant="outlined" fullWidth>
                    Update
                  </Button>
                )}
              </Stack>
            </Stack>
          ) : (
            <Box>
              <Stack px="16px" mt="30px" spacing={"20px"}>
                {!isModerator && (
                  <>
                    {Boolean(document) ? (
                      <MobileB1MGray900>UPDATE DOCUMENT </MobileB1MGray900>
                    ) : (
                      <MobileB1MGray900>ADD NEW DOCUMENT</MobileB1MGray900>
                    )}
                  </>
                )}
                <Box>
                  <TextField
                    fullWidth
                    onChange={(e) => handleChange("name", e.target.value)}
                    name="documentName"
                    value={formState.name}
                    label="Name"
                  />
                  {error?.name?.map((error, i) => (
                    <Box key={i}>
                      <ErrorText>{error}</ErrorText>
                    </Box>
                  ))}
                </Box>

                {isModerator && formType === "CLIENT" && (
                  <Box>
                    <SelectWithStatus
                      label="Status"
                      items={[
                        { id: "COMPLETED", label: "Approved", status: "green" },
                        { id: "REJECTED", label: "Rejected", status: "red" },
                        { id: "PENDING", label: "Pending", status: "orange" },
                      ]}
                      value={formState.status}
                      onChange={(e) => handleChange("status", e.target.value)}
                    />
                  </Box>
                )}

                {isModerator && (
                  <Box>
                    <MultilineTextFields
                      value={formState.message}
                      onChange={(e) => handleChange("message", e.target.value)}
                      rows={5}
                      label="Write your message here"
                    />
                    {error?.message?.map((error, i) => (
                      <Box key={i}>
                        <ErrorText>{error}</ErrorText>
                      </Box>
                    ))}
                  </Box>
                )}

                {canUpdate && !document && (
                  <Box>
                    <FileUpload
                      handleReset={() => handleReset("document")}
                      files={files}
                      setFiles={setFiles}
                      label="Add document"
                      prefix={`user_${userData?.id}${formState?.name?.trim() ? `document_${formState.name}` : ""}`}
                      isDoc
                    />
                    {error?.document?.map((error, i) => (
                      <Box key={i}>
                        <ErrorText>{error}</ErrorText>
                      </Box>
                    ))}
                  </Box>
                )}
              </Stack>
              <Stack px="16px" mt="32px" direction={"row"} alignItems={"center"} spacing={"10px"}>
                {isUpdateMode && (
                  <Button fullWidth onClick={() => setIsUpdateMode(false)}>
                    Back
                  </Button>
                )}
                <LoadingButton
                  fullWidth
                  variant={isUpdateMode ? "outlined" : "contained"}
                  loadingPosition="end"
                  loading={loading}
                  onClick={handleSubmit}
                >
                  Submit
                </LoadingButton>
              </Stack>
            </Box>
          )}
        </div>
      </div>
    </Drawer>
  );
}

export { DocumentForm };
