import { prisma } from "@/lib/content/prisma";
import CategoryTree from "@/components/admin/taxonomy/CategoryTree";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: 'asc' }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading mb-1">Categories</h1>
          <p className="text-muted-text font-ui text-body-sm">Organize your content into hierarchical topics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
            <h2 className="font-ui font-bold text-heading mb-4">Add Category</h2>
            {/* Form to add category (mocked for scaffolding) */}
            <form className="space-y-4">
              <div>
                <label className="block font-ui text-body-sm font-bold text-heading mb-1.5">Name (Tamil)</label>
                <input type="text" className="w-full px-3 py-2 bg-surface-page border border-border-default rounded-buttons text-sm" />
              </div>
              <div>
                <label className="block font-ui text-body-sm font-bold text-heading mb-1.5">Slug</label>
                <input type="text" className="w-full px-3 py-2 bg-surface-page border border-border-default rounded-buttons text-sm" />
              </div>
              <button type="submit" className="w-full bg-moss text-pure-white font-ui font-bold px-4 py-2 rounded-buttons">
                Add Category
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
            <h2 className="font-ui font-bold text-heading mb-4">Category Tree</h2>
            <p className="text-sm text-muted-text mb-4">Drag and drop to reorder categories or create hierarchies.</p>
            <CategoryTree initialData={categories} />
          </div>
        </div>
      </div>
    </div>
  );
}
