"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CopyField({ value, label }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="space-y-2">
      {label && <div className="text-sm text-muted-foreground">{label}</div>}
      <div className="flex gap-2">
        <Input readOnly value={value} className="font-mono" />
        <Button
          type="button"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            setTimeout(() => setCopied(false), 1200);
          }}
        >
          {copied ? "Disalin" : "Salin"}
        </Button>
      </div>
    </div>
  );
}
