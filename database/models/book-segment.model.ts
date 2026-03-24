import { model, Schema, models } from "mongoose";
import { IBookSegment } from "@/types";

/**
 * 書籍分段模型 (Book Segment Model)
 * 用於儲存書籍被切分後的文字內容，以便進行語音播放。
 */
const BookSegmentSchema = new Schema<IBookSegment>({
    // 使用者識別碼
    clerkId: { type: String, required: true },
    // 參照的書籍 ID (Book 模型的 ObjectId)
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    // 該段落的文字內容
    content: { type: String, required: true },
    // 段落索引，用於維持內容的先後順序
    segmentIndex: { type: Number, required: true, index: true },
    // 原書籍中的頁碼
    pageNumber: { type: Number, index: true },
    // 該段落的總字數
    wordCount: { type: Number, required: true },
}, { 
    timestamps: true 
});

/**
 * 索引設定 (Index Configurations)
 * 提升查詢效能並確保資料完整性。
 */

// 複合唯一索引：確保同一本書中的段落索引不重複
BookSegmentSchema.index({ bookId: 1, segmentIndex: 1 }, { unique: true });

// 複合索引：加速特定書籍內按頁碼查詢的操作
BookSegmentSchema.index({ bookId: 1, pageNumber: 1 });

// 全文檢索索引：支援在特定書籍的內容中進行關鍵字搜尋
BookSegmentSchema.index({ bookId: 1, content: 'text' });

const BookSegment = models.BookSegment || model<IBookSegment>('BookSegment', BookSegmentSchema);

export default BookSegment;

