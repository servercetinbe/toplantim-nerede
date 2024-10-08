import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
    <html lang="tr">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>{children}</body>
    </html>
  );
}
