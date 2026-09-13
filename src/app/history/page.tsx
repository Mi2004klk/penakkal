import PageShell from "@/components/layout/PageShell";
import HistoryContent from "@/components/history/HistoryContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "வாசிப்பு வரலாறு",
  description: "நீங்கள் சமீபத்தில் படித்த கட்டுரைகள்",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HistoryPage() {
  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <HistoryContent />
      </div>
    </PageShell>
  );
}
