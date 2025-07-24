"use client";

import React, { useEffect } from "react";
import Hero from "./sections/Hero";
import { MagicCursor } from "@/components/MagicCursor";

export default function Home() {

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ping`).catch(() => {});
  }, []);

  return (
    <main id="hero" className="relative min-h-screen overflow-hidden bg-black antialiased">
      <div className="relative hero">
        <MagicCursor />
        <Hero />
      </div>
    </main>
  );
}
