'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Show, SignInButton } from '@clerk/nextjs';
import { CheckoutButton } from '@clerk/nextjs/experimental';

interface PricingCardProps {
  name: string;
  description: string;
  price: string;
  priceSuffix?: string;
  billingInfo?: string;
  features: string[];
  buttonText: string;
  planId?: string;
  status? : 'Active' | 'Upcoming';
  isHighlighted?: boolean;
  footerText?: string;
  onAction?: () => void;
}

const PricingCard = ({
  name,
  description,
  price,
  priceSuffix,
  billingInfo,
  features,
  buttonText,
  planId,
  status,
  isHighlighted,
  footerText,
  onAction,
}: PricingCardProps) => {
  return (
    <div
      className={cn(
        'relative flex flex-col h-full bg-white rounded-[32px] p-8 shadow-sm transition-all duration-300 border-2',
        isHighlighted ? 'border-[#663820]' : 'border-neutral-100'
      )}
    >
      {status && (
        <div className="absolute top-6 right-6">
          <span className="bg-[#4b2c20] text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {status}
          </span>
        </div>
      )}

      <div className="mb-8 pr-12">
        <h3 className="text-2xl font-bold text-[#1a1a1a] mb-3">{name}</h3>
        <p className="text-[#6b7280] text-sm leading-relaxed min-h-[48px]">
          {description}
        </p>
      </div>

      <div className="mb-8">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-[#1a1a1a]">{price}</span>
          {priceSuffix && (
            <span className="text-[#6b7280] text-sm font-medium">{priceSuffix}</span>
          )}
        </div>
        <div className="mt-2 h-6 flex items-center gap-2">
            {billingInfo && (
                <>
                    <div className="w-8 h-4 bg-[#1a1a1a] rounded-full relative">
                        <div className="absolute left-1 top-1 w-2 h-2 bg-white rounded-full" />
                    </div>
                    <span className="text-[#6b7280] text-xs font-medium">{billingInfo}</span>
                </>
            )}
            {!billingInfo && name === 'Free' && (
                <span className="text-[#6b7280] text-xs font-medium">Always free</span>
            )}
        </div>
      </div>

      <div className="flex-1 border-t border-neutral-100 pt-8 mb-8 space-y-4">
        {features.map((feature, i) => (
          <div key={i} className="flex gap-3 items-start">
            <Check className="w-4 h-4 text-[#6b7280] mt-0.5 shrink-0" />
            <span className="text-sm text-[#4b5563]">{feature}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 flex flex-col items-center">
        {buttonText && name !== 'Free' && planId ? (
          <div className="w-full">
            <Show when="signed-in">
              <CheckoutButton planId={planId}>
                <button
                  className="w-full py-4 bg-[#212a3b] text-white rounded-2xl font-bold hover:bg-[#1a212e] transition-all active:scale-[0.98] cursor-pointer"
                >
                  {buttonText}
                </button>
              </CheckoutButton>
            </Show>
            <Show when="signed-out">
              <SignInButton mode="modal">
                <button
                  className="w-full py-4 bg-[#212a3b] text-white rounded-2xl font-bold hover:bg-[#1a212e] transition-all active:scale-[0.98] cursor-pointer"
                >
                  Sign in to Subscribe
                </button>
              </SignInButton>
            </Show>
          </div>
        ) : (
            <div className="h-4" />
        )}
        
        {footerText && (
          <p className="mt-4 text-[#6b7280] text-sm font-medium">
            {footerText}
          </p>
        )}
      </div>
    </div>
  );
};

export default PricingCard;
