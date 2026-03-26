export const PLANS = {
    FREE: 'free',
    STANDARD: 'standard', 
    PRO: 'pro',
} as const;

// Helper to normalize plan names from Clerk (handling typos like 'Stander')
export const normalizePlanName = (plan: string | undefined): PlanType => {
    if (!plan) return PLANS.FREE;
    const p = plan.toLowerCase();
    if (p === 'pro' || p.includes('pro')) return PLANS.PRO;
    if (p === 'standard' || p === 'stander' || p.includes('stand')) return PLANS.STANDARD;
    return PLANS.FREE;
};

export type PlanType = typeof PLANS[keyof typeof PLANS];

export interface PlanLimits {
    maxBooks: number;
    maxSessionsPerMonth: number;
    maxDurationPerSession: number; // in minutes
    hasSessionHistory: boolean;
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
    [PLANS.FREE]: {
        maxBooks: 1,
        maxSessionsPerMonth: 5,
        maxDurationPerSession: 5,
        hasSessionHistory: false,
    },
    [PLANS.STANDARD]: {
        maxBooks: 10,
        maxSessionsPerMonth: 100,
        maxDurationPerSession: 15,
        hasSessionHistory: true,
    },
    [PLANS.PRO]: {
        maxBooks: 100,
        maxSessionsPerMonth: Infinity,
        maxDurationPerSession: 60,
        hasSessionHistory: true,
    },
};

export const getCurrentBillingPeriodStart = (): Date => {
    const now = new Date();
    // Track billing cycle by calendar month (1st of each month at 00:00:00)
    return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
};