import type { Metadata } from "next";
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

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
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.ReactElement {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <AppRouterCacheProvider>
            <header>
              <SignedOut>
                <SignInButton />
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </header>
            <main>{children}</main>
          </AppRouterCacheProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
