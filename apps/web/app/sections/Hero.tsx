import { Spotlight } from '@/components/ui/spotlight-new'
import React from 'react'
import ProductShowcase from './ProductShowcase'

export default function Hero() {
  return (
    <div className="min-h-full w-full flex flex-col md:items-center md:justify-center antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <Spotlight />
        <div className='p-20'>
            <div className=" p-4 max-w-7xl  mx-auto relative z-10 w-full pt-20 md:pt-0">
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50 p-4">
                WebSockets Playground
            </h1>
            <p className="mt-4 font-normal text-base text-neutral-300 w-full text-center mx-auto">
                A hands-on collection of real-time projects using WebSockets and WebRTC.
            </p>
            </div>
            <ProductShowcase />
        </div>
    </div>
  )
}