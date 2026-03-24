"use client";
import React, { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(".hero-card", {
        y: 50,
        opacity: 0,
        duration: 1.2,
      })
        .from(
          ".hero-left > *",
          {
            x: -30,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
          },
          "-=0.6",
        )
        .from(
          ".hero-center",
          {
            scale: 0.8,
            opacity: 0,
            duration: 1,
          },
          "-=0.8",
        )
        .from(
          ".hero-right",
          {
            x: 30,
            opacity: 0,
            duration: 0.8,
          },
          "-=0.6",
        );
    },
    { scope: containerRef },
  );

  return (
    <section ref={containerRef} className="py-12">
      <div className="hero-card bg-[#D2C4B1] rounded-[40px] p-12 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl border border-white/20">
        {/* Left Side */}
        <div className="hero-left flex-1 space-y-8 max-w-lg z-10">
          <h1 className="text-6xl md:text-7xl font-serif font-bold text-[#2D241E] leading-tight tracking-tight">
            Your Library
          </h1>
          <p className="text-xl text-[#5D544E] font-medium leading-relaxed max-w-sm">
            Convert your books into interactive AI conversations. Listen, learn,
            and discuss your favorite reads.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Link href="/new">
              <button className="flex items-center gap-3 bg-white text-[#2D241E] font-bold px-8 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg active:scale-95 group border border-[#2D241E]/10 cursor-pointer">
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                <span className="text-lg">Add new book</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Center Illustration */}
        <div className="hero-center flex-[1.5] flex justify-center relative min-w-[350px]">
          <div className="relative w-full max-w-[500px] aspect-square transform hover:rotate-2 transition-transform duration-700">
            <Image
              src="/assets/hero_illustration.png"
              alt="Vintage Library Decoration"
              fill
              className="object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* Right Info Card */}
        <div className="hero-right flex-1 flex justify-end z-10">
          <div className="bg-white/70 backdrop-blur-xl p-8 rounded-[40px] shadow-2xl border border-white/50 space-y-10 w-full max-w-[300px] transform hover:-translate-y-2 transition-transform duration-500">
            <Step
              number={1}
              title="Upload PDF"
              description="Add your book file"
            />
            <Step
              number={2}
              title="AI Processing"
              description="We analyze the content"
            />
            <Step number={3} title="Voice Chat" description="Discuss with AI" />
          </div>
        </div>
      </div>
    </section>
  );
};

const Step = ({
  number,
  title,
  description,
}: {
  number: number;
  title: string;
  description: string;
}) => (
  <div className="flex items-start gap-4 group">
    <div className="w-10 h-10 rounded-full border border-[#2D241E]/20 flex items-center justify-center text-[#2D241E] font-serif font-bold text-lg shrink-0 group-hover:bg-[#2D241E] group-hover:text-white transition-colors duration-300">
      {number}
    </div>
    <div className="space-y-1">
      <h3 className="text-[#2D241E] font-bold text-base leading-none">
        {title}
      </h3>
      <p className="text-[#5D544E] text-xs font-medium opacity-80">
        {description}
      </p>
    </div>
  </div>
);

export default Hero;
