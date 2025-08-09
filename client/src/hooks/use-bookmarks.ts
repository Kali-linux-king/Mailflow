import { useState } from "react";

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  const toggleBookmark = (toolId: string) => {
    setBookmarks(prev => 
      prev.includes(toolId) 
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId]
    );
  };

  return { bookmarks, toggleBookmark };
}