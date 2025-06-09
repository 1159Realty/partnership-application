import { fetchNotifications } from "@/lib/api/notifications/server";
import { ModulePageWrapper } from "@/styles/globals.styles";
import React from "react";
import Main from "./Main";

async function Notifications() {
  const notificationsDataResponse = fetchNotifications();
  const [notificationsData] = await Promise.all([notificationsDataResponse]);

  return (
    <ModulePageWrapper>
      <Main notificationsData={notificationsData} />
    </ModulePageWrapper>
  );
}

export default Notifications;
