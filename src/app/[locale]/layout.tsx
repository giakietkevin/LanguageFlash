import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Noto_Sans_JP, Noto_Sans_SC } from "next/font/google";
import { notFound } from "next/navigation";
import Script from "next/script";
import { I18nProvider } from "@/components/I18nProvider";
import { RegisterSW } from "@/components/RegisterSW";
import { themeScript } from "@/lib/theme-script";
import { getDict, isLocale } from "@/i18n";
import { LOCALES } from "@/lib/types";
import "../globals.css";
import "../card.css";

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
  display: "swap",
});

// Hanzi and kana in one face on every OS; loaded on demand by unicode range, never preloaded.
const notoJP = Noto_Sans_JP({ weight: ["500", "700"], variable: "--font-noto-jp", display: "swap", preload: false });
const notoSC = Noto_Sans_SC({ weight: ["500", "700"], variable: "--font-noto-sc", display: "swap", preload: false });

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDict(locale);
  return {
    title: { default: t.meta.title, template: "%s · LanguageFlash" },
    description: t.meta.description,
    alternates: { languages: { vi: "/vi", en: "/en" } },
    manifest: "/manifest.webmanifest",
    icons: { icon: "/icon.svg" },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#eef1e8" },
    { media: "(prefers-color-scheme: dark)", color: "#133621" },
  ],
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} className={`${beVietnam.variable} ${notoJP.variable} ${notoSC.variable}`} suppressHydrationWarning>
      <body>
        {/* Sets the theme before first paint; next/script places it in the initial HTML. */}
        <Script id="theme" strategy="beforeInteractive">
          {themeScript}
        </Sc