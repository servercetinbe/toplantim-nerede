import React from "react";
import { Metadata } from "next";
import Head from "next/head";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { ClientWrapper } from "../components/ClientWrapper";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

export const metadata: Metadata = {
  metadataBase: new URL("https://toplantim-nerede.vercel.app"),
  title: {
    default: "Toplantı Odası Rezervasyonu",
    template: "%s | Toplantı Odası Rezervasyonu",
  },
  description: "Verimli toplantılar için online rezervasyon sistemi",
  keywords: ["rezervasyon", "toplantı odası", "şirket", "etkinlik planlama"],
  authors: [{ name: "Bookease" }],
  creator: "Bookease",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Toplantı Odası Rezervasyonu",
    title: "Toplantı Odası Rezervasyonu",
    description: "Verimli toplantılar için online rezervasyon sistemi",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Toplantı Odası Rezervasyonu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toplantı Odası Rezervasyonu",
    description: "Verimli toplantılar için online rezervasyon sistemi",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#ffffff",
};

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <Head>
        <title>Toplantı Odası Rezervasyonu</title>
        <meta name="description" content="Verimli toplantılar için online rezervasyon sistemi." />
        <meta name="keywords" content="rezervasyon, toplantı odası, şirket, etkinlik planlama" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <head />
      <body>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientWrapper>
            <Navbar />
            {children}
            <Footer />
          </ClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
