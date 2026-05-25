"use client";

import { Pencil, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function EditToggle({
  editing,
  onToggle,
  className
}: {
  editing: boolean;
  onToggle: () => void;
  className?: string;
}) {
  return (
    <Button
      size="sm"
      variant={editing ? "default" : "outline"}
      onClick={onToggle}
      className={cn("shrink-0", className)}
    >
      {editing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
      {editing ? "Terminer" : "Modifier"}
    </Button>
  );
}

export function CancelEditButton({ onClick }: { onClick: () => void }) {
  return (
    <Button size="icon" variant="ghost" onClick={onClick} aria-label="Annuler">
      <X className="h-4 w-4" />
    </Button>
  );
}

export function EditableField({
  label,
  value,
  editing,
  onChange,
  type = "text",
  suffix,
  placeholder
}: {
  label: string;
  value: string | number;
  editing: boolean;
  onChange: (value: string) => void;
  type?: "text" | "number";
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div className="rounded-md border border-white/10 bg-white/[0.04] p-3">
      <p className="text-xs font-medium uppercase text-muted-foreground">{label}</p>
      {editing ? (
        <div className="mt-2 flex items-center gap-2">
          <Input
            type={type}
            inputMode={type === "number" ? "decimal" : undefined}
            value={value}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
          {suffix && <span className="text-sm text-muted-foreground">{suffix}</span>}
        </div>
      ) : (
        <p className="mt-2 text-lg font-semibold">
          {value || "-"} {suffix}
        </p>
      )}
    </div>
  );
}
