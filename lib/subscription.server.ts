import { auth, clerkClient } from "@clerk/nextjs/server";
import { PLANS, PLAN_LIMITS, PlanType, normalizePlanName } from "@/lib/subscription-constant";

export const getUserPlan = async (): Promise<PlanType> => {
    // 1. Check for debug override (useful for development)
    const debugPlan = process.env.NEXT_PUBLIC_DEBUG_PLAN || process.env.DEBUG_PLAN;
    if (debugPlan === PLANS.PRO || debugPlan === PLANS.STANDARD) {
        console.log("DEBUG PLAN OVERRIDE:", debugPlan);
        return debugPlan as PlanType;
    }

    const { has, userId, sessionClaims } = await auth();
    console.log("CLERK AUTH - userId:", userId);

    if (!userId) {
        console.log("CLERK AUTH - No userId found, returning FREE");
        return PLANS.FREE;
    }

    // 2. Check Clerk Features/Roles (if set up)
    if (has({ plan: "pro" })) {
        console.log("CLERK AUTH - has({ plan: 'pro' }) is TRUE");
        return PLANS.PRO;
    }
    if (has({ plan: "standard" }) || has({ plan: "stander" })) {
        console.log("CLERK AUTH - has({ plan: 'standard/stander' }) is TRUE");
        return PLANS.STANDARD;
    }

    // 3. Check session claims publicMetadata
    let metadata = sessionClaims?.metadata as any;
    console.log("CLERK AUTH - sessionClaims.metadata:", JSON.stringify(metadata));
    
    let planId = (metadata?.plan || metadata?.billingPlan || metadata?.subscription || metadata?.role)?.toString();

    // 4. Fallback: Directly fetch user from Clerk (more reliable if JWT not updated)
    if (!planId) {
        console.log("CLERK AUTH - No planId in sessionClaims, falling back to clerkClient...");
        try {
            const client = await clerkClient();
            const user = await client.users.getUser(userId);
            metadata = user.publicMetadata;
            console.log("CLERK API - user.publicMetadata:", JSON.stringify(metadata));
            planId = (metadata?.plan || metadata?.billingPlan || metadata?.subscription || metadata?.role)?.toString();
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