"use client";

import { IDocument, IDocumentGroup } from "@/lib/api/document/document.types";
import { IEnrollment } from "@/lib/api/enrollment/types";
import { IProperty } from "@/lib/api/property/property.types";
import { ROUTES } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { ContentWrapper } from "../components/notificationAlert/styles";
import { INotification } from "@/lib/api/notifications/types";
import { Calendar, FileText, Handshake, Headset, User, UserSwitch, Warehouse } from "@phosphor-icons/react/dist/ssr";
import { Icon as SvgIcon } from "@phosphor-icons/react";
import { getUserName } from "@/services/string";
import { IAppointment } from "@/lib/api/appointment/appointment.types";
import { getIsModerator } from "@/lib/session/roles";
import { useUserContext } from "@/contexts/UserContext";

export const useNotificationAlert = (notification: INotification | null) => {
  const { push } = useRouter();
  const { userData } = useUserContext();
  const isModerator = getIsModerator(userData?.roleId);

  const [content, setContent] = useState<{
    title: ReactNode | null;
    Icon: SvgIcon | null;
    handleNavigation: () => void;
    description?: ReactNode | null;
  } | null>(null);

  useEffect(() => {
    if (!notification) {
      setContent(null);
      return;
    }
    const { type, data: rawData } = notification;

    const handleNavigation = (url: string) => {
      return () => push(url);
    };

    const parse = <T,>(data: unknown): T | null => {
      try {
        return data as T;
      } catch {
        return null;
      }
    };

    switch (type) {
      // document
      case "new-document-group": {
        const data = parse<IDocumentGroup>(rawData);
        setContent({
          title: <ContentWrapper>You have a new document request.</ContentWrapper>,
          Icon: FileText,
          handleNavigation: handleNavigation(`${ROUTES["/documents"]}/${data?.id}`),
        });
        break;
      }
      case "document-approved": {
        const data = parse<IDocument>(rawData);
        setContent({
          title: (
            <ContentWrapper>
              {isModerator ? (
                <>Document approval successful.</>
              ) : (
                <>
                  Your document <strong>{data?.name}</strong> has been approved.
                </>
              )}
            </ContentWrapper>
          ),
          Icon: FileText,
          handleNavigation: handleNavigation(`${ROUTES["/documents"]}/${data?.groupId}`),
        });
        break;
      }
      case "document-rejected": {
        const data = parse<IDocument>(rawData);
        setContent({
          title: (
            <ContentWrapper>
              {isModerator ? (
                <>Document rejection successful.</>
              ) : (
                <>
                  Your document <strong>{data?.name}</strong> has been rejected.
                </>
              )}
            </ContentWrapper>
          ),
          Icon: FileText,
          handleNavigation: handleNavigation(`${ROUTES["/documents"]}/${data?.groupId}`),
        });
        break;
      }

      // Invoice
      case "invoice-payment-reminder": {
        setContent({
          title: <ContentWrapper>You have a pending invoice payment.</ContentWrapper>,
          Icon: FileText,
          handleNavigation: handleNavigation(`${ROUTES["/invoices"]}`),
        });
        break;
      }

      // Property
      case "new-property": {
        const data = parse<IProperty>(rawData);

        setContent({
          title: (
            <ContentWrapper>
              New Listing Alert: <strong>{data?.propertyName || ""}</strong> is now available
            </ContentWrapper>
          ),
          Icon: Warehouse,
          handleNavigation: handleNavigation(`${ROUTES["/"]}?propertyId=${data?.id}`),
        });
        break;
      }

      // Enrollment
      case "new-enrollment": {
        const data = parse<IEnrollment>(rawData);
        setContent({
          title: (
            <ContentWrapper>
              You have been enrolled for <strong>{data?.property?.propertyName || ""}</strong>.
            </ContentWrapper>
          ),
          Icon: UserSwitch,
          handleNavigation: handleNavigation(`${ROUTES["/properties"]}`),
        });
        break;
      }
      case "enrollment-cancelled": {
        const data = parse<IEnrollment>(rawData);
        setContent({
          title: (
            <ContentWrapper>
              Your enrollment has been cancelled for <strong>{data?.property?.propertyName || ""}</strong>
            </ContentWrapper>
          ),
          Icon: UserSwitch,
          handleNavigation: handleNavigation(`${ROUTES["/enrollments"]}?enrollmentId=${data?.id}`),
        });
        break;
      }
      case "enrollment-resumed": {
        const data = parse<IEnrollment>(rawData);
        setContent({
          title: (
            <ContentWrapper>
              Your enrollment for <strong>{data?.property?.propertyName || ""}</strong> has been resumed.
            </ContentWrapper>
          ),
          Icon: UserSwitch,
          handleNavigation: handleNavigation(`${ROUTES["/enrollments"]}?enrollmentId=${data?.id}`),
        });
        break;
      }
      case "enrollment-complete": {
        const data = parse<IEnrollment>(rawData);
        setContent({
          title: (
            <ContentWrapper>
              <strong>{getUserName(data?.client)}</strong> has completed payment for{" "}
              <strong>{data?.property?.propertyName || ""}</strong>
            </ContentWrapper>
          ),
          Icon: UserSwitch,
          handleNavigation: handleNavigation(`${ROUTES["/enrollments"]}?enrollmentId=${data?.id}`),
        });
        break;
      }

      // Appointment
      case "new-appointment": {
        const data = parse<IAppointment>(rawData);
        setContent({
          title: <ContentWrapper>{getUserName(data?.createdBy)} booked an appointment.</ContentWrapper>,
          Icon: Calendar,
          handleNavigation: handleNavigation(`${ROUTES["/appointments"]}`),
        });
        break;
      }

      // Interest
      case "new-interest": {
        setContent({
          title: <ContentWrapper>You have a new interest notification.</ContentWrapper>,
          Icon: Warehouse,
          handleNavigation: handleNavigation(`${ROUTES["/appointment-management"]}`),
        });
        break;
      }

      // Support
      case "new-support": {
        setContent({
          title: <ContentWrapper>New support ticket received.</ContentWrapper>,
          Icon: Headset,
          handleNavigation: handleNavigation(`${ROUTES["/support-management"]}`),
        });
        break;
      }
      case "support-resolved": {
        setContent({
          title: <ContentWrapper>Your support ticket has been resolved.</ContentWrapper>,
          Icon: Headset,
          handleNavigation: handleNavigation(`${ROUTES["/support"]}`),
        });
        break;
      }

      // Partnership
      case "new-partnership-request": {
        setContent({
          title: <ContentWrapper>You have a new partnership request.</ContentWrapper>,
          Icon: Handshake,
          handleNavigation: handleNavigation(`${ROUTES["/partners"]}`),
        });
        break;
      }
      case "partnership-approved": {
        setContent({
          title: <ContentWrapper>Your partnership request has been approved.</ContentWrapper>,
          Icon: Handshake,
          handleNavigation: handleNavigation(`${ROUTES["/profile"]}`),
        });
        break;
      }

      // Account update
      case "update-account-details": {
        setContent({
          title: <ContentWrapper>Update your account details.</ContentWrapper>,
          Icon: User,
          handleNavigation: handleNavigation(`${ROUTES["/profile"]}`),
        });
        break;
      }

      default:
        setContent(null);
    }
  }, [notification, isModerator, push]);

  return {
    content,
    setContent,
  };
};
