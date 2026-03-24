import { model, Schema, models } from "mongoose";
import { IVoiceSession } from "@/types";

/**
 * 語音會話模型 (Voice Session Model)
 * 用於紀錄使用者播放語音的連線紀錄與使用時長。
 */
const VoiceSessionSchema = new Schema<IVoiceSession>({
    // 使用者識別碼
    clerkId: { type: String, required: true },
    // 參照的書籍 ID
    bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
    // 會話開始時間 (預設為建立時間)
    startedAt: { type: Date, required: true, default: Date.now },
    // 會話結束時間
    endedAt: { type: Date },
    // 總播放時長 (秒)
    durationSeconds: { type: Number, default: 0 ,required:true},
    // 帳務週期的起始日，用於計算流量限制
    billingPeriodStart: { type: Date, required: true ,index:true},
}, { 
    timestamps: true 
});

VoiceSessionSchema.index({clerkId:1,billingPeriodStart:1});

const VoiceSession = models.VoiceSession || model<IVoiceSession>('VoiceSession', VoiceSessionSchema);

export default VoiceSession;

