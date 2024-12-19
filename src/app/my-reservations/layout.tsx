import { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Toplantılarım",
  description: "Kişisel toplantı rezervasyonlarınızı görüntüleyin ve yönetin. Yaklaşan toplantılarınızı takip edin.",
  keywords: ["toplantılarım", "kişisel rezervasyonlar", "toplantı takibi", "oda filtreleme"],
  openGraph: {
    title: "Toplantılarım | Toplantı Odası Rezervasyonu",
    description: "Kişisel toplantı rezervasyonlarınızı görüntüleyin ve yönetin",
    images: [
      {
        url: "/images/my-reservations-preview.png",
        width: 1200,
        height: 630,
        alt: "Toplantılarım Sayfası",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Toplantılarım | Toplantı Odası Rezervasyonu",
    description: "Kişisel toplantı rezervasyonlarınızı görüntüleyin ve yönetin",
    images: ["/images/my-reservations-preview.png"],
  },
};

export default function MyReservationsLayout({ children }: { children: ReactNode }): ReactNode {
  return children;
}
