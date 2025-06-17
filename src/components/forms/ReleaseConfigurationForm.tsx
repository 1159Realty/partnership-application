"use client";

import { Drawer } from "@/components/drawer";
import { Box, Stack } from "@mui/material";
import { AutoCompleteWithSub, AutoCompleteWithSubOptions } from "../Inputs";
import { Button, IconButton, LoadingButton } from "../buttons";
import { MobileB1MGray500, MobileB1MGray900, MobileB2MGray900, MobileH2SM } from "@/utils/typography";
import { Divider } from "../divider";
import { PaginatedResponse } from "@/lib/api/api.types";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { getUserName } from "@/services/string";
import { COLORS } from "@/utils/colors";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useRelease } from "@/lib/api/release/useRelease";
import { IReleaseRecipient } from "@/lib/api/release/types";

interface SupportFormProps {
  show: boolean;
  onClose?: () => void;
  recipientsData: PaginatedResponse<IReleaseRecipient> | null;
  onSubmit?: () => void;
}

function ReleaseConfigurationForm({ show, onClose, recipientsData, onSubmit }: SupportFormProps) {
  const { addRecipients, fetchReleaseRecipients } = useRelease();

  const [selectedRecipient, setSelectedRecipient] = useState<AutoCompleteWithSubOptions | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<AutoCompleteWithSubOptions[]>([]);
  const [addingRecipients, setAddingRecipients] = useState(false);

  const [recipients, setRecipients] = useState<PaginatedResponse<IReleaseRecipient> | null>(recipientsData);

  const [recipientsQuery, setRecipientsQuery] = useState("");
  const [debouncedQuery] = useDebounce(recipientsQuery, 700);

  function handleAddRecipient() {
    if (!selectedRecipient || selectedRecipients.some((x) => x.id === selectedRecipient.id)) return;
    setSelectedRecipients((p) => [...p, selectedRecipient]);
    setSelectedRecipient(null);
  }
  function handleRemoveRecipient(recipient: AutoCompleteWithSubOptions) {
    setSelectedRecipients((p) => p.filter((r) => r.id !== recipient.id));
  }

  async function handleSubmit() {
    if (!selectedRecipients?.length) return;
    setAddingRecipients(true);
    const res = await addRecipients(selectedRecipients?.map((x) => x?.id));
    if (res) {
      onSubmit?.();
      onClose?.();
    }
    setAddingRecipients(false);
  }

  useEffect(() => {
    async function get() {
      const response = await fetchReleaseRecipients({ keyword: debouncedQuery });
      if (response) {
        setRecipients(response);
      }
    }
    get();
  }, [debouncedQuery, fetchReleaseRecipients]);

  return (
    <Drawer isOpen={show} handleClose={onClose}>
      <Box pb="48px" mt="60px">
        <Box px="16px">
          <MobileH2SM>Add Recipients</MobileH2SM>
        </Box>
        <Stack mt="32px" spacing={"20px"}>
          <Box px="16px">
            <Box mb="10px">
              <MobileB1MGray900>SELECT RECIPIENT</MobileB1MGray900>
            </Box>
            <AutoCompleteWithSub
              renderInputLabel="Recipient"
              onBlur={() => setRecipientsQuery("")}
              options={
                recipients?.items?.map((i) => ({
                  label: getUserName(i?.user),
                  sub: `${i?.user?.email}`,
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
                setRecipientsQuery(value);
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
            {selectedRecipients?.map((x) => (
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
          {Boolean(selectedRecipients.length) && (
            <>
              <Divider />
              <Box px="16px">
                <LoadingButton onClick={handleSubmit} loading={addingRecipients} loadingPosition="end" fullWidth>
                  Submit
                </LoadingButton>
              </Box>
            </>
          )}
        </Stack>
      </Box>
    </Drawer>
  );
}

export { ReleaseConfigurationForm };
