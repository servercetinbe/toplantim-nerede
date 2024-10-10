"use client";

import { useEffect, useState } from "react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import { NextIntlClientProvider } from "next-intl";

interface LayoutClientProps {
  children: React.ReactNode;
}

export default function LayoutClient({ children }: LayoutClientProps): React.ReactElement {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState({});

  useEffect(() => {
    const loadLocaleMessages = async (locale: string) => {
      const loadedMessages = (await import(`../../messages/${locale}.json`)).default;
      setMessages(loadedMessages);
    };

    const currentLocale = document.cookie
      .split("; ")
      .find(row => row.startsWith("NEXT_LOCALE="))
      ?.split("=")[1];

    if (currentLocale) {
      setLocale(currentLocale);
      loadLocaleMessages(currentLocale);
    } else {
      loadLocaleMessages("en");
    }
  }, []);

  return (
    <AppRouterCacheProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <header>
          <SignedOut>
            <SignInButton />
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
        <main>{children}</main>
      </NextIntlClientProvider>
    </AppRouterCacheProvider>
  );
}
