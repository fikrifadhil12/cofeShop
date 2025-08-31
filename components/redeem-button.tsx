"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Gift, ArrowRight } from "lucide-react"

export function RedeemButton() {
  const [isRedeeming, setIsRedeeming] = useState(false)

  const handleRedeem = () => {
    setIsRedeeming(true)
    // Mock redemption process
    setTimeout(() => {
      setIsRedeeming(false)
      // Show success message in real app
    }, 2000)
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-40 safe-area-bottom">
      <Button
        size="lg"
        className="w-full h-14 rounded-2xl shadow-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold"
        onClick={handleRedeem}
        disabled={isRedeeming}
      >
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5" />
            <span>{isRedeeming ? "Processing..." : "Browse All Rewards"}</span>
          </div>
          <ArrowRight className="w-5 h-5" />
        </div>
      </Button>
    </div>
  )
}
