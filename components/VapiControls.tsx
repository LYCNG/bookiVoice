"use client";

import useVapi from "@/hooks/useVapi";
import { IBook } from "@/types";
import { Mic, MicOff } from "lucide-react";
import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import Transcript from "./Transcript";

const VapiControls = ({ book }: { book: IBook }) => {
  const {
    status,
    isActive,
    messages,
    currentMessage,
    currentUserMessage,
    duration,
    start,
    stop,
    limitError,
    isBillingError,
    maxDurationSeconds,
    clearError,
  } = useVapi(book);
  console.log("isActive", isActive);

  return (
    <div className="flex flex-col gap-6">
      {/* Error Alert */}
      {(limitError || isBillingError) && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <p className="text-sm font-medium">
              {limitError || "帳務或連線發生錯誤，請稍後再試。"}
            </p>
          </div>
          <button
            onClick={clearError}
            className="text-red-400 hover:text-red-600 transition-colors p-1"
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      {/* Header Card */}
      <div className="bg-[#f3e4c7] rounded-xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center shadow-sm">
        {/* Cover Image & Mic Button */}
        <div className="relative shrink-0 w-fit mx-auto md:mx-0">
          <div className="relative w-[120px] aspect-2/3 rounded-lg overflow-hidden shadow-xl ring-1 ring-black/5">
            <Image
              src={book.coverURL || "/placeholder-cover.jpg"}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 120px, 120px"
              priority
            />
          </div>
          {/* Overlapping Mic Button */}
          <button
            onClick={isActive ? stop : start}
            disabled={
              status === "connecting" || (status === "starting" && !isActive)
            }
            className={cn(
              "absolute -bottom-4 -right-4 w-[60px] h-[60px] rounded-full flex items-center justify-center shadow-lg transition-all transform hover:scale-105 active:scale-95 z-10",
              isActive ? "bg-[#3d485e] text-white" : "bg-white text-gray-600",
            )}
          >
            {status === "connecting" || status === "starting" ? (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current" />
            ) : isActive ? (
              <Mic size={28} />
            ) : (
              <MicOff size={28} />
            )}
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
            <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-black/5">
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  status === "connecting" && "bg-yellow-500 animate-pulse",
                  status === "listening" && "bg-green-500 animate-pulse",
                  status === "speaking" && "bg-blue-500 animate-bounce",
                  status === "thinking" && "bg-purple-500 animate-pulse",
                  status === "idle" && "bg-gray-400"
                )}
              />
              {status === "idle" && "Ready"}
              {status === "connecting" && "Connecting..."}
              {status === "listening" && "Listening"}
              {status === "speaking" && "Speaking"}
              {status === "thinking" && "Thinking"}
              {status === "starting" && "Starting..."}
            </div>
            <div className="px-4 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-black/5">
              Voice: {book.persona || "Default"}
            </div>
            <div className="px-4 py-1.5 bg-white rounded-lg text-sm font-medium text-gray-700 shadow-sm border border-black/5 tabular-nums">
              {Math.floor(duration / 60)}:
              {(duration % 60).toString().padStart(2, "0")}/
              {Math.floor(maxDurationSeconds / 60)}:00
            </div>
          </div>
        </div>
      </div>

      {/* Transcript Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[400px] max-h-[600px] flex flex-col transition-all relative overflow-hidden">
        <Transcript
          messages={messages}
          currentMessage={currentMessage}
          currentUserMessage={currentUserMessage}
        />
      </div>
    </div>
  );
};

export default VapiControls;
