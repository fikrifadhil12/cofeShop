"use client"

import { AppShell } from "@/components/app-shell"
import { LoyaltyHeader } from "@/components/loyalty-header"
import { PointsBalance } from "@/components/points-balance"
import { TierProgress } from "@/components/tier-progress"
import { VouchersCarousel } from "@/components/vouchers-carousel"
import { PointsHistory } from "@/components/points-history"
import { RedeemButton } from "@/components/redeem-button"
import { mockLoyaltyData } from "@/lib/mock-loyalty"

export default function LoyaltyPage() {
  return (
    <AppShell currentPage="loyalty">
      <div className="min-h-screen bg-background pb-24">
        <LoyaltyHeader />
        <div className="px-4 py-6 space-y-6">
          <PointsBalance loyaltyData={mockLoyaltyData} />
          <TierProgress loyaltyData={mockLoyaltyData} />
          <VouchersCarousel vouchers={mockLoyaltyData.vouchers} />
          <PointsHistory />
        </div>
        <RedeemButton />
      </div>
    </AppShell>
  )
}
