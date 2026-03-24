'use client'

import React, { useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mic, MicOff, ArrowLeft } from 'lucide-react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface BookData {
  title: string
  author: string
  coverURL: string
  persona?: string
}

const BookDetailsPage = ({ 
  book 
}: { 
  book: BookData 
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const backBtnRef = useRef<HTMLAnchorElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

    tl.from(headerRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
    })
    .from(contentRef.current, {
      y: 30,
      opacity: 0,
      duration: 0.8,
    }, '-=0.5')
    .from(backBtnRef.current, {
      scale: 0,
      opacity: 0,
      duration: 0.5,
    }, '-=0.3')
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="container mx-auto px-4 py-8 max-w-4xl relative">
      {/* Floating Back Button */}
      <Link 
        href="/" 
        ref={backBtnRef}
        className="fixed top-24 left-8 md:left-12 lg:left-24 z-50 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-black"
      >
        <ArrowLeft size={24} />
      </Link>

      <div className="flex flex-col gap-6">
        {/* Header Card */}
        <div 
          ref={headerRef}
          className="bg-[#f3e4c7] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center shadow-sm"
        >
          {/* Cover Image & Mic Button */}
          <div className="relative shrink-0 w-fit mx-auto md:mx-0">
            <div className="relative w-[120px] aspect-2/3 rounded-lg overflow-hidden shadow-xl ring-1 ring-black/5">
              <Image
                src={book.coverURL || '/placeholder-cover.jpg'}
                alt={book.title}
                fill
                className="object-cover"
                priority
              />
            </div>
            {/* Overlapping Mic Button */}
            <button className="absolute -bottom-4 -right-4 w-[60px] h-[60px] bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform text-gray-600">
              <MicOff size={28} />
            </button>
          </div>

          {/* Book Info */}
          <div className="flex flex-col gap-4 flex-1 text-center md:text-left">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 leading-tight">
                {book.title}
              </h1>
              <p className="text-gray-600 font-medium">by {book.author}</p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap justify-center md:justify-start gap-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-100">
                <span className="w-2 h-2 rounded-full bg-gray-400" />
                Ready
              </div>
              <div className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-100">
                Voice: {book.persona || 'Default'}
              </div>
              <div className="px-3 py-1 bg-white rounded-full text-xs font-semibold text-gray-700 border border-gray-100">
                0:00/15:00
              </div>
            </div>
          </div>
        </div>

        {/* Transcript Area */}
        <div 
          ref={contentRef}
          className="bg-white rounded-xl shadow-sm border border-gray-100 min-h-[400px] flex flex-col items-center justify-center p-12 text-center"
        >
          <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mb-4">
            <Mic className="text-gray-300" size={48} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">No conversation yet</h3>
          <p className="text-gray-500 text-sm">Click the mic button above to start talking</p>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsPage
