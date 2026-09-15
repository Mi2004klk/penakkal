"use client";

import { useState } from "react";
import { saveMenuStructure } from "@/server/actions/menus";
import { toast } from "sonner";
import { GripVertical, Plus, Trash2 } from "lucide-react";

export default function MenuBuilder({ initialMenus }: { initialMenus: any[] }) {
  const [activeMenu, setActiveMenu] = useState("header-main");
  const [items, setItems] = useState<any[]>(
    initialMenus.find(m => m.location === "header-main")?.items || []
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const res = await saveMenuStructure(activeMenu, items);
      if (res.success) {
        toast.success("Menu saved successfully");
      }
    } catch (err) {
      toast.error("Failed to save menu");
    } finally {
      setIsSaving(false);
    }
  };

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), label: "New Item", url: "/", sortOrder: items.length }]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border-default pb-4">
        <select 
          value={activeMenu}
          onChange={(e) => {
            setActiveMenu(e.target.value);
            setItems(initialMenus.find(m => m.location === e.target.value)?.items || []);
          }}
          className="px-3 py-2 bg-surface-page border border-border-default rounded-buttons text-sm font-ui"
        >
          <option value="header-main">Main Header Menu</option>
          <option value="footer-links">Footer Links</option>
          <option value="sidebar-nav">Sidebar Navigation</option>
        </select>

        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-moss text-pure-white px-4 py-2 rounded-buttons font-ui font-bold text-sm hover:bg-moss/90 disabled:opacity-50 transition-colors"
        >
          {isSaving ? "Saving..." : "Save Menu"}
        </button>
      </div>

      <div className="space-y-3 max-w-2xl">
        {items.map((item, index) => (
          <div key={item.id || index} className="flex items-center gap-3 bg-surface-page border border-border-default rounded-buttons p-3">
            <GripVertical className="w-5 h-5 text-muted-text cursor-grab" />
            
            <div className="flex-1 grid grid-cols-2 gap-3">
              <div>
                <input 
                  type="text" 
                  value={item.label}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].label = e.target.value;
                    setItems(newItems);
                  }}
                  placeholder="Link Label"
                  className="w-full px-3 py-1.5 bg-surface-card border border-border-default rounded text-sm"
                />
              </div>
              <div>
                <input 
                  type="text" 
                  value={item.url || ''}
                  onChange={(e) => {
                    const newItems = [...items];
                    newItems[index].url = e.target.value;
                    setItems(newItems);
                  }}
                  placeholder="URL / Path"
                  className="w-full px-3 py-1.5 bg-surface-card border border-border-default rounded text-sm font-mono"
                />
              </div>
            </div>
            
            <button 
              onClick={() => {
                setItems(items.filter((_, i) => i !== index));
              }}
              className="p-2 text-muted-text hover:text-semantic-error rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}

        <button 
          onClick={addItem}
          className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-border-default rounded-cards text-muted-text hover:text-moss hover:border-moss transition-colors text-sm font-ui font-bold"
        >
          <Plus className="w-4 h-4" />
          Add Menu Item
        </button>
      </div>
    </div>
  );
}
