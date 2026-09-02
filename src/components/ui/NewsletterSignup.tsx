import { Send } from "lucide-react";

export default function NewsletterSignup() {
  return (
    <section className="my-24 p-8 md:p-12 bg-[color:var(--color-surface-card)] rounded-[length:var(--radius-productframes)] border border-[color:var(--color-border-default)] text-center relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <h3 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-bold mb-4 text-[color:var(--color-heading)]">
          புதிய கட்டுரைகளை மின்னஞ்சலில் பெற
        </h3>
        <p className="font-[family-name:var(--font-body)] text-[length:var(--text-body)] text-[color:var(--color-body-text)] mb-8">
          வாராந்திர இஸ்லாமிய கட்டுரைகள், குர்ஆன் விளக்கங்கள் மற்றும் பயனுள்ள தகவல்களை தவறாமல் பெற்றிட இணையுங்கள்.
        </p>
        
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" action="https://formspree.io/f/placeholder" method="POST">
          <input 
            type="email" 
            name="email"
            placeholder="உங்கள் மின்னஞ்சல் முகவரி" 
            className="flex-grow px-4 py-3 rounded-[length:var(--radius-buttons)] border border-[color:var(--color-border-default)] bg-[color:var(--color-surface-page)] text-[color:var(--color-heading)] focus:outline-none focus:ring-2 focus:ring-[color:var(--color-moss)] transition-all font-[family-name:var(--font-ui)]"
            required
            aria-label="மின்னஞ்சல் முகவரி"
          />
          <button 
            type="submit" 
            className="btn-lime flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Send className="w-4 h-4" /> இணையுங்கள்
          </button>
        </form>
        <p className="font-[family-name:var(--font-ui)] text-[length:var(--text-caption)] text-[color:var(--color-muted-text)] mt-6 uppercase tracking-wider">
          * உங்கள் தகவல்கள் பாதுகாப்பாக வைக்கப்படும். எந்த நேரத்திலும் விலகிக் கொள்ளலாம்.
        </p>
      </div>
    </section>
  );
}
