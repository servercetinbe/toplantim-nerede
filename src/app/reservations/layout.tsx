import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rezervasyonlar",
  description: "Tüm toplantı odası rezervasyonlarınızı görüntüleyin ve yönetin",
  keywords: ["rezervasyonlar", "toplantı odası", "rezervasyon yönetimi"],
  openGraph: {
    title: "Rezervasyonlar | Toplantı Odası Rezervasyonu",
    description: "Tüm toplantı odası rezervasyonlarınızı görüntüleyin ve yönetin",
    images: [
      {
        url: "/images/reservations-preview.png",
        width: 1200,
        height: 630,
        alt: "Rezervasyonlar Sayfası",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rezervasyonlar | Toplantı Odası Rezervasyonu",
    description: "Tüm toplantı odası rezervasyonlarınızı görüntüleyin ve yönetin",
    images: ["/images/reservations-preview.png"],
  },
};

export default function ReservationsLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
