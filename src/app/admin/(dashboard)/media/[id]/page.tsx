import { prisma } from "@/lib/content/prisma";
import { auth, requireRole } from "@/lib/auth";
import { redirect } from "next/navigation";
import FormField from "@/components/admin/FormField";
import { mediaUrl } from "@/lib/media/url";

export default async function MediaEditPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session) redirect('/admin/login');
  
  const media = await prisma.media.findUnique({ where: { id: params.id } });
  
  if (!media) {
    return <div>Media not found</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading mb-1">Edit Media</h1>
        <p className="text-muted-text font-ui text-body-sm">{media.originalName}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
          <form className="space-y-4">
            <FormField label="Title">
              <input 
                type="text" 
                defaultValue={media.title || ""} 
                className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors" 
              />
            </FormField>
            
            <FormField label="Alt Text" description="Required for accessibility. Describe the image for screen readers.">
              <input 
                type="text" 
                required
                defaultValue={media.altText || ""} 
                className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors" 
              />
            </FormField>
            
            <FormField label="Caption">
              <textarea 
                defaultValue={media.caption || ""} 
                rows={3}
                className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors resize-none" 
              />
            </FormField>

            <FormField label="Credit">
              <input 
                type="text" 
                defaultValue={media.credit || ""} 
                className="w-full px-4 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors" 
              />
            </FormField>

            <div className="pt-4 border-t border-border-default flex gap-3">
              <button 
                type="submit" 
                className="bg-moss text-pure-white font-ui font-bold px-6 py-2 rounded-buttons hover:bg-moss/90 transition-colors"
              >
                Save Metadata
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-card border border-border-default rounded-cards p-2 shadow-card">
            <div className="aspect-video w-full bg-surface-page rounded border border-border-default overflow-hidden relative group">
              <img 
                src={mediaUrl(media)} 
                alt={media.altText || media.originalName} 
                className="object-contain w-full h-full"
              />
            </div>
          </div>
          
          <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
            <h3 className="font-ui font-bold text-heading mb-4 border-b border-border-default pb-2">File Info</h3>
            <div className="space-y-2 text-body-sm font-ui">
              <div className="flex justify-between">
                <span className="text-muted-text">Type</span>
                <span className="font-bold text-heading">{media.mimeType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Dimensions</span>
                <span className="font-bold text-heading">{media.width} × {media.height}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Size</span>
                <span className="font-bold text-heading">{Math.round(media.size / 1024)} KB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Uploaded</span>
                <span className="font-bold text-heading">{new Date(media.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
