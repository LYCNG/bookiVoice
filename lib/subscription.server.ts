import { auth, clerkClient } from "@clerk/nextjs/server";
import { PLANS, PLAN_LIMITS, PlanType, normalizePlanName } from "@/lib/subscription-constant";

export const getUserPlan = async (): Promise<PlanType> => {
    // 1. Check for debug override (useful for development)
 

    const { has, userId, sessionClaims } = await auth();
    console.log("CLERK AUTH - userId:", userId);

    if (!userId) {
        console.log("CLERK AUTH - No userId found, returning FREE");
        return PLANS.FREE;
    }

    // 1. First Check: Clerk's `has` helper (Features/Roles)
    // Most reliable for Clerk-managed entitlements.
    if (has?.({ plan: 'pro' })) return PLANS.PRO;
    if (has?.({ plan: 'standard' }) || has?.({ plan: 'stander' })) return PLANS.STANDARD;

    // 2. Second Check: Check session claims publicMetadata
    const metadata = sessionClaims?.metadata as any;
    let planId = (metadata?.plan || metadata?.billingPlan || metadata?.subscription || metadata?.role)?.toString();

    // 3. Third Check: Fallback to direct Clerk API fetch (for JWT latency)
    if (!planId) {
        try {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            const fullMetadata = user.publicMetadata;
            planId = (fullMetadata?.plan || fullMetadata?.billingPlan || fullMetadata?.subscription || fullMetadata?.role)?.toString();
        } catch (err) {
            console.error("CLERK API - Failed to fetch user metadata:", err);
        }
    }

    const finalPlan = normalizePlanName(planId);
    console.log("CLERK AUTH - Final Normalized Plan:", finalPlan);
    return finalPlan;
}

export const getPlanLimits = async () => {
    const plan = await getUserPlan();
    return PLAN_LIMITS[plan];
}