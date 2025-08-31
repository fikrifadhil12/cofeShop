"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Gift, Clock, DollarSign, Percent } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Voucher } from "@/lib/types"

interface VouchersCarouselProps {
  vouchers: Voucher[]
}

export function VouchersCarousel({ vouchers }: VouchersCarouselProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<string | null>(null)

  const handleRedeem = (voucherId: string) => {
    setSelectedVoucher(voucherId)
    // Mock redemption logic
    setTimeout(() => {
      setSelectedVoucher(null)
      // Show success toast in real app
    }, 1000)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Gift className="w-5 h-5 text-primary" />
          Available Rewards
        </h2>
        <Badge variant="secondary">{vouchers.length}</Badge>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {vouchers.map((voucher) => (
          <VoucherCard
            key={voucher.id}
            voucher={voucher}
            isRedeeming={selectedVoucher === voucher.id}
            onRedeem={handleRedeem}
          />
        ))}
      </div>

      {vouchers.length === 0 && (
        <Card className="p-8 text-center">
          <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold mb-2">No rewards available</h3>
          <p className="text-sm text-muted-foreground">Keep earning points to unlock amazing rewards!</p>
        </Card>
      )}
    </div>
  )
}

function VoucherCard({
  voucher,
  isRedeeming,
  onRedeem,
}: {
  voucher: Voucher
  isRedeeming: boolean
  onRedeem: (id: string) => void
}) {
  const isExpiringSoon = new Date(voucher.expiryDate).getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000
  const daysLeft = Math.ceil((new Date(voucher.expiryDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000))

  return (
    <Card className="flex-shrink-0 w-72 p-4 bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {voucher.discount >= 1 ? (
            <DollarSign className="w-5 h-5 text-primary" />
          ) : (
            <Percent className="w-5 h-5 text-primary" />
          )}
          <Badge variant={isExpiringSoon ? "destructive" : "secondary"} className="text-xs">
            {isExpiringSoon ? `${daysLeft}d left` : "Valid"}
          </Badge>
        </div>
        <div className="text-right">
          <div className="font-serif text-2xl font-bold text-primary">
            {voucher.discount >= 1 ? `$${voucher.discount}` : `${(voucher.discount * 100).toFixed(0)}%`}
          </div>
          <div className="text-xs text-muted-foreground">OFF</div>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-sm mb-1">{voucher.title}</h3>
        <p className="text-xs text-muted-foreground mb-2">{voucher.description}</p>
        {voucher.minSpend && (
          <p className="text-xs text-muted-foreground">Min. spend: ${voucher.minSpend.toFixed(2)}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Expires {new Date(voucher.expiryDate).toLocaleDateString()}</span>
        </div>
        <Button
          size="sm"
          className={cn("h-8 text-xs", isRedeeming && "opacity-50")}
          onClick={() => onRedeem(voucher.id)}
          disabled={isRedeeming}
        >
          {isRedeeming ? "Redeeming..." : "Redeem"}
        </Button>
      </div>
    </Card>
  )
}
