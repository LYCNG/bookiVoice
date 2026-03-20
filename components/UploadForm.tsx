"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Upload, Image as ImageIcon, X, Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import LoadingOverlay from "./LoadingOverlay";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author name is required"),
  voice: z.string().min(1, "Please choose an assistant voice"),
});

const VOICES = {
  male: [
    { id: "dave", name: "Dave", desc: "Young male, British-Essex, casual & conversational" },
    { id: "daniel", name: "Daniel", desc: "Middle-aged male, British, authoritative but warm" },
    { id: "chris", name: "Chris", desc: "Male, casual & easy-going" },
  ],
  female: [
    { id: "rachel", name: "Rachel", desc: "Young female, American, calm & clear" },
    { id: "sarah", name: "Sarah", desc: "Young female, American, soft & approachable" },
  ],
};

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
      voice: "rachel",
    },
  });

  const selectedVoice = watch("voice");

  useGSAP(() => {
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
        }
    });

    tl.from(".new-book-wrapper", {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out",
    }).from(".form-section", {
      y: 20,
      opacity: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: "power2.out",
    }, "-=0.4");
  }, { scope: containerRef });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!pdfFile) {
        alert("Please upload a PDF file");
        return;
    }
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 3000));
    console.log("Form data:", { ...data, pdfFile, coverFile });
    setIsSubmitting(false);
    alert("Book synthesis started!");
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPdfFile(e.target.files[0]);
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverFile(e.target.files[0]);
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      {isSubmitting && <LoadingOverlay />}
      
      <div className="new-book-wrapper">
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* 1. PDF Upload */}
          <div className="form-section">
            <Label className="form-label">Book PDF File</Label>
            <div 
              className={cn("upload-dropzone", pdfFile && "border-solid border-[#663820] bg-[#efe8d8]")}
              onClick={() => document.getElementById("pdf-upload")?.click()}
            >
              <input 
                id="pdf-upload" 
                type="file" 
                accept=".pdf" 
                className="hidden" 
                onChange={handlePdfChange}
              />
              {!pdfFile ? (
                <div className="flex flex-col items-center gap-2">
                  <Upload className="w-8 h-8 text-[#663820]" />
                  <p className="text-[#374151] font-medium">Click to upload PDF</p>
                  <p className="text-sm text-[#6b7280]">PDF file (max 50MB)</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white/80 p-3 rounded-lg border border-[#663820]/20 shadow-sm animate-in zoom-in-95 duration-300">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-[#1f2937] font-medium truncate max-w-[250px]">{pdfFile.name}</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setPdfFile(null); }}
                    className="p-1 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 2. Cover Upload */}
          <div className="form-section">
            <Label className="form-label">Cover Image (Optional)</Label>
            <div 
              className={cn("upload-dropzone", coverFile && "border-solid border-[#663820] bg-[#efe8d8]")}
              onClick={() => document.getElementById("cover-upload")?.click()}
            >
              <input 
                id="cover-upload" 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleCoverChange}
              />
              {!coverFile ? (
                <div className="flex flex-col items-center gap-2 text-center">
                  <ImageIcon className="w-8 h-8 text-[#663820]" />
                  <p className="text-[#374151] font-medium">Click to upload cover image</p>
                  <p className="text-sm text-[#6b7280]">Leave empty to auto-generate from PDF</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white/80 p-3 rounded-lg border border-[#663820]/20 shadow-sm animate-in zoom-in-95 duration-300">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-[#1f2937] font-medium truncate max-w-[250px]">{coverFile.name}</span>
                  <button 
                    type="button" 
                    onClick={(e) => { e.stopPropagation(); setCoverFile(null); }}
                    className="p-1 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 3. Title Input */}
          <div className="form-section">
            <Label htmlFor="title" className="form-label">Title</Label>
            <Input 
              id="title" 
              placeholder="ex: Rich Dad Poor Dad" 
              className="form-input" 
              {...register("title")}
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          {/* 4. Author Input */}
          <div className="form-section">
            <Label htmlFor="author" className="form-label">Author Name</Label>
            <Input 
              id="author" 
              placeholder="ex: Robert Kiyosaki" 
              className="form-input" 
              {...register("author")}
            />
            {errors.author && <p className="text-red-500 text-xs mt-1">{errors.author.message}</p>}
          </div>

          {/* 5. Voice Selector */}
          <div className="form-section space-y-4">
            <Label className="form-label">Choose Assistant Voice</Label>
            
            <div className="grid gap-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Male Voices</span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {VOICES.male.map((voice) => (
                    <div 
                      key={voice.id}
                      onClick={() => setValue("voice", voice.id)}
                      className={cn(
                        "voice-selector-option",
                        selectedVoice === voice.id && "voice-selector-option-selected"
                      )}
                    >
                      <div className="flex items-center gap-2">
                         <div className={cn(
                           "w-4 h-4 rounded-full border-2 border-[#d1d5db] flex items-center justify-center transition-colors",
                           selectedVoice === voice.id && "border-[#663820]"
                         )}>
                           {selectedVoice === voice.id && <div className="w-2 h-2 rounded-full bg-[#663820]" />}
                         </div>
                         <span className="font-bold text-[#1f2937]">{voice.name}</span>
                      </div>
                      <p className="text-xs text-[#6b7280] leading-relaxed italic">{voice.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">Female Voices</span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {VOICES.female.map((voice) => (
                    <div 
                      key={voice.id}
                      onClick={() => setValue("voice", voice.id)}
                      className={cn(
                        "voice-selector-option",
                        selectedVoice === voice.id && "voice-selector-option-selected"
                      )}
                    >
                      <div className="flex items-center gap-2">
                         <div className={cn(
                           "w-4 h-4 rounded-full border-2 border-[#d1d5db] flex items-center justify-center transition-colors",
                           selectedVoice === voice.id && "border-[#663820]"
                         )}>
                           {selectedVoice === voice.id && <div className="w-2 h-2 rounded-full bg-[#663820]" />}
                         </div>
                         <span className="font-bold text-[#1f2937]">{voice.name}</span>
                      </div>
                      <p className="text-xs text-[#6b7280] leading-relaxed italic">{voice.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {errors.voice && <p className="text-red-500 text-xs mt-1">{errors.voice.message}</p>}
          </div>

          {/* 6. Submit Button */}
          <button type="submit" className="form-btn shadow-brown-200">
            Begin Synthesis
          </button>

        </form>
      </div>
    </div>
  );
};

export default UploadForm;
