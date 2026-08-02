"use client";

import { type ChangeEvent, useRef, useState } from "react";
import {
  deleteImage,
  isStorageUrl,
  toCdnUrl,
  uploadImage,
} from "@/lib/imageUtils";

type ImageUploaderProps = {
  value?: string;
  onChange?: (url: string) => void;
  name?: string;
  className?: string;
};

const buttonClasses =
  "rounded-full border border-surface-25 px-16 py-8 text-caption text-surface-cream transition-colors hover:border-shockingly-green disabled:cursor-not-allowed disabled:opacity-50";

export function ImageUploader({
  value = "",
  onChange,
  name,
  className = "",
}: ImageUploaderProps) {
  const [url, setUrl] = useState(value);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function commit(next: string) {
    setUrl(next);
    onChange?.(next);
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("لطفاً فایل تصویری بارگذاری کنید.");
      return;
    }

    if (file.size > 500 * 1024) {
      setError("فایل باید کوچک‌تر از ۵۰۰ کیلوبایت باشد.");
      return;
    }

    let localPreview: string | null = null;

    try {
      setIsUploading(true);
      localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      const key = await uploadImage(file);
      const previous = url;

      commit(toCdnUrl(key));
      setPreviewUrl(null);

      if (previous && isStorageUrl(previous)) {
        try {
          await deleteImage(previous);
        } catch {
          // Best-effort cleanup of the previous object.
        }
      }
    } catch (err) {
      setPreviewUrl(null);
      setError(err instanceof Error ? err.message : "بارگذاری ناموفق بود.");
    } finally {
      setIsUploading(false);
      if (localPreview) URL.revokeObjectURL(localPreview);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove() {
    if (!url) return;

    setError(null);
    try {
      setIsUploading(true);
      if (isStorageUrl(url)) {
        await deleteImage(url);
      }
      commit("");
      setPreviewUrl(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف تصویر ناموفق بود.");
    } finally {
      setIsUploading(false);
    }
  }

  const displayUrl = previewUrl || (url.startsWith("#") ? "" : url);

  return (
    <div className={`flex flex-col gap-12 ${className}`}>
      {name ? <input type="hidden" name={name} value={url} readOnly /> : null}

      <div className="flex items-center gap-8">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={buttonClasses}
        >
          {isUploading
            ? "در حال بارگذاری…"
            : url
              ? "تعویض تصویر"
              : "آپلود تصویر"}
        </button>

        {url ? (
          <button
            type="button"
            onClick={handleRemove}
            disabled={isUploading}
            className={`${buttonClasses} border-lipstick-pink text-lipstick-pink hover:border-lipstick-pink`}
          >
            حذف
          </button>
        ) : null}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {displayUrl ? (
        <div className="relative h-40 w-40 overflow-hidden rounded-lg border border-surface-25 bg-off-black">
          {/* biome-ignore lint/performance/noImgElement: blob + CDN preview in admin */}
          <img
            src={displayUrl}
            alt="پیش‌نمایش"
            className="h-full w-full object-contain"
          />
        </div>
      ) : url.startsWith("#") ? (
        <div
          className="h-40 w-40 rounded-lg border border-surface-25"
          style={{ background: url }}
          title="رنگ قدیمی — با آپلود جایگزین کنید"
        />
      ) : null}

      {error ? (
        <p className="text-caption text-lipstick-pink">{error}</p>
      ) : null}
    </div>
  );
}

type MultiImageUploaderProps = {
  urls: string[];
  onChange: (urls: string[]) => void;
  name?: string;
  className?: string;
};

export function MultiImageUploader({
  urls,
  onChange,
  name,
  className = "",
}: MultiImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    setError(null);

    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError("لطفاً فقط فایل تصویری بارگذاری کنید.");
        return;
      }
      if (file.size > 500 * 1024) {
        setError("هر فایل باید کوچک‌تر از ۵۰۰ کیلوبایت باشد.");
        return;
      }
    }

    try {
      setIsUploading(true);
      const uploaded: string[] = [];

      for (const file of files) {
        const key = await uploadImage(file);
        uploaded.push(toCdnUrl(key));
      }

      onChange([...urls, ...uploaded]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "بارگذاری ناموفق بود.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleRemove(targetUrl: string) {
    setError(null);
    try {
      setIsUploading(true);
      if (isStorageUrl(targetUrl)) {
        await deleteImage(targetUrl);
      }
      onChange(urls.filter((url) => url !== targetUrl));
    } catch (err) {
      setError(err instanceof Error ? err.message : "حذف تصویر ناموفق بود.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className={`flex flex-col gap-12 ${className}`}>
      {name ? (
        <input type="hidden" name={name} value={urls.join("\n")} readOnly />
      ) : null}

      <div className="flex flex-wrap gap-8">
        {urls.map((url) => (
          <div
            key={url}
            className="relative h-28 w-28 overflow-hidden rounded-lg border border-surface-25 bg-off-black"
          >
            {url.startsWith("#") ? (
              <div className="h-full w-full" style={{ background: url }} />
            ) : (
              // biome-ignore lint/performance/noImgElement: admin gallery thumbnails
              <img
                src={url}
                alt="تصویر گالری"
                className="h-full w-full object-cover"
              />
            )}
            <button
              type="button"
              onClick={() => handleRemove(url)}
              disabled={isUploading}
              className="absolute top-4 left-4 rounded-full bg-just-black/80 px-8 py-2 text-[10px] text-lipstick-pink disabled:opacity-50"
            >
              حذف
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className={`${buttonClasses} self-start`}
      >
        {isUploading ? "در حال بارگذاری…" : "افزودن تصویر"}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error ? (
        <p className="text-caption text-lipstick-pink">{error}</p>
      ) : null}
    </div>
  );
}
