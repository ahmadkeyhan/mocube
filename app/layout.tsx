import type { Metadata } from "next";
import localFont from "next/font/local";
// import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { getSiteSettings } from "@/lib/queries/site";
import "./globals.css";

export const dynamic = "force-dynamic";

const changa = localFont({
  src: "./fonts/changa/Changa-VariableFont.ttf",
  variable: "--font-changa-face",
  weight: "200 800",
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
      suppressHydrationWarning
      className={`${changa.variable} h-full antialiased`}
    >
      <body className="font-changa flex min-h-full flex-col">
        <ThemeProvider>
          {/* <AnnouncementBanner text={settings.announcement} /> */}
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter settings={settings} />
        </ThemeProvider>
      </body>
    </html>
  );
}
