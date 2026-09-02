import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import MobileNav from "@/components/layout/MobileNav";
import GeometricPattern from "@/components/ui/GeometricPattern";
import BismillahBlock from "@/components/ui/BismillahBlock";

export const metadata = {
  title: "எங்களை பற்றி",
  description: "பேனாக்கள் (Penakkal) - இஸ்லாமிய அறிவு தளம்",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col pt-16 bg-[color:var(--color-surface-pure-white-card)] dark:bg-[color:var(--color-midnight-ink)]">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-16 md:py-24 max-w-4xl">
        <div className="bg-[color:var(--color-surface-cream-paper)] dark:bg-[color:var(--color-slate)]/20 rounded-[length:var(--radius-cards)] p-8 md:p-16 shadow-[var(--shadow-card)] border border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)] relative overflow-hidden">
          <GeometricPattern className="opacity-10 dark:opacity-5" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <BismillahBlock />
            
            <h1 className="editorial-headline text-center mt-12 mb-12 inline-block w-full wavy-underline">
              எங்களை பற்றி
            </h1>
            
            <div className="prose dark:prose-invert max-w-none prose-lg font-[family-name:var(--font-body)] text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] leading-relaxed">
              <p>
                அல்ஹம்துலில்லாஹ். "பேனாக்கள்" (Penakkal) தளம் தமிழ் பேசும் முஸ்லிம்களுக்கு இஸ்லாமிய அறிவை இலகுவாகவும், நவீன முறையிலும் கொண்டு சேர்க்கும் ஒரு முயற்சியாகும்.
              </p>
              
              <p>
                குர்ஆன் தப்சீர், நபிமொழிகள் (ஹதீஸ்), இஸ்லாமிய வரலாறு, பிக்ஹ் சட்டங்கள், மற்றும் அன்றாட வாழ்க்கைக்கு தேவையான இஸ்லாமிய வழிகாட்டல்களை தமிழ் மொழியில் வழங்குவதே எங்களது நோக்கம்.
              </p>

              <h2 className="font-[family-name:var(--font-display)] text-[color:var(--color-true-black)] dark:text-[color:var(--color-cream-paper)] mt-12">எங்களது கொள்கைகள்</h2>
              <ul className="space-y-3 font-[family-name:var(--font-ui)]">
                <li>அல்குர்ஆன் மற்றும் ஆதாரப்பூர்வமான ஹதீஸ்களின் அடிப்படையில் தகவல்களை வழங்குதல்.</li>
                <li>பிரிவினைவாதங்களை தவிர்த்து, சமூக ஒற்றுமையை வலியுறுத்துதல்.</li>
                <li>எளிமையான, யாவருக்கும் புரியும் நடையில் எழுதுதல்.</li>
              </ul>

              <div className="mt-16 text-center border-t border-[color:var(--color-ash)] dark:border-[color:var(--color-slate)] pt-12">
                <p className="text-3xl font-[family-name:var(--font-arabic)] text-[color:var(--color-moss)] dark:text-[color:var(--color-lime-sprout)]">
                  رَبِّ زِدْنِي عِلْمًا
                </p>
                <p className="font-[family-name:var(--font-ui)] text-[length:var(--text-body-sm)] font-bold text-[color:var(--color-stone)] dark:text-[color:var(--color-ash)] mt-4">
                  "இறைவா! எனது அறிவை அதிகப்படுத்துவாயாக!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
