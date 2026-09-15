import { prisma } from "@/lib/content/prisma";
import MenuBuilder from "@/components/admin/navigation/MenuBuilder";

export default async function MenusPage() {
  const menus = await prisma.menu.findMany({
    include: {
      items: {
        orderBy: { sortOrder: 'asc' }
      }
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-heading mb-1">Menus</h1>
          <p className="text-muted-text font-ui text-body-sm">Manage site navigation menus.</p>
        </div>
      </div>

      <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
        <MenuBuilder initialMenus={menus} />
      </div>
    </div>
  );
}
