import { Metadata } from "next";

interface Args {
  title: string;
  description?: string;
  keywords?: string[];
}

function getPageMetaData({ title, description, keywords }: Args): Metadata {
  description =
    description ||
    "1159 realty is a unique real estate firm that focuses on bridging the gap between the capital intensiveness of the real estate industry and the young investor.";

  const url = "https://1159realty.com/";

  return {
    title,
    description,
    viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    keywords: keywords || ["1159", "1159 Reality", "Real estate", "Nigeria", "Realtor"],
    authors: [{ name: "1159 Reality", url }],
    creator: "1159 Reality",
    publisher: "1159 Reality",
    robots: "index, follow",
    icons: {
      icon: "/favicon.ico",
      apple: "/apple-touch-icon.png",
    },
    openGraph: {
      title: title,
      description,
      url,
      siteName: "My App",
      images: [
        {
          url: "https://yourwebsite.com/og-image.jpg",
          width: 1200,
          height: 630,
          alt: "My App Preview",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "My App",
      description: "A modern web application built with Next.js 15",
      images: ["https://yourwebsite.com/twitter-image.jpg"],
      creator: "@yourhandle",
    },
    alternates: {
      canonical: "https://yourwebsite.com",
      languages: {
        "en-US": "https://yourwebsite.com/en",
        "es-ES": "https://yourwebsite.com/es",
      },
    },
  };
}

export { getPageMetaData };
