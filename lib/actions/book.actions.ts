'use server'

import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";

/**
 * 檢查書籍是否已存在
 * @param title 書籍標題
 * @returns 包含書籍是否存在與其資料的物件
 */
export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();
        // 生成唯一識別名稱 (Slug)
        const slug = generateSlug(title);
        // 使用 lean() 提升查詢效能（僅返回純 JS 物件）
        const existingBook = await Book.findOne({ slug }).lean();
        
        if (existingBook) {
            return {
                exists: true,
                book: serializeData(existingBook)
            }
        }
        return {exists: false}
    } catch (e) {
        console.error("檢查書籍存在時出錯:", e);
        return {
            success: false,
            book: null,
            alreadyExists: false
        }
    }
};

/**
 * 建立新書籍
 * @param data 書籍建立所需的資料 (CreateBook 介面)
 * @returns 建立結果與書籍資料
 */
export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase();
        const slug = generateSlug(data.title);
        
        // 再次確認是否已存在，避免重複建立
        const existingBook = await Book.findOne({ slug });
        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true
            }
        }
        
        // TODO: 在建立書籍前檢查訂閱限制
        
        // 建立書籍紀錄，初步設定總段數為 1
        const book = await Book.create({ ...data, slug, totalSegments: 1 });
        return {
            success: true,
            data: serializeData(book)
        }
    } catch (error) {
        console.error("建立書籍時出錯:", error);
        return {
            success: false,
            error: error
        }
    }
};

/**
 * 儲存書籍分段內容
 * @param bookId 書籍 ID
 * @param clerkId 使用者 ID
 * @param segments 段落資料陣列
 * @returns 儲存結果
 */
export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase();
        
        // 映射段落資料以符合資料庫 Model (將介面的 text 轉為 Model 的 content)
        const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            bookId,
            clerkId,
            content: text,
            segmentIndex,
            pageNumber,
            wordCount
        }));

        // 批量直接插入段落以提升效能
        await BookSegment.insertMany(segmentsToInsert);
        
        // 更新書籍總段數資訊
        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });
        
        console.log('成功儲存書籍分段與書籍資訊');
        return {
            success: true,
            data: { segmentsCreated: segments.length }
        }
    } catch (error) {
        console.error('儲存書籍分段時出錯:', error);
        
        // 錯誤復原機制：若分段儲存失敗，則刪除已建立的相關資料以維持資料一致性
        await BookSegment.deleteMany({ bookId });
        await Book.findByIdAndDelete(bookId);
        console.log('由於分段儲存失敗，已回滾並刪除書籍及其分段資料');
        
        return {
            success: false,
            error: error
        }
    }
};