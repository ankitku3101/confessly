import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { MagicCursor } from "@/components/MagicCursor";
import { StarsBackground } from "@/components/ui/stars-background"; // 👈 import this
import { ShootingStars } from "@/components/ui/shooting-stars";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Confessly",
  description: "Developed by Ankit Kumar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased relative bg-black text-white overflow-hidden`}
      >
        <StarsBackground className="absolute inset-0 -z-10 pointer-events-none" />
        <ShootingStars className="absolute inset-0 -z-10 pointer-events-none" />
        <MagicCursor />
        
        {children}
      </body>
    </html>
  );
}
