"use client";

import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { NoListItemCard } from "@/components/cards/NoItemCard";
import { Users } from "@phosphor-icons/react/dist/ssr";
import { PaginatedResponse } from "@/lib/api/api.types";
import { useDebounce } from "use-debounce";
import { User } from "@/lib/api/user/user.types";
import { Search } from "@/components/Inputs";
import { ClientTable } from "@/components/tables/ClientTable";
import { useUser } from "@/lib/api/user/useUser";

interface Props {
  usersData: PaginatedResponse<User> | null;
}

function Main({ usersData }: Props) {
  const { fetchUsers } = useUser();

  const [users, setUsers] = useState<PaginatedResponse<User> | null>(usersData);
  const [page, setPage] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounceSearchQuery] = useDebounce(searchQuery, 700);

  const hasItem = Boolean(users?.items?.length);

  function onPageChange(_: unknown, newPage: number) {
    setPage(newPage);
  }

  function onLimitChange(event: React.ChangeEvent<HTMLInputElement>) {
    setLimit(+event.target.value);
    setPage(0);
  }

  useEffect(() => {
    async function fetchUsersAsync() {
      const response = await fetchUsers({
        page: page + 1,
        limit,
        byClientOnly: true,
        keyword: debounceSearchQuery,
      });

      setUsers(response);
    }

    fetchUsersAsync();
  }, [debounceSearchQuery, fetchUsers, limit, page]);

  return (
    <Box>
      <Box maxWidth={350} my="32px">
        <Search
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
          }}
        />
      </Box>
      {!hasItem ? (
        <NoListItemCard
          Icon={Users}
          noItemCreatedDescription="No Clients to show"
          noItemFoundDescription="Client not found"
          noItemCreated={Boolean(!users?.items?.length && !users?.items?.length)}
        />
      ) : (
        <Box>
          <Box mt="32px">
            <ClientTable onLimitChange={onLimitChange} onPageChange={onPageChange} page={page} limit={limit} data={users} />
          </Box>
        </Box>
      )}
    </Box>
  );
}

export { Main };
