export type PlanType = "FREE" | "PRO" | "ENTERPRISE";

export const PLANS = {
  FREE: {
    name: "Free",
    slug: "free",
    quota: 10,
    price: 0,
  },
  PRO: {
    name: "Pro",
    slug: "pro",
    quota: 100,
    price: 19,
  },
};
