'use client';

import { useAuth, useUser } from "@clerk/nextjs";
import { PLANS, PLAN_LIMITS, PlanType, normalizePlanName } from "@/lib/subscription-constant";

export const useSubscription = () => {
    const { has, isLoaded: isAuthLoaded } = useAuth();
    const { user, isLoaded: isUserLoaded } = useUser();

    const isLoaded = isAuthLoaded && isUserLoaded;

    if (!isLoaded) {
        return {
            plan: PLANS.FREE,
            limits: PLAN_LIMITS[PLANS.FREE],
            isLoaded: false
        };
    }

    let plan: PlanType = PLANS.FREE;
    
    // 1. First Check: Clerk's `has` helper from useAuth (Features/Roles)
    if (has?.({ plan: 'pro' })) {
        plan = PLANS.PRO;
    } else if (has?.({ plan: 'standard' }) || has?.({ plan: 'stander' })) {
        plan = PLANS.STANDARD;
    } 
    // 2. Second Check: Fallback to user public metadata (Strict normalization)
    else {
        const metadataPlan = (user?.publicMetadata?.plan || user?.publicMetadata?.billingPlan || user?.publicMetadata?.subscription)?.toString();
        plan = normalizePlanName(metadataPlan);
    }

    return {
        plan,
        limits: PLAN_LIMITS[plan],
        isLoaded: true
    };
};