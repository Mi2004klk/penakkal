"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createArticle } from "@/server/actions/articles";
import FormField from "@/components/admin/FormField";

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setIsSubmitting(true);
      const res = await createArticle({ title });
      if (res.success) {
        toast.success("Draft created successfully");
        router.push(`/admin/articles/${res.id}`);
      }
    } catch (err) {
      toast.error("Failed to create article");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto mt-12">
      <div>
        <h1 className="text-2xl font-display font-bold text-heading mb-1">Create New Article</h1>
        <p className="text-muted-text font-ui text-body-sm">Start by giving your article a title. A draft will be created automatically.</p>
      </div>

      <div className="bg-surface-card border border-border-default rounded-cards p-6 shadow-card">
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Article Title">
            <input 
              type="text" 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a compelling title..."
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-surface-page border border-border-default rounded-buttons focus:outline-none focus:border-moss transition-colors text-lg" 
            />
          </FormField>

          <div className="pt-2 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-moss text-pure-white font-ui font-bold px-6 py-2.5 rounded-buttons hover:bg-moss/90 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Draft"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
