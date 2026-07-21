type AnnouncementBannerProps = {
  text?: string;
};

export function AnnouncementBanner({ text }: AnnouncementBannerProps) {
  if (!text) return null;

  return (
    <div className="w-full px-16 py-12 text-center text-caption tracking-caption text-surface-cream">
      {text}
    </div>
  );
}
