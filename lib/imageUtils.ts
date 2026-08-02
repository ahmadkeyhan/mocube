const CDN_PREFIX =
  process.env.NEXT_PUBLIC_CDN_PREFIX ?? "https://c915814.parspack.net/c915814/";

const KEY_PREFIX = "mocube/";

export function getCdnPrefix() {
  return CDN_PREFIX.endsWith("/") ? CDN_PREFIX : `${CDN_PREFIX}/`;
}

export function isStorageUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith(KEY_PREFIX)) return true;
  if (url.startsWith(getCdnPrefix())) return true;
  return url.includes(`/${KEY_PREFIX}`);
}

export function extractS3Key(imageOrKey: string): string {
  if (imageOrKey.startsWith(KEY_PREFIX)) return imageOrKey;

  const prefix = getCdnPrefix();
  if (imageOrKey.startsWith(prefix)) return imageOrKey.slice(prefix.length);

  const keyIndex = imageOrKey.indexOf(KEY_PREFIX);
  if (keyIndex >= 0) return imageOrKey.slice(keyIndex);

  return imageOrKey;
}

export function toCdnUrl(key: string): string {
  return `${getCdnPrefix()}${key}`;
}

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const result = await fetch("/api/storage/upload", {
    method: "POST",
    body: formData,
  });

  if (!result.ok) {
    const error = await result.json().catch(() => ({}));
    throw new Error(error.message || "Failed to upload image");
  }

  const data = await result.json();
  return data.key as string;
};

export const deleteImage = async (imageOrKey: string): Promise<void> => {
  if (!isStorageUrl(imageOrKey)) return;

  const key = extractS3Key(imageOrKey);
  const result = await fetch("/api/storage/delete", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key }),
  });

  if (!result.ok) {
    const error = await result.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete image");
  }
};
