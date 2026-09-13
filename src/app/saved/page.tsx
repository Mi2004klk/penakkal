import PageShell from "@/components/layout/PageShell";
import SavedContent from "@/components/saved/SavedContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "புக்மார்க்குகள்",
  description: "நீங்கள் சேமித்த கட்டுரைகள்",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SavedPage() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <SavedContent />
      </div>
    </PageShell>
  );
}
