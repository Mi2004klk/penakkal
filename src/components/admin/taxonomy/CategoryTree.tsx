"use client";

import { useState } from "react";
// In a full implementation, we'd use @dnd-kit/sortable here
// For the Phase 5 scaffold, we display a list that represents the tree

interface Category {
  id: string;
  nameTamil: string;
  slug: string;
  parentId: string | null;
  sortOrder: number;
}

export default function CategoryTree({ initialData }: { initialData: Category[] }) {
  const [items, setItems] = useState(initialData);

  // Group by parent
  const tree = items.filter(i => !i.parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  
  const getChildren = (parentId: string) => {
    return items.filter(i => i.parentId === parentId).sort((a, b) => a.sortOrder - b.sortOrder);
  };

  const renderItem = (item: Category, depth = 0) => {
    const children = getChildren(item.id);
    return (
      <div key={item.id} className="w-full">
        <div 
          className="flex items-center justify-between p-3 border border-border-default rounded-buttons bg-surface-page mb-2"
          style={{ marginLeft: `${depth * 1.5}rem` }}
        >
          <div className="flex items-center gap-2">
            <span className="text-muted-text cursor-grab">⣿</span>
            <span className="font-bold text-heading">{item.nameTamil}</span>
            <span className="text-xs text-muted-text font-mono ml-2">/{item.slug}</span>
          </div>
          <button className="text-xs text-text-link hover:text-moss">Edit</button>
        </div>
        {children.length > 0 && (
          <div className="w-full">
            {children.map(child => renderItem(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-1">
      {tree.map(item => renderItem(item))}
      {tree.length === 0 && (
        <div className="text-center p-8 text-muted-text border border-border-default border-dashed rounded-cards">
          No categories found.
        </div>
      )}
    </div>
  );
}
