import { prisma } from "@/lib/content/prisma";
import DataTable from "@/components/admin/DataTable";
import { auth, requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuditLogPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  try {
    requireRole(session.user?.role as string, ["OWNER", "ADMIN"]);
  } catch {
    redirect('/admin');
  }

  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: 'desc' },
    take: 100,
    include: { user: true }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading mb-1">Audit Log</h1>
        <p className="text-muted-text font-ui text-body-sm">Recent system events and actions.</p>
      </div>

      <DataTable 
        data={logs}
        keyField="id"
        columns={[
          { 
            header: "Time", 
            accessor: (row) => new Date(row.createdAt).toLocaleString()
          },
          { 
            header: "User", 
            accessor: (row) => row.user ? `${row.user.name} (${row.user.email})` : 'System' 
          },
          { 
            header: "Action", 
            accessor: (row) => (
              <span className="font-bold text-heading">{row.action}</span>
            )
          },
          { header: "Entity", accessor: "entityType" },
          { 
            header: "Details", 
            accessor: (row) => (
              <pre className="text-xs text-muted-text bg-surface-page p-2 rounded overflow-x-auto max-w-xs">
                {row.diff ? JSON.stringify(row.diff) : '-'}
              </pre>
            )
          },
        ]}
      />
    </div>
  );
}
