"use client";

import { Messages } from "@/types";
import { Mic } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TranscriptProps {
  messages: Messages[];
  currentMessage?: string;
  currentUserMessage?: string;
}

const Transcript = ({
  messages,
  currentMessage,
  currentUserMessage,
}: TranscriptProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages or streaming text changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, currentMessage, currentUserMessage]);

  if (messages.length === 0 && !currentMessage && !currentUserMessage) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center h-full animate-in fade-in duration-700">
        <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Mic className="text-gray-300" size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No conversation yet
        </h3>
        <p className="text-gray-500">
          Click the mic button above to start talking with the book's persona
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="w-full h-full overflow-y-auto p-4 md:p-8 flex flex-col gap-4 scroll-smooth custom-scrollbar"
    >
      {messages.map((msg, index) => (
        <div
          key={index}
          className={cn(
            "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
            msg.role === "user" ? "justify-end" : "justify-start"
          )}
        >
          <div
            className={cn(
              "max-w-[80%] p-4 shadow-sm",
              msg.role === "user"
                ? "bg-[#663820] text-white rounded-2xl rounded-tr-none"
                : "bg-[#f3e4c7] text-gray-800 rounded-2xl rounded-tl-none"
            )}
          >
            <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
          </div>
        </div>
      ))}

      {/* Streaming User Message */}
      {currentUserMessage && (
        <div className="flex w-full justify-end animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="max-w-[80%] p-4 bg-[#663820]/90 text-white rounded-2xl rounded-tr-none shadow-sm border border-white/10">
            <p className="text-sm md:text-base leading-relaxed">
              {currentUserMessage}
              <span className="inline-block w-1.5 h-4 bg-white/50 ml-1 animate-pulse align-middle" />
            </p>
          </div>
        </div>
      )}

      {/* Streaming Assistant Message */}
      {currentMessage && (
        <div className="flex w-full justify-start animate-in fade-in slide-in-from-bottom-1 duration-200">
          <div className="max-w-[80%] p-4 bg-[#f3e4c7] text-gray-800 rounded-2xl rounded-tl-none shadow-sm border border-black/5">
            <p className="text-sm md:text-base leading-relaxed">
              {currentMessage}
              <span className="inline-block w-1.5 h-4 bg-gray-400 ml-1 animate-pulse align-middle" />
            </p>
          </div>
        </div>
      )}
      
      {/* Invisible anchor for scrolling */}
      <div className="h-4 w-full shrink-0" />
    </div>
  );
};

export default Transcript;
