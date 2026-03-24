import { model, Schema, models } from "mongoose";
import { IBook } from "@/types";

/**
 * 書籍模型 (Book Model)
 * 用於儲存使用者上傳的書籍基本資訊。
 */
const BookSchema = new Schema<IBook>({
    // Clerk 使用者識別碼，用於區分不同使用者的資料
    clerkId: { type: String, required: true },
    // 書籍標題
    title: { type: String, required: true },
    // 書籍的 Slug (URL 優化名稱)，必須唯一且全小寫
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // 作者名稱
    author: { type: String, required: true },
    // 選用的語音人工角色 (Persona)
    persona: { type: String },
    // 書籍 PDF 檔案的下載連結
    fileURL: { type: String, required: true },
    // 書籍檔案在儲存空間中的 Blob Key
    fileBlobKey: { type: String, required: true },
    // 書籍封面圖片的下載連結
    coverURL: { type: String },
    // 封面圖片在儲存空間中的 Blob Key
    coverBlobKey: { type: String },
    // 檔案大小 (Bytes)
    fileSize: { type: Number, required: true },
    // 書籍內容被切分成的總段數
    totalSegments: { type: Number, default: 0 },
}, { 
    // 自動管理 createdAt 與 updatedAt 欄位
    timestamps: true 
});

const Book = models.Book || model<IBook>('Book', BookSchema);

export default Book;