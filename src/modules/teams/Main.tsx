"use client";
import { Button } from "@/components/buttons";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { ITeamFilter, TeamFilters } from "@/components/filters/TeamFilters";
import { TeamForm } from "@/components/forms/TeamForm";
import { TeamTable } from "@/components/tables/TeamTable";
import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import { User } from "@/lib/api/user/user.types";
import { useUser } from "@/lib/api/user/useUser";
import { Box, Stack } from "@mui/material";
import { MapPinLine, Plus } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

interface Props {
  usersData: PaginatedResponse<User> | null;
}

function Main({ usersData }: Props) {
  const { fetchUsers } = useUser();

  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(usersData);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [filters, setFilters] = useState<ITeamFilter>({});
  const [query, setQuery] = useState("");
  const [debounceQuery] = useDebounce(query, 700);
  const [reload, setReload] = useState(false);

  const hasItem = Boolean(users?.items?.length);

  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }

  function onRowClick(user: User) {
    setUser(user);
  }

  function handleHideForm() {
    setShowForm(false);
    setUser(null);
  }

  function onAddMember() {
    setReload(!reload);
  }

  useEffect(() => {
    async function fetchUsersAsync() {
      const response = await fetchUsers({
        page: page + 1,
        limit,
        byModerators: true,
        keyword: debounceQuery,
        roleId: filters?.roleId,
      });

      setUsers(response);
    }

    fetchUsersAsync();
  }, [debounceQuery, fetchUsers, filters?.roleId, limit, page, reload]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <PageTitle mr={"5px"}>Team</PageTitle>
        {hasItem && (
          <Button onClick={() => setShowForm(true)} startIcon={<Plus weight="bold" />}>
            Add new
          </Button>
        )}
      </Stack>

      <Box my="32px">
        <TeamFilters filters={filters} setFilters={setFilters} setQuery={setQuery} query={query} />
      </Box>

      <Box>
        {!hasItem ? (
          <NoListItemCard
            action="Add team member"
            Icon={MapPinLine}
            onClick={() => setShowForm(true)}
            noItemCreatedDescription="No team member added"
            noItemFoundDescription="No member found"
            noItemCreated={Boolean(!users?.items?.length && !usersData?.items?.length)}
          />
        ) : (
          <Box>
            <Box mt="32px">
              <TeamTable
                onLimitChange={onLimitChange}
                onRowClick={onRowClick}
                onPageChange={onPageChange}
                page={page}
                limit={limit}
                data={users}
              />
            </Box>
          </Box>
        )}

        <TeamForm onCreate={onAddMember} user={user} isOpen={showForm || Boolean(user)} onClose={handleHideForm} />
      </Box>
    </Box>
  );
}

export { Main };
