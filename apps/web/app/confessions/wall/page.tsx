import { SparklesText } from '@/components/magicui/sparkles-text'
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import React from 'react'

function page() {

  const words = `They say walls have ears — this one has a heart on the other side too !`;

  return (
    <div className='container min-h-screen py-10'> 
        <div className='relative'>
            <SparklesText className='text-5xl md:text-7xl lg:text-9xl tracking-tighter font-medium'>Confession Wall</SparklesText>
            <TextGenerateEffect className='text-rose-50 text-xl mx-4' words={words} />
        </div>
    </div>
  )
}

export default page