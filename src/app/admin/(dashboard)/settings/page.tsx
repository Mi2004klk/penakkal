import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  try {
    requireRole(session.user?.role as string, ["OWNER", "ADMIN"]);
  } catch {
    redirect('/admin');
  }

  const settings = await prisma.setting.findMany();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading mb-1">Settings</h1>
        <p className="text-muted-text font-ui text-body-sm">Manage global site configuration.</p>
      </div>

      <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
        <p className="text-muted-text">Settings UI will be implemented here.</p>
        <pre className="mt-4 text-xs bg-surface-page p-4 rounded-buttons overflow-x-auto">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  );
}
