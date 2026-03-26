'use server';

/**
 * Voice session server actions
 * Handles DB connection, subscription permission checks, and session persistence
 */

import {EndSessionResult, StartSessionResult} from "@/types";
import {connectToDatabase} from "@/database/mongoose";
import VoiceSession from "@/database/models/voice-session.model";
import { getCurrentBillingPeriodStart } from "../subscription-constant";


/**
 * Start a new voice session
 * 1. Check DB connection
 * 2. Get user subscription plan and limits
 * 3. Check if session count in current billing period exceeds limit
 * 4. If not, create a new session record in DB
 * 
 * @param clerkId User's Clerk ID
 * @param bookId Book's MongoDB ID
 * @returns Result containing sessionId and max duration minutes
 */
export const startVoiceSession = async (clerkId: string, bookId: string): Promise<StartSessionResult> => {
    try {
        console.log('start',clerkId,bookId)
        await connectToDatabase();

        // Dynamically import subscription logic for server-side only execution
        const { getUserPlan } = await import("@/lib/subscription.server");
        const { PLAN_LIMITS } = await import("@/lib/subscription-constant");

        const plan = await getUserPlan();
        console.log(plan)
        const limits = PLAN_LIMITS[plan];
        const billingPeriodStart = getCurrentBillingPeriodStart();

        // Query session count for this user in current billing period
        const sessionCount = await VoiceSession.countDocuments({
            clerkId,
            billingPeriodStart
        });

        // Check if plan limit reached
        if (sessionCount >= limits.maxSessionsPerMonth) {
            const { revalidatePath } = await import("next/cache");
            revalidatePath("/");

            return {
                success: false,
                error: `You have reached the ${plan.toUpperCase()} plan's monthly session limit (${limits.maxSessionsPerMonth} sessions). Please upgrade your plan to continue.`,
                isBillingError: true,
            };
        }

        // Create session record
        const session = await VoiceSession.create({
            clerkId,
            bookId,
            startedAt: new Date(),
            billingPeriodStart,
            durationSeconds: 0,
        });

        return {
            success: true,
            sessionId: session._id.toString(),
            maxDurationMinutes: limits.maxDurationPerSession,
        }
    } catch (e) {
        console.error('開始語音會話失敗:', e);
        return { success: false, error: '無法開始語音會話，請稍後再試。' }
    }
}

/**
 * End and save voice session progress
 * Updates end time and total duration seconds
 * 
 * @param sessionId Session MongoDB ID
 * @param durationSeconds Total seconds for this call
 */
export const endVoiceSession = async (sessionId: string, durationSeconds: number): Promise<EndSessionResult> => {
    try {
        await connectToDatabase();

        const result = await VoiceSession.findByIdAndUpdate(sessionId, {
            endedAt: new Date(),
            durationSeconds,
        });

        if(!result) return { success: false, error: '找不到該語音會話紀錄。' }

        return { success: true }
    } catch (e) {
        console.error('結束語音會話失敗:', e);
        return { success: false, error: '無法結束語音會話，請稍後再試。' }
    }
}
