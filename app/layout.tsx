import type { Metadata } from "next";
import localFont from "next/font/local";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { getSiteSettings } from "@/lib/queries/site";
import "./globals.css";

export const dynamic = "force-dynamic";

const rooyin = localFont({
  src: [
    {
      path: "./fonts/rooyin/Rooyin-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/rooyin/Rooyin-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-rooyin-face",
  display: "swap",
});

const ravi = localFont({
  src: [
    {
      path: "./fonts/ravi/RaviFaNum-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/ravi/RaviFaNum-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-ravi-face",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "موکیوب | استودیو خلاق",
    template: "%s | موکیوب",
  },
  description:
    "استودیو خلاق موکیوب — هویت برند، تصویرسازی، توسعه وب و طراحی مرچندایز",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html
      lang="fa"
      dir="rtl"
      className={`${rooyin.variable} ${ravi.variable} h-full antialiased`}
    >
      <body className="font-ravi flex min-h-full flex-col bg-just-black text-surface-cream">
        <AnnouncementBanner text={settings.announcement} />
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter settings={settings} />
      </body>
    </html>
  );
}
