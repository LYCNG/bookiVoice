import mongoose from "mongoose";

/**
 * MongoDB 連線設定檔案
 * 此檔案負責管理與 MongoDB 的連線，並實作連線暫存機制以優化效能。
 */

const MONGODB_URI = process.env.MONGODB_URI;

// 檢查環境變數中是否有 MongoDB URI
if (!MONGODB_URI) {
  throw new Error("請提供有效的 MongoDB URI (MONGODB_URI)");
}

/**
 * 全域型別宣告
 * 在開發環境或 Serverless 環境中，為防止重複連線導致資源耗盡，
 * 我們使用 global 物件來暫存 Mongoose 的連線實例。
 */
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

/**
 * 初始化連線暫存物件
 * 優先從全域物件獲取，若無則初始化為空，確保在所有 API route 中共用同一個連線池。
 */
let cached = global.mongooseCache || (global.mongooseCache = { conn: null, promise: null });

/**
 * 連接到資料庫的函式
 * 採用單例模式 (Singleton Pattern)，確保整個應用程式只會建立一個資料庫連線池。
 */
export const connectToDatabase = async () => {
  // 如果已經有現成的連線，則直接返回
  if (cached.conn) return cached.conn;

  // 如果目前沒有正在進行中的連線請求，則建立一個新的連線 Promise
  if (!cached.promise) {
      // bufferCommands: false 可避免在未連線前快取操作，降低出錯風險
      cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }

  try {
    // 等待連線 Promise 完成並儲存連線實例
    cached.conn = await cached.promise;
  } catch (e) {
    // 如果連線失敗，則清除 Promise 以便下次重試
    cached.promise = null;
    console.error("MongoDB 連線失敗:", e);
    throw e;
  }

  // 連線成功紀錄
  console.info("MongoDB 連線成功");

  return cached.conn;
};