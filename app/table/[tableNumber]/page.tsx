"use client"

import { useEffect, useState } from "react"
import { AppShell } from "@/components/app-shell"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { QrCode, MapPin, Users, Clock } from "lucide-react"
import Link from "next/link"

interface TableOrderPageProps {
  params: {
    tableNumber: string
  }
}

export default function TableOrderPage({ params }: TableOrderPageProps) {
  const [tableInfo, setTableInfo] = useState<any>(null)

  useEffect(() => {
    // Mock table info fetch
    setTableInfo({
      number: params.tableNumber,
      capacity: 4,
      location: "Window side",
      estimatedWait: "5-10 min",
    })
  }, [params.tableNumber])

  if (!tableInfo) {
    return (
      <AppShell currentPage="menu">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading table information...</p>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell currentPage="menu">
      <div className="min-h-screen bg-background">
        {/* QR Code Header */}
        <div className="px-4 py-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-b">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <QrCode className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-serif text-2xl font-bold mb-2">Table {tableInfo.number}</h1>
            <p className="text-muted-foreground text-sm">Welcome to BrewCraft! Order directly from your table.</p>
          </div>
        </div>

        <div className="px-4 py-6 space-y-4">
          {/* Table Information */}
          <Card className="p-4">
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Table Information
            </h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span>Seats {tableInfo.capacity}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{tableInfo.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span>Wait: {tableInfo.estimatedWait}</span>
              </div>
              <Badge variant="secondary" className="w-fit">
                Dine-in Service
              </Badge>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Link href="/menu" className="block">
              <Button size="lg" className="w-full h-16 rounded-xl flex-col gap-2">
                <span className="text-lg">☕</span>
                <span>Browse Menu</span>
              </Button>
            </Link>
            <Link href="/loyalty" className="block">
              <Button variant="outline" size="lg" className="w-full h-16 rounded-xl flex-col gap-2 bg-transparent">
                <span className="text-lg">🎁</span>
                <span>View Rewards</span>
              </Button>
            </Link>
          </div>

          {/* Special Offers */}
          <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200">
            <h3 className="font-semibold text-green-800 dark:text-green-200 mb-2">Table Special</h3>
            <p className="text-sm text-green-700 dark:text-green-300 mb-3">
              Get 10% off your first order when you order from this table!
            </p>
            <Badge variant="secondary" className="bg-green-200 text-green-800">
              Auto-applied at checkout
            </Badge>
          </Card>

          {/* Instructions */}
          <Card className="p-4 bg-muted/50">
            <h3 className="font-semibold mb-2">How to Order</h3>
            <ol className="text-sm text-muted-foreground space-y-1">
              <li>1. Browse our menu and add items to your cart</li>
              <li>2. Your table number ({tableInfo.number}) is automatically added</li>
              <li>3. Complete your order and payment</li>
              <li>4. We'll bring your order directly to your table</li>
            </ol>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
