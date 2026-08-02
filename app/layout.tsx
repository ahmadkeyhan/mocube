import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={`${changa.variable} h-full antialiased`}
    >
      <body className="font-changa flex min-h-full flex-col">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
