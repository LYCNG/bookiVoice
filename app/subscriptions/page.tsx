"use client";

import React from "react";
import PricingCard from "@/components/PricingCard";
import { useSubscription } from "@/hooks/useSubscription";
import { PLANS } from "@/lib/subscription-constant";
import { PricingTable } from "@clerk/nextjs";

export default function SubscriptionsPage() {
  const { plan } = useSubscription();
  console.log("plan", plan);
  const handleSwitchPlan = (planName: string) => {
    // In a real Clerk app, this would trigger the checkout or billing portal
    console.log(`Switching to ${planName}`);
  };

  return (
    <div className="w-full bg-[#fdfaf3] min-h-screen py-20">
      <div className="wrapper max-w-7xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a1a]">
            Subscription Plans
          </h1>
          <p className="text-[#6b7280] text-lg">
            Choose the perfect plan for your learning journey.
          </p>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          <PricingCard
            name="Free"
            description="A simple way to try the app with one book and short voice sessions."
            price="$0"
            status={plan === PLANS.FREE ? "Active" : "Upcoming"}
            isHighlighted={true}
            features={[
              "Upload 1 book",
              "5 voice sessions / month",
              "Up to 5 minutes per session",
              "No session history or re-indexing",
            ]}
            buttonText=""
            footerText="Starts Feb 2, 2027"
          />

          <PricingCard
            name="Standard"
            description="Ideal for regular reading with more books, longer sessions, and saved history."
            price="$8"
            priceSuffix="/month"
            billingInfo="Billed annually"
            planId={PLANS.STANDARD}
            status={plan === PLANS.STANDARD ? "Active" : undefined}
            features={[
              "Upload 10 books",
              "100 voice sessions / month",
              "Up to 15 minutes per session",
              "Session history saved",
            ]}
            buttonText="Resubscribe"
          />

          <PricingCard
            name="Pro"
            description="Best for deep reading and heavy use, with long sessions and full memory."
            price="$15"
            priceSuffix="/month"
            billingInfo="Billed annually"
            planId={PLANS.PRO}
            status={plan === PLANS.PRO ? "Active" : undefined}
            features={[
              "100 book uploads",
              "Unlimited voice sessions",
              "Up to 60 minutes per session",
              "Full session memory",
            ]}
            buttonText="Switch to this plan"
          />
        </div> */}
        <div className="clerk-pricing-container">
          <PricingTable />
        </div>
      </div>
    </div>
  );
}
