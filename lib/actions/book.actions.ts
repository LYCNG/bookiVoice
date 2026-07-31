'use server'

/**
 * Book resource server actions
 * Handles book creation, queries, and content segment storage
 */
import { connectToDatabase } from "@/database/mongoose";
import { CreateBook, TextSegment } from "@/types";
import { escapeRegex, generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";



export const getAllBooks = async (query?: string) => {
    try {
        await connectToDatabase();
        
        let filter = {};
        if (query) {
            const searchRegex = new RegExp(escapeRegex(query), 'i');
            filter = {
                $or: [
                    { title: { $regex: searchRegex } },
                    { author: { $regex: searchRegex } }
                ]
            };
        }
   
        const books = await Book.find(filter).sort({ createdAt: -1 }).lean();
        return {
            success: true,
            data: serializeData(books)
        }
    } catch (error) {
        console.error("Error connecting to database:", error);
        return {
            success: false,
            error: error
        }
    }
}

/**
 * Get book details by slug
 * @param slug Unique book identifier
 * @returns Object containing book data
 */
export const getBookBySlug = async (slug: string) => {
    try {
        await connectToDatabase();
        const book = await Book.findOne({ slug }).lean();
        
        if (!book) {
            return {
                success: false,
                error: "Book not found"
            }
        }

        return {
            success: true,
            data: serializeData(book)
        }
    } catch (error) {
        console.error("Error getting book details:", error);
        return {
            success: false,
            error: error
        }
    }
}
;

/**
 * Check if a book already exists
 * @param title Book title
 * @returns Object indicating if the book exists and its data
 */
export const checkBookExists = async (title: string) => {
    try {
        await connectToDatabase();
        // Generate unique slug
        const slug = generateSlug(title);
        // Use lean() for better performance (returns plain JS object)
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
 * Create a new book
 * @param data Data required for book creation (CreateBook interface)
 * @returns Creation result and book data
 */
export const createBook = async (data: CreateBook) => {
    try {
        await connectToDatabase();
        const slug = generateSlug(data.title);
        
        // Check again if it exists to prevent duplicates
        const existingBook = await Book.findOne({ slug });
        if (existingBook) {
            return {
                success: true,
                data: serializeData(existingBook),
                alreadyExists: true
            }
        }
        
        // Check subscription limits before creating
        const { getUserPlan } = await import("@/lib/subscription.server");
        const { PLAN_LIMITS } = await import("@/lib/subscription-constant");
        const {auth} = await import('@clerk/nextjs/server');
        const {userId}=await auth();

        const plan = await getUserPlan();
        const limits = PLAN_LIMITS[plan];
        
        const currentBookCount = await Book.countDocuments({ clerkId: userId });
        
        if (currentBookCount >= limits.maxBooks) {
            revalidatePath('/');
            return {
                success: false,
                error: `You have reached the ${plan.toUpperCase()} plan limit for books (${limits.maxBooks} books). Please upgrade your plan to continue.`,
                isBillingError: true
            }
        }
        
        // 建立書籍紀錄，初步設定總段數為 1
        const book = await Book.create({ ...data,clerkId:userId, slug, totalSegments: 1 });
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

// Searches book segments using MongoDB text search with regex fallback
export const searchBookSegments = async (bookId: string, query: string, limit: number = 5) => {
    try {
        await connectToDatabase();

        console.log(`Searching for: "${query}" in book ${bookId}`);

        const bookObjectId = new mongoose.Types.ObjectId(bookId);

        // Try MongoDB text search first (requires text index)
        let segments: Record<string, unknown>[] = [];
        try {
            segments = await BookSegment.find({
                bookId: bookObjectId,
                $text: { $search: query },
            })
                .select('_id bookId content segmentIndex pageNumber wordCount')
                .sort({ score: { $meta: 'textScore' } })
                .limit(limit)
                .lean();
        } catch {
            // Text index may not exist — fall through to regex fallback
            segments = [];
        }

        // Fallback: regex search matching ANY keyword
        if (segments.length === 0) {
            const keywords = query.split(/\s+/).filter((k) => k.length > 2);
            const pattern = keywords.map(escapeRegex).join('|');

            segments = await BookSegment.find({
                bookId: bookObjectId,
                content: { $regex: pattern, $options: 'i' },
            })
                .select('_id bookId content segmentIndex pageNumber wordCount')
                .sort({ segmentIndex: 1 })
                .limit(limit)
                .lean();
        }

        console.log(`Search complete. Found ${segments.length} results`);

        return {
            success: true,
            data: serializeData(segments),
        };
    } catch (error) {
        console.error('Error searching segments:', error);
        return {
            success: false,
            error: (error as Error).message,
            data: [],
        };
    }
};

export const saveBookSegments = async (bookId: string, clerkId: string, segments: TextSegment[]) => {
    try {
        await connectToDatabase();
        
        // Map segments to database model (text -> content)
        const segmentsToInsert = segments.map(({ text, segmentIndex, pageNumber, wordCount }) => ({
            bookId,
            clerkId,
            content: text,
            segmentIndex,
            pageNumber,
            wordCount
        }));

        // Batch insert segments for performance
        await BookSegment.insertMany(segmentsToInsert);
        
        // Update book total segments info
        await Book.findByIdAndUpdate(bookId, { totalSegments: segments.length });
        
        console.log('Successfully saved segments and book info');
        return {
            success: true,
            data: { segmentsCreated: segments.length }
        }
    } catch (error) {
        console.error('儲存書籍分段時出錯:', error);
        
        // 錯誤復原機制：若分段儲存失敗，則刪除已建立的相關資料以維持資料一致性
        await BookSegment.deleteMany({ bookId });
        await Book.findByIdAndDelete(bookId);
        console.log('Rolling back: Deleted book and segments due to segment save failure');
        
        return {
            success: false,
            error: error
        }
    }
};