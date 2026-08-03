import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getRequestLocale } from "@/lib/i18n-server";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://albertoacademy.com"),
  title: "Alberto Academy | Inglés online para hablar con seguridad",
  description:
    "Academia de idiomas online dirigida por Alberto A. Sosa. Clases de inglés por niveles, privadas y grupales, con conversación inicial gratuita.",
  openGraph: {
    title: "Alberto Academy | Hable Inglés con Confianza",
    description:
      "Aprenda inglés de forma progresiva, practique conversaciones reales y gane seguridad con una guía profesional.",
    url: "https://albertoacademy.com",
    siteName: "Alberto Academy",
    images: [
      {
        url: "/images/alberto-academy-og.jpg",
        width: 1200,
        height: 630,
        alt: "Alberto Academy — Hable Inglés con Confianza",
        type: "image/jpeg",
      },
      {
        url: "/images/alberto-academy-og.png",
        width: 1731,
        height: 909,
        alt: "Alberto Academy — Hable Inglés con Confianza",
        type: "image/png",
      },
    ],
    locale: "es_DO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Alberto Academy | Hable Inglés con Confianza",
    description:
      "Aprenda inglés de forma progresiva, practique conversaciones reales y gane seguridad con una guía profesional.",
    images: ["/images/alberto-academy-og.jpg"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getRequestLocale();

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable} scroll-smooth`}>
      <body>{children}</body>
    </html>
  );
}
