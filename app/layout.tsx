import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import localFont from "next/font/local";

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
  title: "Buckit",
  description:
    "Buckit is a financial management app designed to help users categorize and track their finances using customizable 'buckets'. Users can allocate funds, view inflows and outflows, and gain insights into spending patterns.",
  keywords: [
    "financial management",
    "budgeting",
    "track spending",
    "savings buckets",
    "personal finance",
  ],
  authors: [{ name: "Clark Tolosa" }],
  openGraph: {
    title: "Buckit - Your Financial Management Solution",
    description:
      "Organize your finances with Buckit. Create buckets, manage transactions, and achieve your financial goals.",
    // images: "/path/to/og-image.png",
    url: "buckit.ckt.fyi",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
