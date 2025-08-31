"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Crown, Gift } from "lucide-react"
import type { LoyaltyProgram } from "@/lib/types"

interface TierProgressProps {
  loyaltyData: LoyaltyProgram
}

const tierThresholds = {
  bronze: { min: 0, max: 500, next: "silver" },
  silver: { min: 500, max: 1500, next: "gold" },
  gold: { min: 1500, max: Number.POSITIVE_INFINITY, next: null },
}

const tierBenefits = {
  bronze: ["5% discount on drinks", "Birthday reward"],
  silver: ["10% discount on drinks", "Free size upgrade", "Early access to new items"],
  gold: ["15% discount on drinks", "Free monthly drink", "Priority support", "Exclusive events"],
}

export function TierProgress({ loyaltyData }: TierProgressProps) {
  const currentTier = tierThresholds[loyaltyData.tier]
  const progress = currentTier.next
    ? ((loyaltyData.points - currentTier.min) / (currentTier.max - currentTier.min)) * 100
    : 100
  const pointsToNext = currentTier.next ? currentTier.max - loyaltyData.points : 0

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Crown className="w-5 h-5 text-primary" />
          Tier Progress
        </h2>
        {currentTier.next && (
          <Badge variant="outline" className="text-xs">
            {pointsToNext} points to {currentTier.next}
          </Badge>
        )}
      </div>

      {currentTier.next ? (
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="capitalize">{loyaltyData.tier}</span>
            <span className="capitalize">{currentTier.next}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {pointsToNext} more points to unlock {currentTier.next} benefits
          </p>
        </div>
      ) : (
        <div className="mb-4 text-center p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
          <Crown className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
          <p className="font-semibold text-yellow-800 dark:text-yellow-200">You've reached the highest tier!</p>
        </div>
      )}

      <div>
        <h3 className="font-medium text-sm mb-2 flex items-center gap-1">
          <Gift className="w-4 h-4" />
          Your {loyaltyData.tier} Benefits
        </h3>
        <ul className="space-y-1">
          {tierBenefits[loyaltyData.tier].map((benefit, index) => (
            <li key={index} className="text-xs text-muted-foreground flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full" />
              {benefit}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  )
}
