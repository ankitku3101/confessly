import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chat | Confessly",
};

export default function ChatLayout({children}: {children: React.ReactNode}) {
    return <>
      {children}
    </>
}