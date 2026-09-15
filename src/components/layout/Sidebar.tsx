import Link from "next/link";
import { Moon } from "lucide-react";
import HijriDate from "../ui/HijriDate";
import SidebarSearchButton from "./SidebarSearchButton";

import { getNavCategories } from "@/lib/articles";

export default async function Sidebar() {
  const navCategories = await getNavCategories();
  
  return (
    <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-8 sticky top-[calc(var(--header-height)+1rem)] h-fit">
      {/* Search Widget */}
      <div className="bg-surface-pure-white-card rounded-cards p-5 border border-border-default">
        <h2 className="font-display font-bold text-subheading mb-4 text-heading">தேடுங்கள்</h2>
        <SidebarSearchButton />
      </div>

      {/* Hijri Date Widget */}
      <div className="bg-gradient-to-br from-surface-pure-white-card to-surface-alt rounded-cards p-5 border border-moss/30 text-center">
        <div className="text-ember-coral mb-2">
          <Moon className="w-8 h-8 mx-auto" aria-hidden="true" focusable="false" />
        </div>
        <HijriDate className="font-display font-bold text-text-link text-subheading" />
      </div>

      {/* Important Categories */}
      <div className="bg-surface-pure-white-card rounded-cards p-5 border border-border-default">
        <h3 className="font-display font-bold text-subheading mb-4 flex items-center gap-2 text-heading">
          <div className="w-1 h-5 bg-moss rounded-full"></div>
          முக்கிய வகைகள்
        </h3>
        <ul className="flex flex-col gap-3">
          {navCategories.map((cat) => (
            <li key={cat.id}>
              <Link 
                href={`/category/${cat.id}`}
                className="flex items-center justify-between group rounded-buttons"
              >
                <span className="font-ui text-body-text group-hover:text-text-link transition-colors text-body-sm font-medium">
                  {cat.name}
                </span>
                <span className="text-muted-text group-hover:text-text-link transition-colors">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/category" className="block mt-5 text-body-sm text-center text-text-link font-bold font-ui bg-surface-page py-2 rounded-buttons hover:bg-border-subtle transition-colors border border-transparent hover:border-moss">
          அனைத்து வகைகளையும் காண்க →
        </Link>
      </div>
    </aside>
  );
}
