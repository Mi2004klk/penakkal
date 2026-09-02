"use client";

import { useState, useEffect } from "react";
import GeometricPattern from "./GeometricPattern";

const hadiths = [
  {
    arabic: "إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ",
    tamil: "நிச்சயமாக செயல்கள் அனைத்தும் எண்ணங்களைப் பொறுத்தே அமைகின்றன.",
    source: "ஸஹீஹ் புகாரி (1)"
  },
  {
    arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ",
    tamil: "உங்களில் சிறந்தவர் யார் எனில், குர்ஆனைத் தாமும் கற்றுப் பிறருக்கும் கற்பிப்பவரே.",
    source: "ஸஹீஹ் புகாரி (5027)"
  },
  {
    arabic: "الدِّينُ النَّصِيحَةُ",
    tamil: "மார்க்கம் என்பதே நலம் நாடுவது தான்.",
    source: "ஸஹீஹ் முஸ்லிம் (55)"
  }
];

export default function HadithBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Client-side rotation to avoid hydration mismatches
    setIndex(Math.floor(Math.random() * hadiths.length));
  }, []);

  const current = hadiths[index];

  return (
    <section className="relative my-16 py-16 zone-forest overflow-hidden rounded-[length:var(--radius-productframes)]">
      <GeometricPattern className="opacity-10 absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-forest-stage)_100%)] opacity-60" />
      
      <div className="relative z-10 container mx-auto px-6 text-center max-w-4xl">
        <h3 className="font-[family-name:var(--font-ui)] text-[length:var(--text-caption)] font-bold tracking-[0.2em] mb-6 uppercase text-[color:var(--color-lime-sprout)] opacity-80">
          நபிமொழி (Hadith)
        </h3>
        <p className="text-3xl md:text-5xl font-[family-name:var(--font-quran)] leading-loose mb-8 text-[color:var(--color-cream-paper)] drop-shadow-md">
          {current.arabic}
        </p>
        <p className="font-[family-name:var(--font-display)] text-[length:var(--text-heading-sm)] leading-snug mb-6 text-[color:var(--color-cream-paper)] italic">
          "{current.tamil}"
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-[color:var(--color-lime-sprout)] opacity-50"></span>
          <p className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] text-[color:var(--color-lime-sprout)] opacity-90 uppercase tracking-wider">
            {current.source}
          </p>
          <span className="w-8 h-px bg-[color:var(--color-lime-sprout)] opacity-50"></span>
        </div>
      </div>
    </section>
  );
}
