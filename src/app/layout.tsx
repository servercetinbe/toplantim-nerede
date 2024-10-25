import React from "react";
import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { EmotionCache } from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import createEmotionServer from "@emotion/server/create-instance";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";

import createEmotionCache from "../utility/createEmotionCache";

import "./globals.css";

// Metadata for SEO
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

// Create Emotion cache
const cache = createEmotionCache();

export default async function RootLayout({ children }: { children: React.ReactNode }): Promise<React.ReactElement> {
  const locale = await getLocale();
  const messages = await getMessages();

  const { extractCriticalToChunks } = createEmotionServer(cache);

  // Extract critical CSS for Emotion
  const emotionChunks = extractCriticalToChunks("<!DOCTYPE html><html>...</html>");
  const emotionStyleTags = emotionChunks.styles.map(style => (
    <style
      key={style.key}
      data-emotion={`${style.key} ${style.ids.join(" ")}`}
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  return (
    <ClerkProvider>
      <CacheProvider value={cache}>
        {" "}
        <html lang={locale}>
          <head>
            {emotionStyleTags}
          </head>
          <body>
            <NextIntlClientProvider locale={locale} messages={messages}>
              <header style={{ display: "flex", justifyContent: "space-between", padding: "10px 20px" }}>
                <div>
                  <SignedOut />
                  <SignedIn>
                    <UserButton afterSignOutUrl="/" />
                  </SignedIn>
                </div>
              </header>
              {children}
            </NextIntlClientProvider>
          </body>
        </html>
      </CacheProvider>
    </ClerkProvider>
  );
}
