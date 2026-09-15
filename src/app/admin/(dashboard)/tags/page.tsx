import { prisma } from "@/lib/content/prisma";
import DataTable from "@/components/admin/DataTable";

export default async function TagsPage() {
  const tags = await prisma.tag.findMany({
    orderBy: { createdAt: 'desc' },
    include: { _count: { select: { articles: true } } }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading mb-1">Tags</h1>
          <p className="text-muted-text font-ui text-body-sm">Manage article tags.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
            <h2 className="font-ui font-bold text-heading mb-4">Add Tag</h2>
            <form className="space-y-4">
              <div>
                <label className="block font-ui text-body-sm font-bold text-heading mb-1.5">Name</label>
                <input type="text" className="w-full px-3 py-2 bg-surface-page border border-border-default rounded-buttons text-sm" />
              </div>
              <div>
                <label className="block font-ui text-body-sm font-bold text-heading mb-1.5">Slug</label>
                <input type="text" className="w-full px-3 py-2 bg-surface-page border border-border-default rounded-buttons text-sm" />
              </div>
              <button type="submit" className="w-full bg-moss text-pure-white font-ui font-bold px-4 py-2 rounded-buttons">
                Add Tag
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <DataTable 
            data={tags}
            keyField="id"
            columns={[
              { header: "Name", accessor: "name" },
              { header: "Slug", accessor: "slug" },
              { header: "Articles", accessor: (row) => row._count.articles },
              { header: "Created", accessor: (row) => new Date(row.createdAt).toLocaleDateString() },
              { 
                header: "Actions", 
                accessor: () => <button className="text-xs text-text-link hover:text-moss">Edit</button>,
                className: "text-right" 
              }
            ]}
          />
        </div>
      </div>
    </div>
  );
}
