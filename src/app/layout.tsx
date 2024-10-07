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
  title: "Find the Second Largest Number - Global SEO",
  description: "This application finds the second largest number among the entered numbers.",
  keywords: "SEO, second largest number, algorithm, numbers",
  openGraph: {
    title: "Find the Second Largest Number",
    description: "An algorithm that finds the second largest number among the entered numbers.",
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
