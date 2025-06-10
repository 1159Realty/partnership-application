import { IInvoice } from "@/lib/api/invoice/invoice.types";
import { formatCurrency } from "../numbers";
import { getUserName } from "../string";
import { User } from "@/lib/api/user/user.types";
import { getDateTimeString } from "../dateTime";
import { COLORS, SEVERITY_COLORS } from "@/utils/colors";

import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toDataURL } from "../blob";

if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

async function generateInvoicePDF(invoice: IInvoice, userData: User | null) {
  const today = new Date().toISOString();
  const customerName = getUserName(userData);
  const propertyName = invoice?.enrolment?.property?.propertyName || "-";

  const logoImage = await toDataURL("/assets/logo.jpeg");
  const { totalAmount = 0, amount = 0, interestAmount = 0, overDueAmount = 0, status, invoiceNum = 0 } = invoice;

  const isPaid = status === "PAID";
  const statusMessage = status === "PAID" ? "Payment Successful" : "Payment Pending";

  const docDefinition = {
    pageSize: {
      width: 350,
      height: 450,
    },
    pageMargins: [20, 20, 20, 30],
    content: [
      {
        columns: [
          {
            image: logoImage,
            width: 40,
            height: 40,
          },
          {
            alignment: "right",
            stack: [
              { text: isPaid ? "RECEIPT" : "INVOICE", style: "header" },
              { text: `#${invoiceNum}`, style: "subheader" },
            ],
          },
        ],
      },
      {
        margin: [0, 30, 0, 40],
        columns: [
          {
            alignment: "center",
            stack: [
              { text: formatCurrency(totalAmount), style: "amount" },
              { text: statusMessage, style: isPaid ? "success" : "pending", margin: [0, 3, 0, 3] },
              { text: getDateTimeString(today), style: "date" },
            ],
          },
        ],
      },
      {
        table: {
          widths: ["*", 200],
          body: [
            [
              {
                margin: [0, 5],
                border: [false, false, false, false],
                stack: [{ text: "Customer", style: "reasonLabel", alignment: "left" }],
              },
              {
                margin: [0, 5],
                border: [false, false, false, false],
                stack: [{ text: "Property name", style: "reasonLabel", alignment: "left" }],
              },
            ],
            [
              {
                margin: [0, 5],
                border: [false, true, false, true],
                stack: [{ text: customerName, style: "reasonValue", alignment: "left" }],
              },
              {
                margin: [0, 5],
                border: [false, true, false, true],
                stack: [{ text: propertyName, style: "reasonValue", alignment: "left" }],
              },
            ],
            [
              {
                border: [false, false, false, false],
                stack: [{ text: "" }],
              },
              {
                border: [false, false, false, false],
                stack: [
                  {
                    table: {
                      widths: ["*", "auto"],
                      body: [
                        [
                          {
                            border: [false, false, false, false],
                            margin: [0, 10, 0, 0],
                            alignment: "left",
                            stack: [{ text: "Amount", style: "totalLabel" }],
                          },
                          {
                            margin: [0, 10, 0, 0],
                            border: [false, false, false, false],
                            alignment: "left",
                            stack: [
                              {
                                text: formatCurrency(amount - interestAmount),
                                style: "totalAmount",
                                alignment: "left",
                              },
                            ],
                          },
                        ],
                        [
                          {
                            border: [false, false, false, false],
                            alignment: "left",
                            stack: [{ text: "Interest", style: "totalLabel" }],
                          },
                          {
                            border: [false, false, false, false],
                            alignment: "left",
                            stack: [{ text: formatCurrency(interestAmount), style: "totalAmount", alignment: "left" }],
                          },
                        ],
                        [
                          {
                            margin: [0, 0, 0, 10],
                            border: [false, false, false, false],
                            alignment: "left",
                            stack: [{ text: "Overdue", style: "totalLabel" }],
                          },
                          {
                            border: [false, false, false, false],
                            alignment: "left",
                            stack: [{ text: formatCurrency(overDueAmount), style: "totalAmount", alignment: "left" }],
                          },
                        ],
                        [
                          {
                            margin: [0, 5],
                            stack: [{ text: "Total", style: "totalLabel" }],
                          },
                          {
                            margin: [0, 5],
                            stack: [{ text: formatCurrency(totalAmount), style: "totalAmount", alignment: "left" }],
                          },
                        ],
                      ],
                    },
                    layout: {
                      hLineWidth: () => 2,
                      vLineWidth: () => 0,
                      hLineColor: () => COLORS.greenNormal,
                    },
                  },
                ],
              },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0,
          hLineColor: () => "gray",
        },
      },
    ],
    footer: () => ({
      margin: [20, 0, 20, 20],
      table: {
        widths: ["*"],
        body: [
          [
            {
              border: [false, true, false, false],
              stack: [
                {
                  text: `Thank you for choosing 1159 Realty as your trusted real estate partner.`,
                  style: "phrase",
                  alignment: "center",
                },
              ],
            },
          ],
        ],
      },
      layout: {
        hLineWidth: () => 0.5,
        vLineWidth: () => 0,
        hLineColor: () => "gray",
        hLineStyle: () => ({ dash: { length: 2, space: 2 } }),
      },
    }),
    styles: {
      header: { fontSize: 16, bold: true, color: COLORS.blackNormal },
      subheader: { fontSize: 10, color: "gray" },
      amount: { fontSize: 20, bold: true },
      date: { fontSize: 8, color: "gray" },
      label: { fontSize: 8, color: "gray" },
      success: { fontSize: 12, color: "green" },
      pending: { fontSize: 12, color: SEVERITY_COLORS.warning.dark },
      totalLabel: { fontSize: 10, color: "black", bold: true },
      totalAmount: { fontSize: 10, color: "black", bold: false },
      reasonLabel: { fontSize: 10, color: "black", bold: true },
      reasonValue: { fontSize: 10, color: "gray", bold: true },
      phrase: { fontSize: 8, color: "gray", bold: false },
    },
  };
  pdfMake.createPdf(docDefinition).download(`Invoice_${invoiceNum}.pdf`);
}

export { generateInvoicePDF };
