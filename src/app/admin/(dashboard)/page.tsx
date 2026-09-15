import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading mb-2">Dashboard</h1>
        <p className="text-muted-text font-ui text-body-sm">Welcome to the Penakkal CMS.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
          <h3 className="font-ui font-bold text-heading mb-2">Total Articles</h3>
          <p className="text-3xl font-display font-bold text-moss">0</p>
        </div>
        <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
          <h3 className="font-ui font-bold text-heading mb-2">Media Files</h3>
          <p className="text-3xl font-display font-bold text-moss">0</p>
        </div>
        <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
          <h3 className="font-ui font-bold text-heading mb-2">Active Users</h3>
          <p className="text-3xl font-display font-bold text-moss">0</p>
        </div>
      </div>
    </div>
  );
}
