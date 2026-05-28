"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploadButtonProps = {
  value?: string;
  label?: string;
  removeLabel?: string;
  compact?: boolean;
  className?: string;
  maxSize?: number;
  onChange: (value: string) => void;
  onRemove?: () => void;
};

export function ImageUploadButton({
  value,
  label = "Importer une photo",
  removeLabel = "Supprimer",
  compact = false,
  className,
  maxSize = 1400,
  onChange,
  onRemove
}: ImageUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Choisis une image.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const dataUrl = await imageFileToDataUrl(file, maxSize);
      onChange(dataUrl);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Image impossible a importer.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size={compact ? "sm" : "default"}
          onClick={() => inputRef.current?.click()}
          disabled={busy}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
          {busy ? "Import..." : label}
        </Button>
        {value && onRemove && (
          <Button type="button" variant="ghost" size={compact ? "sm" : "default"} onClick={onRemove}>
            <Trash2 className="h-4 w-4" />
            {removeLabel}
          </Button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

async function imageFileToDataUrl(file: File, maxSize: number) {
  if (file.type === "image/gif" || file.type === "image/svg+xml") {
    return readFileAsDataUrl(file);
  }

  try {
    return await resizeImageFile(file, maxSize);
  } catch {
    return readFileAsDataUrl(file);
  }
}

function readFileAsDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Lecture du fichier impossible."));
    reader.readAsDataURL(file);
  });
}

function resizeImageFile(file: File, maxSize: number) {
  return new Promise<string>((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const longestSide = Math.max(image.width, image.height);
      const ratio = longestSide > maxSize ? maxSize / longestSide : 1;
      const width = Math.max(1, Math.round(image.width * ratio));
      const height = Math.max(1, Math.round(image.height * ratio));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Compression image indisponible."));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.fillStyle = "#05070a";
      context.fillRect(0, 0, width, height);
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.84));
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image impossible a charger."));
    };

    image.src = objectUrl;
  });
}
