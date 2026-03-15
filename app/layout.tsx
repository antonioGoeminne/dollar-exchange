import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Header } from "@/features/layout/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Precio del Dólar hoy en Argentina | Blue, Oficial, MEP y Cripto",
    template: "%s | Dólar Argentina",
  },
  description:
    "Cotización del dólar: blue, oficial, MEP, CCL, cripto y más. Actualizado para Argentina.",
  keywords: [
    "dólar",
    "dólar blue",
    "dólar oficial",
    "dólar MEP",
    "dólar cripto",
    "cotización dólar",
    "Argentina",
  ],
  authors: [{ name: "Toni" }],
  openGraph: {
    title: "Precio del Dólar hoy en Argentina",
    description: "Cotización del dólar: blue, oficial, MEP, CCL, cripto y más.",
    type: "website",
    locale: "es_AR",
    images: [
      {
        url: "https://dollar-exchange.vercel.app/logo-dollar.webp",
        width: 1200,
        height: 630,
        alt: "Precio del Dólar hoy en Argentina",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Precio del Dólar hoy en Argentina",
    description: "Cotización del dólar: blue, oficial, MEP, CCL, cripto y más.",
    images: [
      {
        url: "https://dollar-exchange.vercel.app/logo-dollar.webp",
        width: 1200,
        height: 630,
        alt: "Precio del Dólar hoy en Argentina",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://dollar-exchange.vercel.app",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute={"data-theme"}
          defaultTheme="system"
          enableSystem
        >
          <Header />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
