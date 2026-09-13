import PageShell from "@/components/layout/PageShell";
import GeometricPattern from "@/components/ui/GeometricPattern";
import BismillahBlock from "@/components/ui/BismillahBlock";

export const metadata = {
  title: "எங்களை பற்றி",
  description: "பேனாக்கள் (Penakkal) - இஸ்லாமிய அறிவு தளம்",
};

export default function AboutPage() {
  return (
    <PageShell className="bg-surface-pure-white-card" hasHero={true}>
      <div className="max-w-4xl mx-auto px-4 md:px-0 py-12 md:py-20">
        <div className="bg-surface-cream-paper rounded-cards p-8 md:p-16 shadow-card border border-border-default relative overflow-hidden">
          <GeometricPattern className="opacity-10" />
          
          <div className="relative z-10 max-w-2xl mx-auto">
            <BismillahBlock />
            
            <h1 className="editorial-headline text-center mt-12 mb-12 w-fit mx-auto wavy-underline">
              எங்களை பற்றி
            </h1>

            <div className="prose max-w-none prose-lg font-body text-body-text leading-relaxed">
              <p>
                அல்ஹம்துலில்லாஹ். "பேனாக்கள்" (Penakkal) தளம் தமிழ் பேசும் முஸ்லிம்களுக்கு இஸ்லாமிய அறிவை இலகுவாகவும், நவீன முறையிலும் கொண்டு சேர்க்கும் ஒரு முயற்சியாகும்.
              </p>
              
              <p>
                குர்ஆன் தப்சீர், நபிமொழிகள் (ஹதீஸ்), இஸ்லாமிய வரலாறு, பிக்ஹ் சட்டங்கள், மற்றும் அன்றாட வாழ்க்கைக்கு தேவையான இஸ்லாமிய வழிகாட்டல்களை தமிழ் மொழியில் வழங்குவதே எங்களது நோக்கம்.
              </p>

              <h2 className="font-display text-heading mt-12">எங்களது கொள்கைகள்</h2>
              <ul className="space-y-3 font-ui">
                <li>அல்குர்ஆன் மற்றும் ஆதாரப்பூர்வமான ஹதீஸ்களின் அடிப்படையில் தகவல்களை வழங்குதல்.</li>
                <li>பிரிவினைவாதங்களை தவிர்த்து, சமூக ஒற்றுமையை வலியுறுத்துதல்.</li>
                <li>எளிமையான, யாவருக்கும் புரியும் நடையில் எழுதுதல்.</li>
              </ul>

              <div className="mt-16 text-center border-t border-border-default pt-12">
                <p className="text-3xl font-arabic text-text-link">
                  رَبِّ زِدْنِي عِلْمًا
                </p>
                <p className="font-ui text-body-sm font-bold text-muted-text mt-4">
                  "இறைவா! எனது அறிவை அதிகப்படுத்துவாயாக!"
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
