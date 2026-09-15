import { Mail } from "lucide-react";
import { CONTACT_EMAIL } from "@/lib/site";

export default function NewsletterSignup() {
  return (
    <section className="my-24 p-8 md:p-12 bg-surface-card rounded-productframes border border-border-default text-center relative overflow-hidden">
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-surface-page rounded-full text-text-link border border-border-default">
            <Mail className="w-8 h-8" />
          </div>
        </div>
        <h3 className="font-display text-3xl md:text-4xl font-bold mb-4 text-heading">
          மின்னஞ்சல் மூலம் செய்திகளைப் பெற
        </h3>
        <p className="font-body text-body text-body-text mb-8">
          வாராந்திர கட்டுரைகளை மின்னஞ்சலில் பெற விரும்பினால், எங்களுக்கு ஒரு மின்னஞ்சல் அனுப்பவும். உங்களை எங்கள் பட்டியலில் இணைத்துக் கொள்வோம்.
        </p>
        
        <div className="flex justify-center">
          <a 
            href={`mailto:${CONTACT_EMAIL}?subject=Newsletter%20Subscription`}
            className="inline-flex items-center gap-2 text-text-link hover:text-heading transition-colors font-bold text-lg border border-border-default hover:border-moss rounded-buttons px-6 py-3 bg-surface-page"
          >
            <Mail className="w-5 h-5" />
            {CONTACT_EMAIL}
          </a>
        </div>
      </div>
    </section>
  );
}
