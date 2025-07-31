import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { StarsBackground } from "@/components/ui/stars-background"; 
import { ShootingStars } from "@/components/ui/shooting-stars";
import { Analytics } from '@vercel/analytics/next';


const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
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
        className={`${robotoSans.variable} ${robotoMono.variable} antialiased relative bg-black text-white`}
      >
        <StarsBackground className="absolute inset-0 -z-10 pointer-events-none" />
        <ShootingStars className="absolute inset-0 -z-10 pointer-events-none" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
