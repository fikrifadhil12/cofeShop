"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { History, Plus, Minus, Gift } from "lucide-react"

const mockHistory = [
  {
    id: "1",
    type: "earned",
    points: 25,
    description: "Order #ORD-1703847291",
    date: new Date("2024-12-29T10:30:00"),
  },
  {
    id: "2",
    type: "redeemed",
    points: -100,
    description: "Free Coffee Voucher",
    date: new Date("2024-12-28T16:45:00"),
  },
  {
    id: "3",
    type: "earned",
    points: 18,
    description: "Order #ORD-1703843691",
    date: new Date("2024-12-28T14:20:00"),
  },
  {
    id: "4",
    type: "bonus",
    points: 50,
    description: "Welcome Bonus",
    date: new Date("2024-12-27T12:00:00"),
  },
]

export function PointsHistory() {
  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4 flex items-center gap-2">
        <History className="w-5 h-5 text-primary" />
        Recent Activity
      </h2>

      <div className="space-y-3">
        {mockHistory.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  item.type === "earned"
                    ? "bg-green-100 text-green-600"
                    : item.type === "redeemed"
                      ? "bg-red-100 text-red-600"
                      : "bg-blue-100 text-blue-600"
                }`}
              >
                {item.type === "earned" ? (
                  <Plus className="w-4 h-4" />
                ) : item.type === "redeemed" ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Gift className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-sm">{item.description}</p>
                <p className="text-xs text-muted-foreground">
                  {item.date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
            <Badge
              variant={item.points > 0 ? "default" : "secondary"}
              className={`${
                item.points > 0
                  ? "bg-green-100 text-green-800 border-green-200"
                  : "bg-red-100 text-red-800 border-red-200"
              }`}
            >
              {item.points > 0 ? "+" : ""}
              {item.points}
            </Badge>
          </div>
        ))}
      </div>
    </Card>
  )
}
