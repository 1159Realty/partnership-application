import type { Metadata, Viewport } from "next";

import "../styles/globals.css";

import { AppWrapper } from "@/components/appWrapper";

export const metadata: Metadata = {
  title: "1159Realty | Premium Properties, Endless Possibilities",
  description:
    "Discover premium land and property investment opportunities across Nigeria and beyond with 1159Realty. Trusted by over 2,500 clients, we provide verified titles, expert advice, and transparent transactions.",
  keywords: [
    "1159Realty",
    "real estate Nigeria",
    "land for sale",
    "buy property Ibadan",
    "real estate investment",
    "agricultural land Nigeria",
    "trusted real estate agency",
    "property listings",
    "plots for sale Nigeria",
    "luxury real estate",
  ],
  authors: [{ name: "1159Realty", url: "https://www.1159realty.com" }],
  creator: "1159Realty",
  publisher: "1159Realty",
  metadataBase: new URL("https://www.1159realty.com"),
  openGraph: {
    title: "1159Realty | Premium Properties, Endless Possibilities",
    description:
      "Discover premium land and property investment opportunities across Nigeria and beyond with 1159Realty. Over 45 agents and trusted by 2,500+ happy clients.",
    url: "https://www.1159realty.com",
    siteName: "1159Realty",
    type: "website",
    images: [
      {
        url: "/logo.jpeg",
        width: 1200,
        height: 630,
        alt: "1159Realty - Premium Properties",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "1159Realty | Premium Properties, Endless Possibilities",
    description:
      "Discover premium land and property investment opportunities across Nigeria and beyond with 1159Realty. Over 45 agents and trusted by 2,500+ happy clients.",
    images: ["/logo.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  category: "Real Estate",

  icons: {
    icon: "/favicon/favicon.ico",
    shortcut: "/favicon/favicon.ico",
    apple: "/favicon/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        rel: "icon",
        url: "/favicon/favicon.svg",
        type: "image/svg+xml",
      },
      {
        rel: "apple-touch-icon",
        url: "/favicon/apple-touch-icon.png",
        type: "image/svg+xml",
        sizes: "180x180",
      },
      {
        rel: "manifest",
        url: "/favicon/site.webmanifest",
      },
    ],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
