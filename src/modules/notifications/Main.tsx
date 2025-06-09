"use client";

import { NoListItemCard } from "@/components/cards/NoItemCard";
import { PageTitle } from "@/components/typography";
import { PaginatedResponse } from "@/lib/api/api.types";
import { INotification } from "@/lib/api/notifications/types";
import { useNotifications } from "@/lib/api/notifications/useNotifications";
import { Box, Skeleton, Stack } from "@mui/material";
import { BellRinging } from "@phosphor-icons/react/dist/ssr";
import React, { useEffect, useState } from "react";
import Card from "./Card";
import InfiniteScroll from "react-infinite-scroll-component";

interface Props {
  notificationsData: PaginatedResponse<INotification> | null;
}

function Main({ notificationsData }: Props) {
  const { fetchNotifications, markAllNotificationsAsRead } = useNotifications();

  const [notifications, setNotifications] = useState(notificationsData);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const hasItem = Boolean(notifications?.items?.length);

  const fetchMoreData = async () => {
    const newPage = page + 1;

    const newNotifications = await fetchNotifications({
      page: newPage,
    });

    setPage(newPage);

    if (!newNotifications?.items?.length) {
      setHasMore(false);
      return;
    }

    setNotifications((prev) => ({
      ...newNotifications,
      items: [...(prev?.items || []), ...newNotifications.items],
    }));
  };

  useEffect(() => {
    async function get() {
      const response = await fetchNotifications();
      if (response) {
        setNotifications(response);
      }
      await markAllNotificationsAsRead();
    }
    get();
  }, [fetchNotifications, markAllNotificationsAsRead]);

  return (
    <Box>
      <Stack mb="32px" rowGap={"10px"} direction={"row"} alignItems={"center"} justifyContent={"space-between"} flexWrap={"wrap"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"center"}>
          <PageTitle mr={"5px"}>
            <Box textTransform={"capitalize"}>Notifications</Box>
          </PageTitle>
        </Stack>
      </Stack>

      <Box mt="20px">
        {!hasItem ? (
          <Stack justifyContent={"center"} alignItems={"center"} width={"100%"} mt="32px">
            <NoListItemCard
              Icon={BellRinging}
              noItemCreatedDescription={`Notifications will appear here`}
              noItemCreated={Boolean(!notifications?.items?.length && !notificationsData?.items?.length)}
            />
          </Stack>
        ) : (
          <InfiniteScroll
            dataLength={notifications?.items?.length || 0}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<Skeleton height={110} />}
          >
            {notifications?.items?.map((notification) => (
              <Card key={notification?.id} notification={notification} />
            ))}
          </InfiniteScroll>
        )}
      </Box>
    </Box>
  );
}

export default Main;
