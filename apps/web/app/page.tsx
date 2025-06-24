"use client";
import React from "react";
import { Spotlight } from "@/components/ui/spotlight-new";

export default function Home() {
  return (
    <div className="min-h-screen w-full flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center">
        <img
          alt="background"
          src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/patterns/square-alt-grid.svg"
          className="[mask-image:radial-gradient(75%_75%_at_center,black,transparent)] opacity-20 w-full h-full object-cover"
        />
      </div>
      <Spotlight />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10 w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 p-4">
          WebSockets Playground
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 w-full text-center mx-auto">
          A hands-on collection of real-time projects using WebSockets and WebRTC.
        </p>
      </div>
    </div>
  );
}
