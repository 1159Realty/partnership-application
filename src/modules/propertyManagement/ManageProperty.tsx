"use client";

import { Drawer } from "@/components/drawer";
import { useUrl } from "@/hooks/useUrl";
import { MobileB2MGray900 } from "@/utils/typography";
import { Divider } from "@/components/divider";
import { SelectWithStatus } from "@/components/Inputs/Select";
import { PropertyDetail } from "@/components/property/PropertyDetail";
// import { PropertyOverview } from "@/components/property/PropertyOverview";
import { PropertyClients } from "@/components/property/PropertyClients";

function ManageProperty() {
  const { removeQuery, getQuery } = useUrl();

  const query = "managedPropertyId";
  const value = getQuery(query);

  const onClose = () => {
    removeQuery(query);
  };

  return (
    <Drawer isOpen={Boolean(value)} handleClose={onClose}>
      <div className="flex flex-col gap-4 mt-8 mb-16">
        <div className="px-4">
          <PropertyDetail />
        </div>
        <Divider />

        <div className="px-4">{/* <PropertyOverview /> */}</div>
        <Divider />

        <div className="flex flex-col gap-4 px-4">
          <MobileB2MGray900>Property Status</MobileB2MGray900>
          <SelectWithStatus
            label="Status"
            items={[
              { id: "available", label: "Available", status: "green" },
              { id: "sold-out", label: "Sold Out", status: "red" },
              { id: "archived", label: "Archived", status: "darkgrey" },
            ]}
          />
        </div>
        <Divider />

        <div className="flex flex-col gap-4 px-4">
          <MobileB2MGray900>Clients</MobileB2MGray900>
          <PropertyClients />
        </div>
        <Divider />
      </div>
    </Drawer>
  );
}

export { ManageProperty };
