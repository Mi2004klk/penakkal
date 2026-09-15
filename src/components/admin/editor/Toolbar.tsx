"use client";

import { Editor } from '@tiptap/react';
import { 
  Bold, Italic, Strikethrough, Code, 
  Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo, Redo, Image as ImageIcon
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor;
}

export default function Toolbar({ editor }: ToolbarProps) {
  if (!editor) {
    return null;
  }

  const toggleBold = () => editor.chain().focus().toggleBold().run();
  const toggleItalic = () => editor.chain().focus().toggleItalic().run();
  const toggleStrike = () => editor.chain().focus().toggleStrike().run();
  
  const toggleH1 = () => editor.chain().focus().toggleHeading({ level: 1 }).run();
  const toggleH2 = () => editor.chain().focus().toggleHeading({ level: 2 }).run();
  
  const toggleBulletList = () => editor.chain().focus().toggleBulletList().run();
  const toggleOrderedList = () => editor.chain().focus().toggleOrderedList().run();
  const toggleBlockquote = () => editor.chain().focus().toggleBlockquote().run();

  const handleImageClick = () => {
    // In a real implementation, this opens the Media Picker
    const url = window.prompt('Enter image URL');
    if (url) {
      // Assuming an image extension is added later
      // editor.chain().focus().setImage({ src: url }).run();
      console.log("Image insertion to be implemented with Media Picker", url);
    }
  };

  const Button = ({ onClick, isActive, disabled, children }: any) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`p-2 rounded-buttons hover:bg-surface-card transition-colors ${
        isActive ? 'bg-surface-card text-moss' : 'text-muted-text'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b border-border-default bg-surface-page sticky top-0 z-10">
      <Button
        onClick={toggleBold}
        isActive={editor.isActive('bold')}
      >
        <Bold className="w-4 h-4" />
      </Button>
      <Button
        onClick={toggleItalic}
        isActive={editor.isActive('italic')}
      >
        <Italic className="w-4 h-4" />
      </Button>
      <Button
        onClick={toggleStrike}
        isActive={editor.isActive('strike')}
      >
        <Strikethrough className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-border-default mx-1" />
      
      <Button
        onClick={toggleH1}
        isActive={editor.isActive('heading', { level: 1 })}
      >
        <Heading1 className="w-4 h-4" />
      </Button>
      <Button
        onClick={toggleH2}
        isActive={editor.isActive('heading', { level: 2 })}
      >
        <Heading2 className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-border-default mx-1" />
      
      <Button
        onClick={toggleBulletList}
        isActive={editor.isActive('bulletList')}
      >
        <List className="w-4 h-4" />
      </Button>
      <Button
        onClick={toggleOrderedList}
        isActive={editor.isActive('orderedList')}
      >
        <ListOrdered className="w-4 h-4" />
      </Button>
      <Button
        onClick={toggleBlockquote}
        isActive={editor.isActive('blockquote')}
      >
        <Quote className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border-default mx-1" />

      <Button onClick={handleImageClick}>
        <ImageIcon className="w-4 h-4" />
      </Button>
      
      <div className="w-px h-6 bg-border-default mx-1" />
      
      <Button
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="w-4 h-4" />
      </Button>
      <Button
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="w-4 h-4" />
      </Button>
    </div>
  );
}
