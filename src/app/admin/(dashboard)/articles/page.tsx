import { prisma } from "@/lib/content/prisma";
import DataTable from "@/components/admin/DataTable";
import Link from "next/link";
import { PenTool, Edit } from "lucide-react";

export default async function ArticlesPage() {
  const articles = await prisma.article.findMany({
    orderBy: { createdAt: 'desc' },
    include: { author: true }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading mb-1">Articles</h1>
          <p className="text-muted-text font-ui text-body-sm">Manage blog posts and articles.</p>
        </div>
        <Link 
          href="/admin/articles/new"
          className="flex items-center gap-2 bg-moss text-pure-white px-4 py-2 rounded-buttons font-ui font-bold text-body-sm hover:bg-moss/90 transition-colors"
        >
          <PenTool className="w-4 h-4" />
          New Article
        </Link>
      </div>

      <DataTable 
        data={articles}
        keyField="id"
        columns={[
          { 
            header: "Title", 
            accessor: (row) => (
              <div>
                <div className="font-bold text-heading">{row.title}</div>
                <div className="text-xs text-muted-text mt-1 font-mono">{row.slug}</div>
              </div>
            )
          },
          { 
            header: "Author", 
            accessor: (row) => row.author?.nameTamil || row.author?.nameEnglish || "Unknown"
          },
          { 
            header: "Status", 
            accessor: (row) => {
              const colors: Record<string, string> = {
                'PUBLISHED': 'bg-lime-sprout/20 text-moss',
                'DRAFT': 'bg-surface-card border border-border-default text-muted-text',
                'REVIEW': 'bg-yellow-100 text-yellow-800'
              };
              return (
                <span className={`px-2 py-1 rounded-buttons text-xs font-bold uppercase tracking-wider ${colors[row.status] || colors.DRAFT}`}>
                  {row.status}
                </span>
              );
            }
          },
          { 
            header: "Date", 
            accessor: (row) => new Date(row.createdAt).toLocaleDateString() 
          },
          { 
            header: "Actions", 
            accessor: (row) => (
              <Link href={`/admin/articles/${row.id}`} className="text-text-link hover:text-moss p-2 inline-block">
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
