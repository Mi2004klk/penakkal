import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Upload, FolderPlus } from "lucide-react";
import DataTable from "@/components/admin/DataTable";

export default async function MediaPage() {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  const media = await prisma.media.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading mb-1">Media Library</h1>
          <p className="text-muted-text font-ui text-body-sm">Manage images and uploads.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-surface-card border border-border-default px-4 py-2 rounded-buttons font-ui font-bold text-body-sm hover:border-moss transition-colors">
            <FolderPlus className="w-4 h-4" />
            New Folder
          </button>
          <button className="flex items-center gap-2 bg-moss text-pure-white px-4 py-2 rounded-buttons font-ui font-bold text-body-sm hover:bg-moss/90 transition-colors">
            <Upload className="w-4 h-4" />
            Upload
          </button>
        </div>
      </div>

      <DataTable 
        data={media}
        keyField="id"
        columns={[
          { 
            header: "Preview", 
            accessor: (row) => (
              <div className="w-12 h-12 bg-surface-page rounded flex items-center justify-center border border-border-default overflow-hidden">
                <img src={row.storageKey.startsWith("legacy") ? `/media/covers/${row.filename}` : "placeholder.jpg"} alt={row.altText || ""} className="object-cover w-full h-full" />
              </div>
            )
          },
          { header: "File", accessor: "originalName" },
          { header: "Size", accessor: (row) => `${Math.round(row.size / 1024)} KB` },
          { header: "Type", accessor: "mimeType" },
          { header: "Date", accessor: (row) => new Date(row.createdAt).toLocaleDateString() },
          { 
            header: "Actions", 
            accessor: (row) => (
              <Link href={`/admin/media/${row.id}`} className="text-text-link hover:text-moss font-bold text-xs">
                Edit
              </Link>
            ),
            className: "text-right"
          },
        ]}
      />
    </div>
  );
}
