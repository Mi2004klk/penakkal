import type { Metadata, Viewport } from "next";
import { 
  Noto_Serif_Tamil, 
  Noto_Sans_Tamil, 
  Noto_Naskh_Arabic 
} from "next/font/google";
import "./globals.css";

const notoSerifTamil = Noto_Serif_Tamil({
  weight: ["400", "700"],
  subsets: ["tamil", "latin"],
  variable: "--next-font-display",
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  weight: ["400", "500", "700"],
  subsets: ["tamil", "latin"],
  variable: "--next-font-ui",
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  weight: ["400", "700"],
  subsets: ["arabic", "latin"],
  variable: "--next-font-arabic",
  display: "swap",
});

import ThemeProvider from "@/components/ui/ThemeProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import JsonLd from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebSiteSchema, absoluteUrl } from "@/lib/seo";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | பேனாக்கள்",
    default: "பேனாக்கள் — இஸ்லாமிய தமிழ் வலைப்பூ",
  },
  description: "தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ",
  openGraph: {
    locale: "ta_IN",
    siteName: "பேனாக்கள்",
    images: [{ url: "/og-default.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "பேனாக்கள்",
    description: "தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ",
    images: ["/og-default.png"],
  },
  alternates: {
    types: {
      'application/rss+xml': '/feed.xml',
    },
  },
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'apple-touch-icon-precomposed', url: '/apple-touch-icon.png' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: "#fcf7ed", // Default, will be overwritten by theme-init script if dark
};

import { STORAGE_KEY } from "@/store/useStore";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ta" dir="ltr" suppressHydrationWarning>
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let store = localStorage.getItem('${STORAGE_KEY}');
                let theme = null;
                if (store) {
                  let parsed = JSON.parse(store);
                  theme = parsed.state?.theme;
                  let fs = parsed.state?.fontSize;
                  if (fs) document.documentElement.setAttribute('data-font-size', fs);
                }
                
                let isDark = false;
                if (theme === 'dark') {
                  isDark = true;
                } else if (theme === 'system' || !theme) {
                  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    isDark = true;
                  }
                }
                
                if (isDark) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.setAttribute('data-theme', 'dark');
                  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
                  if (metaThemeColor) metaThemeColor.setAttribute('content', '#171717');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (_) {}
            `,
          }}
        />
        <JsonLd data={getOrganizationSchema()} />
        <JsonLd data={getWebSiteSchema()} />
      </head>
      <body
        className={`${notoSerifTamil.variable} ${notoSansTamil.variable} ${notoNaskhArabic.variable} antialiased pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0`}
      >
        <ThemeProvider>
          {children}
          <div id="floating-dock" className="fixed bottom-[calc(4rem+env(safe-area-inset-bottom)+12px)] right-4 md:bottom-6 md:right-6 lg:bottom-10 lg:right-10 z-nav flex flex-col-reverse items-end gap-3 pointer-events-none">
            <ScrollToTop />
          </div>
        </ThemeProvider>
        <Script defer data-domain="penakkal.com" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
