"use client";

import { Drawer } from "@/components/drawer";
import { Box, Stack } from "@mui/material";
import { AutoCompleteWithSub, AutoCompleteWithSubOptions } from "../Inputs";
import { Button, IconButton, LoadingButton } from "../buttons";
import { MobileB1MGray500, MobileB1MGray900, MobileB2MGray900, MobileH2SM } from "@/utils/typography";
import { Divider } from "../divider";
import { PaginatedResponse } from "@/lib/api/api.types";
import { User } from "@/lib/api/user/user.types";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useUser } from "@/lib/api/user/useUser";
import { getUserName } from "@/services/string";
import { COLORS } from "@/utils/colors";
import { X } from "@phosphor-icons/react/dist/ssr";
import { useCampaign } from "@/lib/api/campaign/useCampaign";
import { ICampaignRecipientsGroup } from "@/lib/api/campaign/types";

interface Props {
  show: boolean;
  onClose?: () => void;
  usersData: PaginatedResponse<User> | null;
  recipientGroup: ICampaignRecipientsGroup | null;
  onSubmit?: () => void;
}

function CampaignRecipientForm({ show, onClose, usersData, recipientGroup, onSubmit }: Props) {
  const { fetchUsers } = useUser();
  const { addCampaignRecipients } = useCampaign();

  const [selectedRecipient, setSelectedRecipient] = useState<AutoCompleteWithSubOptions | null>(null);
  const [selectedRecipients, setSelectedRecipients] = useState<AutoCompleteWithSubOptions[]>([]);

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(usersData);
  const [addRecipientsLoading, setAddRecipientsLoading] = useState(false);

  const [usersQuery, setUsersQuery] = useState("");
  const [debouncedQuery] = useDebounce(usersQuery, 700);

  function handleAddRecipient() {
    if (!selectedRecipient || selectedRecipients.some((x) => x.id === selectedRecipient.id)) return;
    setSelectedRecipients((p) => [...p, selectedRecipient]);
    setSelectedRecipient(null);
  }
  function handleRemoveRecipient(recipient: AutoCompleteWithSubOptions) {
    setSelectedRecipients((p) => p.filter((r) => r.id !== recipient.id));
  }

  async function handleSubmit() {
    if (!recipientGroup || !selectedRecipients.length) return;
    setAddRecipientsLoading(true);
    const res = await addCampaignRecipients(
      recipientGroup?.id,
      recipientGroup?.brevoListId,
      selectedRecipients?.map((x) => x.id)
    );
    if (res) {
      onSubmit?.();
      onClose?.();
    }

    setAddRecipientsLoading(false);
  }

  useEffect(() => {
    async function fetchUsersAsync() {
      const response = await fetchUsers({ byClientOnly: true, keyword: debouncedQuery });
      if (response) {
        setUsers(response);
      }
    }
    fetchUsersAsync();
  }, [fetchUsers, debouncedQuery]);

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
                <LoadingButton loadingPosition="end" loading={addRecipientsLoading} onClick={handleSubmit} fullWidth>
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

export { CampaignRecipientForm };
