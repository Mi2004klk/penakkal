import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    template: "%s | Admin — பேனாக்கள்",
    default: "Admin — பேனாக்கள்",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-page text-body-text antialiased font-body">
      {children}
    </div>
  );
}
