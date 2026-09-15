import { prisma } from "@/lib/content/prisma";
import DataTable from "@/components/admin/DataTable";
import Link from "next/link";
import { UserPlus, Edit } from "lucide-react";
import { auth, requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  // Only OWNER can access this page
  try {
    requireRole(session.user?.role as string, ["OWNER"]);
  } catch {
    redirect('/admin');
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading mb-1">Users</h1>
          <p className="text-muted-text font-ui text-body-sm">Manage admin accounts and roles.</p>
        </div>
        <Link 
          href="/admin/users/new"
          className="flex items-center gap-2 bg-moss text-pure-white px-4 py-2 rounded-buttons font-ui font-bold text-body-sm hover:bg-moss/90 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Add User
        </Link>
      </div>

      <DataTable 
        data={users}
        keyField="id"
        columns={[
          { header: "Name", accessor: "name" },
          { header: "Email", accessor: "email" },
          { 
            header: "Role", 
            accessor: (row) => (
              <span className="bg-surface-page border border-border-default px-2 py-1 rounded-buttons text-xs font-bold uppercase tracking-wider">
                {row.role}
              </span>
            )
          },
          { 
            header: "Status", 
            accessor: (row) => (
              <span className={`px-2 py-1 rounded-buttons text-xs font-bold uppercase tracking-wider ${row.isActive ? 'bg-lime-sprout/20 text-moss' : 'bg-semantic-error/10 text-semantic-error'}`}>
                {row.isActive ? 'Active' : 'Inactive'}
              </span>
            )
          },
          { 
            header: "Last Login", 
            accessor: (row) => row.lastLoginAt ? new Date(row.lastLoginAt).toLocaleDateString() : 'Never' 
          },
          { 
            header: "Actions", 
            accessor: (row) => (
              <Link href={`/admin/users/${row.id}`} className="text-text-link hover:text-moss p-2 inline-block">
                <Edit className="w-4 h-4" />
              </Link>
            ),
            className: "text-right"
          },
        ]}
      />
    </div>
  );
}
