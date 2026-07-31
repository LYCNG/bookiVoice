import { TextSegment } from "@/types";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { voiceOptions } from "./constant";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


// Escape regex special characters to prevent ReDoS attacks
export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

// 將 Mongoose 文件序列化為純 JSON 物件（移除 ObjectId, Date 等特殊型別，方便在 Server Component 間傳遞）
export const serializeData = <T>(data: T): T => JSON.parse(JSON.stringify(data));

// Auto generate slug
export function generateSlug(text: string): string {
  const slug = text
      .replace(/\.[^/.]+$/, '') // Remove file extension (.pdf, .txt, etc.)
      .toLowerCase() // Convert to lowercase
      .trim() // Remove whitespace from both ends
      // Allow letters, numbers, spaces, hyphens and common CJK chars
      .replace(/[^\w\s\u4e00-\u9fa5\u3040-\u30ff-]/g, '') 
      .replace(/[\s_]+/g, '-') // Replace spaces and underscores with hyphens
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
      
  // if slug is empty, fallback to a timestamp or random string so we don't have empty slugs
  return slug || `book-${Date.now()}`;
}

/**
 * 將文字切分成多個段落 (Segments)
 * @param text 完整文字
 * @param segmentSize 每個段落的最大字數 (預設 500)
 * @param overlapSize 每個段落間的重疊字數 (預設 50，用於維持上下文)
 * @returns 段落陣列
 */
export const splitIntoSegments = (
    text: string,
    segmentSize: number = 500,
    overlapSize: number = 50,
): TextSegment[] => {
  if (segmentSize <= 0) {
    throw new Error('segmentSize must be greater than 0');
  }
  if (overlapSize < 0 || overlapSize >= segmentSize) {
    throw new Error('overlapSize must be >= 0 and < segmentSize');
  }

  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const segments: TextSegment[] = [];

  let segmentIndex = 0;
  let startIndex = 0;

  while (startIndex < words.length) {
    const endIndex = Math.min(startIndex + segmentSize, words.length);
    const segmentWords = words.slice(startIndex, endIndex);
    const segmentText = segmentWords.join(' ');

    segments.push({
      text: segmentText,
      segmentIndex,
      wordCount: segmentWords.length,
    });

    segmentIndex++;

    if (endIndex >= words.length) break;
    startIndex = endIndex - overlapSize;
  }

  return segments;
};

/**
 * 解析 PDF 檔案並提取文字與封面圖片
 * @param file PDF 檔案物件
 * @returns 分割後的段落文字與封面資料 (Data URL)
 */
export async function parsePDFFile(file: File) {
  try {
    const pdfjsLib = await import('pdfjs-dist');

    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
          'pdfjs-dist/build/pdf.worker.min.mjs',
          import.meta.url,
      ).toString();
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdfDocument = await loadingTask.promise;

    // 渲染第一頁作為封面預覽
    const firstPage = await pdfDocument.getPage(1);
    const viewport = firstPage.getViewport({ scale: 2 });

    const canvas = document.createElement('canvas');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const context = canvas.getContext('2d');

    if (!context) {
      throw new Error('Could not get canvas context');
    }

    await firstPage.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas,
    }).promise;

    const coverDataURL = canvas.toDataURL('image/png');

    // 提取全文文字
    let fullText = '';
    for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
      const page = await pdfDocument.getPage(pageNum);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
          .filter((item) => 'str' in item)
          .map((item) => (item as { str: string }).str)
          .join(' ');
      fullText += pageText + '\n';
    }

    // 將全文切分為段落以便後續處理
    const segments = splitIntoSegments(fullText);

    // 釋放資源
    await pdfDocument.destroy();

    return {
      content: segments,
      cover: coverDataURL,
    };
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error(`Failed to parse PDF file: ${error instanceof Error ? error.message : String(error)}`);
  }
}
// Default voice
export const DEFAULT_VOICE = 'rachel';

export const getVoice = (persona?: string) => {
  if (!persona) return voiceOptions[DEFAULT_VOICE];

  // Find by voice ID
  const voiceEntry = Object.values(voiceOptions).find((v) => v.id === persona);
  if (voiceEntry) return voiceEntry;

  // Find by key
  const voiceByKey = voiceOptions[persona as keyof typeof voiceOptions];
  if (voiceByKey) return voiceByKey;

  // Default fallback
  return voiceOptions[DEFAULT_VOICE];
};