"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateArticle } from "@/server/actions/articles";
import Editor from "@/components/admin/editor/Editor";
import FormField from "@/components/admin/FormField";
import { Save, Globe, ArrowLeft, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

// In a real app we'd fetch this initial data in a Server Component and pass it down, 
// or use SWR/React Query. For simplicity in this generated code, we assume it's passed or fetched.
// We will mock the fetching for the UI shell.

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "Loading...",
    slug: "",
    excerpt: "",
    contentHtml: "",
    status: "DRAFT",
    authorId: "",
  });

  // Mock fetch - this should be a Server Action or API call in production
  useEffect(() => {
    // We would fetch the article by params.id here
    setFormData({
      title: "Sample Article",
      slug: "sample-article",
      excerpt: "A short description...",
      contentHtml: "<p>Start writing...</p>",
      status: "DRAFT",
      authorId: "123",
    });
  }, [params.id]);

  const handleSave = async (status: string) => {
    try {
      setIsSubmitting(true);
      const res = await updateArticle(params.id, { ...formData, status });
      if (res.success) {
        toast.success(`Article ${status === 'PUBLISHED' ? 'published' : 'saved'}`);
        router.refresh();
      }
    } catch (err) {
      toast.error("Failed to save article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border-default pb-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/articles" className="p-2 text-muted-text hover:bg-surface-card rounded-buttons">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-display font-bold text-heading">Edit Article</h1>
            <p className="text-muted-text font-ui text-xs">ID: {params.id}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSave('DRAFT')}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-surface-card border border-border-default px-4 py-2 rounded-buttons font-ui font-bold text-body-sm hover:border-moss transition-colors"
          >
            <Save className="w-4 h-4" />
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('PUBLISHED')}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-moss text-pure-white px-4 py-2 rounded-buttons font-ui font-bold text-body-sm hover:bg-moss/90 transition-colors"
          >
            <Globe className="w-4 h-4" />
            Publish
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-surface-page">
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Article Title"
              className="w-full text-3xl font-display font-bold text-heading bg-transparent border-none focus:outline-none focus:ring-0 p-0 placeholder-muted-text/50"
            />
          </div>
          
          <Editor 
            content={formData.contentHtml} 
            onChange={(html) => setFormData(prev => ({ ...prev, contentHtml: html }))} 
          />
        </div>
        
        <div className="space-y-6">
          <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
            <h3 className="font-ui font-bold text-heading mb-4 border-b border-border-default pb-2">Publishing Info</h3>
            <div className="space-y-4">
              <FormField label="URL Slug">
                <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors text-sm font-mono" 
                />
              </FormField>
              
              <FormField label="Status">
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-3 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors text-sm"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="REVIEW">Needs Review</option>
                  <option value="PUBLISHED">Published</option>
                </select>
              </FormField>
            </div>
          </div>
          
          <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
            <h3 className="font-ui font-bold text-heading mb-4 border-b border-border-default pb-2">Metadata</h3>
            <div className="space-y-4">
              <FormField label="Excerpt">
                <textarea 
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors text-sm resize-none" 
                />
              </FormField>
              
              <div>
                <label className="block font-ui text-body-sm font-bold text-heading mb-1.5">Featured Image</label>
                <div className="aspect-video w-full bg-surface-page border border-border-default border-dashed rounded-cards flex flex-col items-center justify-center text-muted-text cursor-pointer hover:bg-surface-card transition-colors">
                  <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                  <span className="text-xs font-ui font-bold">Select Image</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
