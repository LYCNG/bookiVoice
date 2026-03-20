"use client";

import React from "react";

const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-500 animate-in fade-in">
      <div className="relative flex items-center justify-center">
        <div className="h-20 w-20 rounded-full border-t-4 border-b-4 border-white animate-spin"></div>
        <div className="absolute h-12 w-12 rounded-full border-t-4 border-b-4 border-[#663820] animate-spin opacity-70"></div>
      </div>
      <div className="mt-8 flex flex-col items-center gap-2">
        <h2 className="text-2xl font-serif font-bold text-white tracking-wide">
          Synthesizing Knowledge...
        </h2>
        <p className="text-white/70 font-sans animate-pulse">
          Converting your book into an AI conversation
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
