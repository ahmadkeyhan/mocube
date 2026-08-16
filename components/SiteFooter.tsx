import Link from "next/link";
import { FaHashtag } from "react-icons/fa";
import { MdDesignServices, MdFolderOpen, MdRocket } from "react-icons/md";
import { toPersianDigits } from "@/lib/persian";

type SiteFooterProps = {
  settings: {
    phone: string;
    instagram: string;
    telegram: string;
  };
};

export function SiteFooter({ settings }: SiteFooterProps) {
  const phoneDigits = settings.phone.replace(/[^\d+]/g, "");
  const phoneDisplay = toPersianDigits(phoneDigits);

  return (
    <footer className="mt-auto border-t border-surface-25 bg-off-background">
      <div className="mx-auto grid max-w-[1280px] gap-32 px-16 py-76 md:grid-cols-4 md:px-24">
        <div className="md:col-span-1">
          <p className="text-body-sm text-shockingly-green">موکیوب</p>
          <p className="mt-16 text-body-sm text-surface-50">
            {"{ استودیو خلاق }"}
          </p>
        </div>

        <div>
          <p className="mb-16 text-caption text-surface-50">کاوش</p>
          <ul className="flex flex-col gap-12 text-body-sm text-foreground">
            <li>
              <Link
                href="/services"
                className="inline-flex items-center gap-1 hover:text-surface-50"
              >
                <MdDesignServices aria-hidden className="size-16 shrink-0" />
                سرویس‌ها
              </Link>
            </li>
            <li>
              <Link
                href="/microservices"
                className="inline-flex items-center gap-1 hover:text-surface-50"
              >
                <FaHashtag aria-hidden className="size-16 shrink-0" />
                میکروسرویس‌ها
              </Link>
            </li>
            <li>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1 hover:text-surface-50"
              >
                <MdFolderOpen aria-hidden className="size-16 shrink-0" />
                پروژه‌ها
              </Link>
            </li>
            <li>
              <Link
                href="/customers"
                className="inline-flex items-center gap-1 hover:text-surface-50"
              >
                <MdRocket aria-hidden className="size-16 shrink-0" />
                مشتریان
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-surface-50">
                تماس
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-16 text-caption text-surface-50">سرویس‌ها</p>
          <ul className="flex flex-col gap-12 text-body-sm">
            <li>
              <Link href="/services/branding" className="text-orangey">
                هویت برند
              </Link>
            </li>
            <li>
              <Link href="/services/illustration" className="text-pink">
                تصویرسازی
              </Link>
            </li>
            <li>
              <Link href="/services/web" className="text-lilac">
                توسعه وب
              </Link>
            </li>
            <li>
              <Link href="/services/merch" className="text-blue">
                مرچندایز
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-16 text-caption text-surface-50">ارتباط</p>
          <ul className="flex flex-col gap-12 text-body-sm text-foreground">
            <li>
              <a
                href={`tel:${phoneDigits}`}
                className="hover:text-shockingly-green"
                dir="ltr"
              >
                {phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${settings.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-shockingly-green"
              >
                اینستاگرام
              </a>
            </li>
            <li>
              <a
                href={`https://t.me/${settings.telegram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-shockingly-green"
              >
                تلگرام
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
