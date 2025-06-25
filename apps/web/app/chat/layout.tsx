import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real-time Chat | WebSockets Playground",
};

export default function ChatLayout({children}: {children: React.ReactNode}) {
    return <>{children}</>
}