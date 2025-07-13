"use client";

import React from "react";
import Hero from "./sections/Hero";
import { MagicCursor } from "@/components/MagicCursor";

export default function Home() {
  return (
    <main id="hero" className="relative min-h-screen overflow-hidden bg-black antialiased">
      <div className="relative hero">
        <MagicCursor />
        <Hero />
      </div>
    </main>
  );
}
