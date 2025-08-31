"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  Coffee,
  Package,
  MapPin,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ApiOrder } from "@/lib/types";
import { useTranslation } from "@/lib/i18n";

interface OrderDetailsProps {
  order: ApiOrder;
  onBack: () => void;
}

export function OrderDetails({ order, onBack }: OrderDetailsProps) {
  const { t } = useTranslation();
  const [currentOrder, setCurrentOrder] = useState<ApiOrder>(order);

  // ✅ Polling tiap 5 detik untuk ambil data terbaru
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${order.id}`);
        if (res.ok) {
          const data = await res.json();
          setCurrentOrder(data);
        }
      } catch (err) {
        console.error("❌ Gagal refresh order:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [order.id]);

  const statusSteps = [
    {
      id: "pending",
      label: t("orderReceived"),
      icon: CheckCircle,
      description: t("orderReceived"),
    },
    {
      id: "preparing",
      label: t("preparing"),
      icon: Coffee,
      description: t("preparing"),
    },
    {
      id: "ready",
      label: t("readyForPickup"),
      icon: Package,
      description: t("readyForPickup"),
    },
    {
      id: "completed",
      label: t("completed"),
      icon: CheckCircle,
      description: t("completed"),
    },
  ];

  const currentStepIndex = statusSteps.findIndex(
    (step) => step.id === currentOrder.status
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-16 z-40 bg-background border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="font-serif text-xl font-bold">
              {t("yourOrders")} #{currentOrder.id}
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date(currentOrder.created_at).toLocaleDateString("id-ID", {
                weekday: "long",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Order Status Timeline */}
        <Card className="p-4">
          <h2 className="font-semibold mb-4">{t("orderStatus")}</h2>
          <div className="space-y-4">
            {statusSteps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const isLast = index === statusSteps.length - 1;

              return (
                <div key={step.id} className="flex items-start gap-3">
                  {/* Timeline Line */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center border-2",
                        isCompleted
                          ? "bg-primary border-primary text-primary-foreground"
                          : "bg-background border-muted-foreground text-muted-foreground",
                        isCurrent && "ring-2 ring-primary/20"
                      )}
                    >
                      <StepIcon className="w-4 h-4" />
                    </div>
                    {!isLast && (
                      <div
                        className={cn(
                          "w-0.5 h-8 mt-1",
                          isCompleted ? "bg-primary" : "bg-muted-foreground/30"
                        )}
                      />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <h3
                        className={cn(
                          "font-medium",
                          isCompleted
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                      >
                        {step.label}
                      </h3>
                      {isCurrent && (
                        <Badge variant="default" className="text-xs">
                          {t("current")}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                    {isCompleted && (
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(
                          currentOrder.updated_at || currentOrder.created_at
                        ).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Estimated Time */}
          {currentOrder.status !== "completed" && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">
                {t("minutes").replace("{time}", "15")}
              </span>
            </div>
          )}
        </Card>

        {/* Order Items */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">{t("orderItems")}</h3>
          <div className="space-y-4">
            {currentOrder.items.map((item, index) => (
              <div key={index} className="flex gap-3">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.product_name}
                  className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h4 className="font-medium text-sm">{item.product_name}</h4>
                    <span className="font-serif font-bold text-primary">
                      Rp{" "}
                      {(Number(item.price) * item.quantity).toLocaleString(
                        "id-ID"
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mb-1">
                    {t("quantity").replace("{count}", item.quantity.toString())}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Order Details */}
        <Card className="p-4">
          <h3 className="font-semibold mb-4">{t("orderDetails")}</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span className="font-medium">{t("orderType")}:</span>
              <span className="capitalize">
                {currentOrder.order_type.replace("-", " ")}
              </span>
              {currentOrder.table_no && (
                <Badge variant="outline">
                  {t("table").replace(
                    "{number}",
                    currentOrder.table_no.toString()
                  )}
                </Badge>
              )}
            </div>

            {currentOrder.customer_notes && (
              <div className="flex gap-2">
                <div className="w-4 h-4 flex-shrink-0" />
                <div>
                  <span className="font-medium">
                    {t("specialInstructions")}:
                  </span>
                  <p className="text-muted-foreground mt-1">
                    {currentOrder.customer_notes}
                  </p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Order Summary */}
        <Card className="p-4 bg-muted/50">
          <h3 className="font-semibold mb-3">{t("orderSummary")}</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>{t("subtotal")}</span>
              <span>
                Rp {Number(currentOrder.subtotal || 0).toLocaleString("id-ID")}
              </span>
            </div>
            {currentOrder.delivery_fee && (
              <div className="flex justify-between">
                <span>{t("serviceFee")}</span>
                <span>
                  Rp {Number(currentOrder.delivery_fee).toLocaleString("id-ID")}
                </span>
              </div>
            )}
            <div className="border-t pt-2 flex justify-between font-semibold text-base">
              <span>{t("total")}</span>
              <span>
                Rp {Number(currentOrder.total_amount).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          {currentOrder.status !== "completed" && (
            <Button size="lg" className="w-full h-12 rounded-xl gap-2">
              <Phone className="w-4 h-4" />
              {t("contactSupport")}
            </Button>
          )}

          <Button
            variant="outline"
            size="lg"
            className="w-full h-12 rounded-xl bg-transparent"
          >
            {t("reorderItems")}
          </Button>
        </div>
      </div>
    </div>
  );
}
