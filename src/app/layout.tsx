import type { Metadata } from "next";
import { 
  Noto_Serif_Tamil, 
  Noto_Sans_Tamil, 
  Noto_Naskh_Arabic, 
  Amiri_Quran,
  Playfair_Display,
  Inter,
  Barlow_Condensed
} from "next/font/google";
import "../styles/globals.css";

const notoSerifTamil = Noto_Serif_Tamil({
  weight: ["400", "700"],
  subsets: ["tamil"],
  variable: "--font-noto-serif-tamil",
  display: "swap",
});

const notoSansTamil = Noto_Sans_Tamil({
  weight: ["400", "500", "700"],
  subsets: ["tamil"],
  variable: "--font-noto-sans-tamil",
  display: "swap",
});

const notoNaskhArabic = Noto_Naskh_Arabic({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-noto-naskh-arabic",
  display: "swap",
});

const amiriQuran = Amiri_Quran({
  weight: ["400"],
  subsets: ["arabic"],
  variable: "--font-amiri-quran",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-gt-alpina-condensed",
  display: "swap",
});

const inter = Inter({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-gt-america-standard",
  display: "swap",
});



const barlowCondensed = Barlow_Condensed({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-gt-america-condensed",
  display: "swap",
});

import ThemeProvider from "@/components/ui/ThemeProvider";
import ScrollToTop from "@/components/ui/ScrollToTop";
import JsonLd from "@/components/seo/JsonLd";
import { getOrganizationSchema, getWebSiteSchema } from "@/lib/seo";
import Script from "next/script";

export const metadata: Metadata = {
  metadataBase: new URL("https://penakkal.com"),
  title: {
    template: "%s | பேனாக்கள்",
    default: "பேனாக்கள் — இஸ்லாமிய தமிழ் வலைப்பூ",
  },
  description: "தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ",
  openGraph: {
    locale: "ta_IN",
    siteName: "பேனாக்கள்",
  },
  twitter: {
    card: "summary_large_image",
    title: "பேனாக்கள்",
    description: "தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ",
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    apple: "/favicon.png",
  },
  manifest: "/manifest.json",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fcf7ed" },
    { media: "(prefers-color-scheme: dark)", color: "#171717" },
  ],
};

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
                let theme = localStorage.getItem('penakkal-storage');
                if (theme) {
                  theme = JSON.parse(theme).state.theme;
                  let fs = JSON.parse(localStorage.getItem('penakkal-storage')).state.fontSize;
                  if (fs) document.documentElement.setAttribute('data-font-size', fs);
                  if (theme === 'system' || !theme) {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                  } else if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                }
              } catch (_) {}
            `,
          }}
        />
        <Script
          id="sw-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js');
                });
              }
            `,
          }}
        />
        <JsonLd data={getOrganizationSchema()} />
        <JsonLd data={getWebSiteSchema()} />
      </head>
      <body
        className={`${notoSerifTamil.variable} ${notoSansTamil.variable} ${notoNaskhArabic.variable} ${amiriQuran.variable} ${playfairDisplay.variable} ${inter.variable} ${barlowCondensed.variable} antialiased`}
        id="main-content"
      >
        <ThemeProvider>
          {children}
          <ScrollToTop />
        </ThemeProvider>
        <Script defer data-domain="penakkal.com" src="https://plausible.io/js/script.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
