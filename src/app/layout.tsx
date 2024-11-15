import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import { ClientWrapper } from "../components/ClientWrapper";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<JSX.Element> {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
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
