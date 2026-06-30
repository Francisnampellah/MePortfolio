import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://baraka-nampellah.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Baraka Nampellah — Full-Stack Software Engineer",
  description:
    "Full-Stack Software Engineer from Dar es Salaam building scalable backends, mobile apps, and AI-ready systems with NestJS, React, Flutter, and PostgreSQL.",
  keywords: [
    "Baraka Nampellah",
    "Full-Stack Engineer",
    "NestJS",
    "React",
    "Next.js",
    "Flutter",
    "TypeScript",
    "PostgreSQL",
    "Dar es Salaam",
  ],
  authors: [{ name: "Baraka Francis Nampellah" }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Baraka Nampellah — Full-Stack Software Engineer",
    description:
      "Building scalable backends, mobile apps, and AI-ready systems.",
    siteName: "Baraka Nampellah",
  },
  twitter: {
    card: "summary_large_image",
    title: "Baraka Nampellah — Full-Stack Software Engineer",
    description:
      "Building scalable backends, mobile apps, and AI-ready systems.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
