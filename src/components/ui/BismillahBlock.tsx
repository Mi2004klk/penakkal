export default function BismillahBlock({ tone = "coral" }: { tone?: "coral" | "lime" }) {
  return (
    <div className="flex flex-col items-center justify-center my-8 text-center animate-fade-in-up">
      <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border-default to-transparent mb-4"></div>
      <span dir="rtl" lang="ar" className={`arabic-text text-display ${tone === "lime" ? "text-lime-sprout" : "text-ember-coral"}`}>
        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
      </span>
      <div className="w-full max-w-xs h-px bg-gradient-to-r from-transparent via-border-default to-transparent mt-4"></div>
    </div>
  );
}
