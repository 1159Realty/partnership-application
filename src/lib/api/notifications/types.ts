export type NotificationType =
  // document
  | "new-document-group"
  | "document-approved"
  | "document-rejected"
  //   invoice
  | "invoice-payment-reminder"
  //   property
  | "new-property"
  //enrollment
  | "new-enrollment"
  | "enrollment-cancelled"
  | "enrollment-resumed"
  | "enrollment-complete"
  //   appointment
  | "new-appointment"
  //   interests
  | "new-interest"
  //   support
  | "new-support"
  | "support-resolved"
  //   partnership
  | "new-partnership-request"
  | "partnership-approved"
  //   account details
  | "update-account-details";

export interface INotification {
  id: string;
  unReadCount: number;
  isRead: boolean;
  type: NotificationType;
  data: unknown;
  timeStamp: string;
}

export interface FetchNotificationArgs {
  page?: number;
  limit?: number;
}
