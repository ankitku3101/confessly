"use client";
import React from "react";
import Hero from "./sections/Hero";
import Image from "next/image";
// import ProductShowcase from "./sections/ProductShowcase";

export default function Home() {
  return (
    <div className="bg-black/[0.98] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <Image
            alt="background"
            width={1920}
            height={1080}
            src={"https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"}
            className="[mask-image:radial-gradient(75%_75%_at_center,black,transparent)] opacity-50 w-full h-full object-cover"
        />
      </div>
      <Hero />
    </div>
  );
}
