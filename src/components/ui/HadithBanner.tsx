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
  // Stable day-of-year calculation ensures server and client render the same Hadith
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = new Date().getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  const index = dayOfYear % hadiths.length;

  const current = hadiths[index];

  return (
    <section className="relative my-16 py-16 zone-forest overflow-hidden rounded-productframes">
      <GeometricPattern className="opacity-10 absolute inset-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--color-forest-stage)_100%)] opacity-60" />
      
      <div className="relative z-10 container mx-auto px-4 lg:px-8 text-center max-w-4xl">
        <p className="section-eyebrow mb-6 text-lime-sprout opacity-80">
          நபிமொழி
        </p>
        <p dir="rtl" lang="ar" className="text-3xl md:text-5xl arabic-text leading-loose mb-8 text-cream-paper drop-shadow-dropdown">
          {current.arabic}
        </p>
        <p className="font-display text-heading-sm leading-snug mb-6 text-cream-paper italic">
          "{current.tamil}"
        </p>
        <div className="flex items-center justify-center gap-2">
          <span className="w-8 h-px bg-lime-sprout opacity-50"></span>
          <p className="font-ui text-body-sm text-lime-sprout opacity-90">
            {current.source}
          </p>
          <span className="w-8 h-px bg-lime-sprout opacity-50"></span>
        </div>
      </div>
    </section>
  );
}
