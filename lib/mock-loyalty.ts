import type { LoyaltyProgram } from "./types"

export const mockLoyaltyData: LoyaltyProgram = {
  points: 1250,
  tier: "silver",
  vouchers: [
    {
      id: "voucher-1",
      title: "Free Coffee",
      description: "Get any coffee drink on the house",
      discount: 6.0,
      expiryDate: new Date("2025-01-15"),
      minSpend: 0,
    },
    {
      id: "voucher-2",
      title: "20% Off Order",
      description: "Save 20% on your entire order",
      discount: 0.2,
      expiryDate: new Date("2025-01-30"),
      minSpend: 15,
    },
    {
      id: "voucher-3",
      title: "Free Pastry",
      description: "Complimentary pastry with any drink purchase",
      discount: 4.0,
      expiryDate: new Date("2025-01-10"),
      minSpend: 5,
    },
    {
      id: "voucher-4",
      title: "Buy 2 Get 1 Free",
      description: "Third drink is on us when you buy two",
      discount: 0.33,
      expiryDate: new Date("2025-02-14"),
      minSpend: 12,
    },
  ],
}
