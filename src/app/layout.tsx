import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Toplantım Nerede - Global SEO",
    template: "%s | toplanti-nerede",
  },
  description: "Toplantı odalarınızı yönetin ve toplantı zamanlarını kolayca planlayın.",
  keywords: ["toplantı yönetimi", "toplantı odası", "takvim", "planlama", "buluşma", "konuşma"],
  openGraph: {
    title: "Toplantım Nerede",
    description: "Toplantı odalarını ve zamanlarını kolayca yönetin.",
    locale: "tr_TR",
    type: "website",
    siteName: "toplantim-nerede",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.ReactElement> {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <ClerkProvider>
      <html lang={locale}>
        <body>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
