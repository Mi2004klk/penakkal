import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="zone-cream border-t border-[color:var(--color-border-default)] mt-24">
      <div className="container mx-auto px-4 lg:px-8 pt-[var(--section-gap)] pb-12 max-w-[var(--page-max-width)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--section-gap)]">
          
          {/* Logo & About */}
          <div className="md:col-span-12 lg:col-span-6">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/logo.png"
                alt="பேனாக்கள் லோகோ"
                width={150}
                height={40}
                className="h-10 w-auto object-contain dark:brightness-0 dark:invert"
              />
            </Link>
            <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] leading-relaxed text-[color:var(--color-body-text)] mb-8 max-w-sm">
              தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ. குர்ஆன், ஹதீஸ், மற்றும் இஸ்லாமிய வரலாற்றை தேடிக் கற்கும் தளம்.
            </p>
            <div dir="rtl" className="font-[family-name:var(--font-arabic)] text-2xl font-bold text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] opacity-80 text-right">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-6 lg:col-span-3">
            <h3 className="font-[family-name:var(--font-ui)] font-bold text-[14px] uppercase tracking-[0.02em] text-[color:var(--color-heading)] mb-4">வகைகள்</h3>
            <ul className="flex flex-col gap-4 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-normal">
              <li><Link href="/category/quran-tafsir" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">குர்ஆன் தப்சீர்</Link></li>
              <li><Link href="/category/hadith" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">ஹதீஸ்</Link></li>
              <li><Link href="/category/fiqh" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">பிக்ஹ்</Link></li>
              <li><Link href="/category/history" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">இஸ்லாமிய வரலாறு</Link></li>
              <li><Link href="/category/spirituality" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">ஆன்மீகம்</Link></li>
              <li><Link href="/category/family" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">குடும்பம்</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-6 lg:col-span-3">
            <h3 className="font-[family-name:var(--font-ui)] font-bold text-[14px] uppercase tracking-[0.02em] text-[color:var(--color-heading)] mb-4">இணைப்புகள்</h3>
            <ul className="flex flex-col gap-4 font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-normal">
              <li><Link href="/about" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">எங்களை பற்றி</Link></li>
              <li><Link href="/contact" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">தொடர்பு கொள்ள</Link></li>
              <li><Link href="/privacy" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm">தனியுரிமை</Link></li>
              <li>
                <a href="/feed.xml" className="text-[color:var(--color-body-text)] hover:text-[color:var(--color-heading)] dark:hover:text-[color:var(--color-lime-sprout)] transition-colors mt-4 flex items-center gap-2 focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-sm w-fit">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M4 11a9 9 0 0 1 9 9H9c0-2.76-2.24-5-5-5v-4zm0-7a16 16 0 0 1 16 16h-4a12 12 0 0 0-12-12V4zm2 14a2 2 0 1 1-4 0 2 2 0 0 1 4 0z"/></svg>
                  RSS Feed
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[color:var(--color-border-default)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-muted-text)] tracking-wider uppercase">
            © {currentYear} பேனாக்கள் (Penakkal). All rights reserved.
          </p>
          <p dir="rtl" className="font-[family-name:var(--font-arabic)] text-body text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)] opacity-80 text-right">
            جَزَاكَ اللَّٰهُ خَيرًا
          </p>
        </div>
      </div>
    </footer>
  );
}
