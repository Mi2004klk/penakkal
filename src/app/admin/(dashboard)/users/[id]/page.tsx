import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import FormField from "@/components/admin/FormField";

export default async function UserEditPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  try {
    requireRole(session.user?.role as string, ["OWNER"]);
  } catch {
    redirect('/admin');
  }

  const user = await prisma.user.findUnique({ where: { id: params.id } });
  
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading mb-1">Edit User</h1>
        <p className="text-muted-text font-ui text-body-sm">Update {user.name}'s details.</p>
      </div>

      <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card max-w-2xl">
        <form className="space-y-4">
          <FormField label="Name">
            <input 
              type="text" 
              defaultValue={user.name} 
              className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors" 
            />
          </FormField>
          
          <FormField label="Email">
            <input 
              type="email" 
              defaultValue={user.email} 
              className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors" 
            />
          </FormField>
          
          <FormField label="Role">
            <select 
              defaultValue={user.role} 
              className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors"
            >
              <option value="OWNER">Owner</option>
              <option value="ADMIN">Admin</option>
              <option value="EDITOR">Editor</option>
              <option value="AUTHOR">Author</option>
              <option value="VIEWER">Viewer</option>
            </select>
          </FormField>

          <div className="pt-4 border-t border-border-default">
            <button 
              type="submit" 
              className="bg-moss text-pure-white font-ui font-bold px-6 py-2 rounded-buttons hover:bg-moss/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
