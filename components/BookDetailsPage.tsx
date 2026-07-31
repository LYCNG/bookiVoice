"use client";

import React, { useRef } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VapiControls from "./VapiControls";
import { IBook } from "@/types";

// Register GSAP plugins
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BookDetailsPage = ({ book }: { book: IBook }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backBtnRef = useRef<HTMLAnchorElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(backBtnRef.current, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        delay: 0.2,
      });
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="container mx-auto px-4 py-8 max-w-4xl relative mt-20"
    >
      {/* Floating Back Button */}
      <Link
        href="/"
        ref={backBtnRef}
        className="fixed top-24 left-8 md:left-12 lg:left-24 z-50 w-12 h-12 bg-white rounded-full flex items-center justify-center border border-gray-200 shadow-lg hover:shadow-xl transition-shadow text-gray-700 hover:text-black"
      >
        <ArrowLeft size={24} />
      </Link>

      {/* Transcript Area */}
      <VapiControls book={book} />
    </div>
  );
};

export default BookDetailsPage;
