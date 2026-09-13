import Link from "next/link";
import { getNavCategories } from "@/lib/articles";
import RssIcon from "../icons/RssIcon";
import BrandMark from "../ui/BrandMark";

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const navCategories = await getNavCategories();

  return (
    <footer className="zone-cream border-t border-border-default">
      <div className="container mx-auto px-4 lg:px-8 pt-[var(--section-gap)] pb-12 max-w-[var(--page-max-width)]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-[var(--section-gap)]">
          
          {/* Logo & About */}
          <div className="md:col-span-12 lg:col-span-6">
            <BrandMark variant="footer" />
            <p className="font-body text-body leading-relaxed text-body-text mb-8 max-w-sm">
              தமிழ் முஸ்லிம்களுக்கான இஸ்லாமிய அறிவு வலைப்பூ. குர்ஆன், ஹதீஸ், மற்றும் இஸ்லாமிய வரலாற்றை தேடிக் கற்கும் தளம்.
            </p>
            <div dir="rtl" lang="ar" className="arabic-text text-2xl font-bold text-text-link opacity-80 text-right">
              بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
            </div>
          </div>

          {/* Categories */}
          <div className="md:col-span-6 lg:col-span-3">
            <h2 className="section-eyebrow mb-4">வகைகள்</h2>
            <ul className="flex flex-col gap-4 font-ui text-body-sm font-normal">
              {navCategories.map(category => (
                <li key={category.id}>
                  <Link href={`/category/${category.id}`} className="text-body-text hover:text-heading transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-buttons">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-6 lg:col-span-3">
            <h2 className="section-eyebrow mb-4">இணைப்புகள்</h2>
            <ul className="flex flex-col gap-4 font-ui text-body-sm font-normal">
              <li><Link href="/about" className="text-body-text hover:text-heading transition-colors focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-buttons">எங்களை பற்றி</Link></li>
              <li>
                <a href="/feed.xml" className="text-body-text hover:text-heading transition-colors mt-4 flex items-center gap-2 focus-visible:outline-none focus-visible:underline focus-visible:underline-offset-4 rounded-buttons w-fit">
                  <RssIcon className="w-4 h-4" />
                  <span lang="en" className="sr-only">RSS</span> ஊட்டம்
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border-default flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-ui text-body-sm text-muted-text">
            &copy; {currentYear} பேனாக்கள் (<span lang="en">Penakkal</span>). பிறப்புரிமை பாதுகாக்கப்பட்டது.
          </p>
          <p dir="rtl" lang="ar" className="arabic-text text-body text-text-link opacity-80 text-right">
            جَزَاكَ اللَّٰهُ خَيرًا
          </p>
        </div>
      </div>
    </footer>
  );
}
