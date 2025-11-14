import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI-Driven Real-Time Disaster Management System",
  description: "Emergency-first interface for real-time disaster alerts, SOS services, and emergency coordination",
  keywords: ["disaster management", "emergency response", "SOS", "real-time alerts", "safety"],
  authors: [{ name: "Disaster Management System" }],
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
  themeColor: "#dc2626",
  icons: {
    icon: "/icons/disaster-icon.png",
    apple: "/icons/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
