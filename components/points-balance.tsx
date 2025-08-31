"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"
import type { LoyaltyProgram } from "@/lib/types"

interface PointsBalanceProps {
  loyaltyData: LoyaltyProgram
}

const tierConfig = {
  bronze: { color: "bg-amber-600", label: "Bronze", icon: "🥉" },
  silver: { color: "bg-gray-400", label: "Silver", icon: "🥈" },
  gold: { color: "bg-yellow-500", label: "Gold", icon: "🥇" },
}

export function PointsBalance({ loyaltyData }: PointsBalanceProps) {
  const config = tierConfig[loyaltyData.tier]

  return (
    <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 ${config.color} rounded-full flex items-center justify-center text-white text-sm`}>
            {config.icon}
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            {config.label} Member
          </Badge>
        </div>
        <TrendingUp className="w-5 h-5 text-primary" />
      </div>

      <div className="text-center">
        <div className="font-serif text-4xl font-bold text-primary mb-2">{loyaltyData.points.toLocaleString()}</div>
        <p className="text-muted-foreground text-sm mb-4">Available Points</p>

        <div className="grid grid-cols-2 gap-4 text-center">
          <div className="p-3 bg-background/50 rounded-lg">
            <div className="font-semibold text-lg">$12.50</div>
            <div className="text-xs text-muted-foreground">Points Value</div>
          </div>
          <div className="p-3 bg-background/50 rounded-lg">
            <div className="font-semibold text-lg">156</div>
            <div className="text-xs text-muted-foreground">This Month</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
