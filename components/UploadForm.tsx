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
import { UploadSchema } from "@/lib/zod";
import LoadingOverlay from "./LoadingOverlay";
import { cn, parsePDFFile } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import {
  checkBookExists,
  createBook,
  saveBookSegments,
} from "@/lib/actions/book.actions";
import { useRouter } from "next/navigation";
import { upload } from "@vercel/blob/client";

gsap.registerPlugin(ScrollTrigger);

type FormValues = z.infer<typeof UploadSchema>;

const VOICES = {
  male: [
    {
      id: "dave",
      name: "Dave",
      desc: "Young male, British-Essex, casual & conversational",
    },
    {
      id: "daniel",
      name: "Daniel",
      desc: "Middle-aged male, British, authoritative but warm",
    },
    { id: "chris", name: "Chris", desc: "Male, casual & easy-going" },
  ],
  female: [
    {
      id: "rachel",
      name: "Rachel",
      desc: "Young female, American, calm & clear",
    },
    {
      id: "sarah",
      name: "Sarah",
      desc: "Young female, American, soft & approachable",
    },
  ],
};

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { userId } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(UploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: "",
      pdfFile: undefined,
      coverImage: undefined,
    },
  });

  const selectedVoice = watch("persona");
  const pdfFile = watch("pdfFile");
  const coverFile = watch("coverImage");

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        },
      });

      tl.from(".new-book-wrapper", {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      }).from(
        ".form-section",
        {
          y: 20,
          opacity: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: "power2.out",
        },
        "-=0.4",
      );
    },
    { scope: containerRef },
  );

  const onSubmit = async (data: FormValues) => {
    // 1. 檢查使用者登入狀態
    if (!userId) {
      return toast.error("Please login to continue");
    }

    // 更新狀態預備上傳
    // PostHog -< track Book Uploads...
    setIsSubmitting(true);

    try {
      // 2. 檢查書籍是否已存在 (避免重複建立)
      const existsCheck = await checkBookExists(data.title);
      if (existsCheck?.exists && existsCheck.book) {
        toast.info("Book already exists");
        formRef.current?.reset();
        router.push(`/book/${existsCheck.book.slug}`);
        return;
      }

      // 3. 生成檔案名稱與取得檔案物件
      const fileTitle = data.title.replace(/\s+/g, "-").toLowerCase();
      const pdfFile = data.pdfFile;

      // 4. 解析 PDF 獲取文字段落及封面圖片 (輔助分析與預覽)
      const parsedPdf = await parsePDFFile(pdfFile);
      console.log("PDF parsed successfully:", parsedPdf);

      // 5. 將 PDF 檔案上傳至 Vercel Blob 儲存服務
      // 使用 @vercel/blob 客戶端直接上傳
      const uploadedPDFBlob = await upload(fileTitle, pdfFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: "application/pdf",
      });

      // 6. 處理封面圖片
      let coverUrl: string;
      if (data.coverImage) {
        // 若使用者有手動上傳封面，優先使用
        const coverFile = data.coverImage;
        const uploadedCoverBlob = await upload(
          `${fileTitle}_cover.png`,
          coverFile,
          {
            access: "public",
            handleUploadUrl: "/api/upload",
            contentType: coverFile.type,
          },
        );
        coverUrl = uploadedCoverBlob.url;
      } else {
        // 若無封面，使用從 PDF 解析出來的第一頁作為封面
        const response = await fetch(parsedPdf.cover);
        const blob = await response.blob();
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: "image/png",
        });
        coverUrl = uploadedCoverBlob.url;
      }

      // TODO: 呼叫 Server Action 儲存書籍後設資料與文字段落至 MongoDB
      // 例如：await createBook({ ...data, fileURL: uploadedPDFBlob.url, coverURL: coverUrl });

      const book = await createBook({
        clerkId: userId,
        title: data.title,
        author: data.author,
        persona: data.persona,
        fileURL: uploadedPDFBlob.url,
        fileBlobKey: uploadedPDFBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,
      });
      if (!book.success) {
        toast.info("Failed to create book");
        formRef.current?.reset();
        router.push(`/books/${existsCheck.book.slug}`);
        return;
      }

      const segments = await saveBookSegments(
        book.data._id,
        userId,
        parsedPdf.content,
      );
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to process PDF file");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue("pdfFile", e.target.files[0], { shouldValidate: true });
    }
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setValue("coverImage", e.target.files[0], { shouldValidate: true });
    }
  };

  return (
    <div ref={containerRef} className="w-full">
      {isSubmitting && <LoadingOverlay />}

      <div className="new-book-wrapper">
        <form
          ref={formRef}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8"
        >
          {/* 1. PDF Upload */}
          <div className="form-section">
            <Label className="form-label">Book PDF File</Label>
            <div
              className={cn(
                "upload-dropzone",
                pdfFile && "border-solid border-[#663820] bg-[#efe8d8]",
              )}
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
                  <p className="text-[#374151] font-medium">
                    Click to upload PDF
                  </p>
                  <p className="text-sm text-[#6b7280]">PDF file (max 50MB)</p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white/80 p-3 rounded-lg border border-[#663820]/20 shadow-sm animate-in zoom-in-95 duration-300">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-[#1f2937] font-medium truncate max-w-[250px]">
                    {pdfFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue("pdfFile", undefined as any, {
                        shouldValidate: true,
                      });
                    }}
                    className="p-1 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              )}
            </div>
            {errors.pdfFile && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pdfFile.message}
              </p>
            )}
          </div>

          {/* 2. Cover Upload */}
          <div className="form-section">
            <Label className="form-label">Cover Image (Optional)</Label>
            <div
              className={cn(
                "upload-dropzone",
                coverFile && "border-solid border-[#663820] bg-[#efe8d8]",
              )}
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
                  <p className="text-[#374151] font-medium">
                    Click to upload cover image
                  </p>
                  <p className="text-sm text-[#6b7280]">
                    Leave empty to auto-generate from PDF
                  </p>
                </div>
              ) : (
                <div className="flex items-center gap-3 bg-white/80 p-3 rounded-lg border border-[#663820]/20 shadow-sm animate-in zoom-in-95 duration-300">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-[#1f2937] font-medium truncate max-w-[250px]">
                    {coverFile.name}
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setValue("coverImage", undefined, {
                        shouldValidate: true,
                      });
                    }}
                    className="p-1 hover:bg-neutral-200 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-500" />
                  </button>
                </div>
              )}
            </div>
            {errors.coverImage && (
              <p className="text-red-500 text-xs mt-1">
                {errors.coverImage.message}
              </p>
            )}
          </div>

          {/* 3. Title Input */}
          <div className="form-section">
            <Label htmlFor="title" className="form-label">
              Title
            </Label>
            <Input
              id="title"
              placeholder="ex: Rich Dad Poor Dad"
              className="form-input"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* 4. Author Input */}
          <div className="form-section">
            <Label htmlFor="author" className="form-label">
              Author Name
            </Label>
            <Input
              id="author"
              placeholder="ex: Robert Kiyosaki"
              className="form-input"
              {...register("author")}
            />
            {errors.author && (
              <p className="text-red-500 text-xs mt-1">
                {errors.author.message}
              </p>
            )}
          </div>

          {/* 5. Voice Selector */}
          <div className="form-section space-y-4">
            <Label className="form-label">Choose Assistant Voice</Label>

            <div className="grid gap-6">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
                  Male Voices
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {VOICES.male.map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() =>
                        setValue("persona", voice.id, { shouldValidate: true })
                      }
                      className={cn(
                        "voice-selector-option",
                        selectedVoice === voice.id &&
                          "voice-selector-option-selected",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 border-[#d1d5db] flex items-center justify-center transition-colors",
                            selectedVoice === voice.id && "border-[#663820]",
                          )}
                        >
                          {selectedVoice === voice.id && (
                            <div className="w-2 h-2 rounded-full bg-[#663820]" />
                          )}
                        </div>
                        <span className="font-bold text-[#1f2937]">
                          {voice.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#6b7280] leading-relaxed italic">
                        {voice.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#9ca3af]">
                  Female Voices
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {VOICES.female.map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() =>
                        setValue("persona", voice.id, { shouldValidate: true })
                      }
                      className={cn(
                        "voice-selector-option",
                        selectedVoice === voice.id &&
                          "voice-selector-option-selected",
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 border-[#d1d5db] flex items-center justify-center transition-colors",
                            selectedVoice === voice.id && "border-[#663820]",
                          )}
                        >
                          {selectedVoice === voice.id && (
                            <div className="w-2 h-2 rounded-full bg-[#663820]" />
                          )}
                        </div>
                        <span className="font-bold text-[#1f2937]">
                          {voice.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#6b7280] leading-relaxed italic">
                        {voice.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {errors.persona && (
              <p className="text-red-500 text-xs mt-1">
                {errors.persona.message}
              </p>
            )}
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
