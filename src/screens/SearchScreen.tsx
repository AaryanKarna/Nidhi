import React, { useState, useMemo } from 'react';
import { Search, X, Folder, Bookmark, Pin, Tag } from 'lucide-react';
import { SavedLink, Category } from '../types';
import { LinkCard } from '../components/links/LinkCard';

interface SearchScreenProps {
  links: SavedLink[];
  categories?: Category[];
  onBack: () => void;
  onSelectLink: (link: SavedLink) => void;
  onSelectCategory?: (categoryName: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onShowToast: (message: string) => void;
  isDark?: boolean;
}

export const SearchScreen: React.FC<SearchScreenProps> = ({
  links,
  categories = [],
  onBack,
  onSelectLink,
  onSelectCategory,
  onToggleFavorite,
  onShowToast,
  isDark = false,
}) => {
  const [query, setQuery] = useState('');

  // Exact Real-Time Stats for YOUR LIBRARY card
  const collectionsCount = categories.length;
  const savesCount = links.length;
  const pinnedCount = links.filter((l) => l.isFavorite).length;

  // Real-time unique tags list & count
  const allUniqueTags = useMemo(() => {
    const set = new Set<string>();
    links.forEach((l) => {
      if (l.tags && Array.isArray(l.tags)) {
        l.tags.forEach((t) => {
          if (t && t.trim()) set.add(t.trim().toLowerCase().replace(/^#/, ''));
        });
      }
      // Also extract #hashtags from notes or description if any
      const text = `${l.notes || ''} ${l.description || ''} ${l.title || ''}`;
      const hashMatches = text.match(/#[a-zA-Z0-9_\-]+/g);
      if (hashMatches) {
        hashMatches.forEach((m) => set.add(m.slice(1).toLowerCase()));
      }
    });
    return Array.from(set);
  }, [links]);

  const uniqueTagsCount = allUniqueTags.length;

  // Search Results based on query
  const matchingLinks = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return links.filter(
      (l) =>
        l.title.toLowerCase().includes(q) ||
        l.domain.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q) ||
        (l.description && l.description.toLowerCase().includes(q)) ||
        (l.notes && l.notes.toLowerCase().includes(q)) ||
        (l.tags && l.tags.some((t) => t.toLowerCase().includes(q)))
    );
  }, [links, query]);

  const matchingCategories = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        (c.description && c.description.toLowerCase().includes(q))
    );
  }, [categories, query]);

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden select-none transition-colors ${
        isDark ? 'bg-[#0B0F19] text-white' : 'bg-[#FFFFFF] text-black'
      }`}
    >
      {/* Top Search Bar matching Screenshot */}
      <div className="pt-4 px-4 pb-2.5 flex items-center gap-2.5">
        {/* Search Input Box */}
        <div
          className={`flex-1 h-12 rounded-2xl border-2 border-black flex items-center px-3.5 shadow-[2px_2px_0px_#000] ${
            isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
          }`}
        >
          <Search size={20} strokeWidth={2.6} className="text-black dark:text-white mr-2.5 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find collections or saves..."
            className="w-full text-sm font-semibold outline-none bg-transparent placeholder:text-slate-400 placeholder:font-normal"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 rounded-full text-slate-400 hover:text-black dark:hover:text-white transition-colors"
            >
              <X size={16} strokeWidth={2.8} />
            </button>
          )}
        </div>

        {/* Cancel Button */}
        <button
          type="button"
          onClick={onBack}
          className={`h-12 px-5 rounded-2xl border-2 border-black font-extrabold text-sm shadow-[2px_2px_0px_#000] tactile-btn ${
            isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black hover:bg-slate-50'
          }`}
        >
          Cancel
        </button>
      </div>

      {/* Main Content Area (No divider line between search box and YOUR LIBRARY card) */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pt-1 flex flex-col">
        {/* YOUR LIBRARY Card matching Screenshot */}
        <div className="bg-[#FFCE31] border-2 border-black rounded-[20px] shadow-[4px_4px_0px_#000] p-4 text-black mb-5 select-none animate-scale-up">
          <h2 className="text-xs font-black uppercase tracking-wider mb-3">
            YOUR LIBRARY
          </h2>

          <div className="flex items-center justify-between">
            {/* 1. Collections */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-1">
              <Folder size={24} strokeWidth={2.4} className="mb-1 text-black" />
              <span className="text-2xl font-black leading-tight text-black">
                {collectionsCount}
              </span>
              <span className="text-[11px] font-extrabold text-black">
                Collections
              </span>
            </div>

            {/* Divider 1 */}
            <div className="w-[1.5px] bg-black/40 h-11 mx-1 shrink-0" />

            {/* 2. Saves */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-1">
              <Bookmark size={24} strokeWidth={2.4} className="mb-1 text-black" />
              <span className="text-2xl font-black leading-tight text-black">
                {savesCount}
              </span>
              <span className="text-[11px] font-extrabold text-black">
                Saves
              </span>
            </div>

            {/* Divider 2 */}
            <div className="w-[1.5px] bg-black/40 h-11 mx-1 shrink-0" />

            {/* 3. Pinned */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-1">
              <Pin size={24} strokeWidth={2.4} className="mb-1 text-black" />
              <span className="text-2xl font-black leading-tight text-black">
                {pinnedCount}
              </span>
              <span className="text-[11px] font-extrabold text-black">
                Pinned
              </span>
            </div>

            {/* Divider 3 */}
            <div className="w-[1.5px] bg-black/40 h-11 mx-1 shrink-0" />

            {/* 4. Tags */}
            <div className="flex-1 flex flex-col items-center justify-center text-center p-1">
              <Tag size={24} strokeWidth={2.4} className="mb-1 text-black" />
              <span className="text-2xl font-black leading-tight text-black">
                {uniqueTagsCount}
              </span>
              <span className="text-[11px] font-extrabold text-black">
                Tags
              </span>
            </div>
          </div>
        </div>

        {/* Empty State when no query */}
        {!query.trim() ? (
          <div className="flex-1 flex flex-col items-center justify-center my-auto py-12 text-center select-none animate-fade-in">
            <Search size={54} strokeWidth={2.5} className="text-black dark:text-white mb-3 opacity-80" />
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Type something to search...
            </p>
          </div>
        ) : (
          /* Active Results View */
          <div className="flex-1 flex flex-col gap-4 animate-fade-in pb-6">
            {/* Matching Collections if any */}
            {matchingCategories.length > 0 && (
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                  Collections ({matchingCategories.length})
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {matchingCategories.map((cat) => (
                    <div
                      key={cat.id}
                      onClick={() => onSelectCategory && onSelectCategory(cat.name)}
                      className={`p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] cursor-pointer flex items-center gap-2.5 tactile-card ${
                        isDark ? 'bg-[#131B2E]' : 'bg-white'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-xl border border-black flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: cat.color || '#FFCE31' }}
                      >
                        📁
                      </div>
                      <span className="text-sm font-black truncate">{cat.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Links */}
            <div>
              {matchingLinks.length === 0 && matchingCategories.length === 0 ? (
                <div className="text-center py-8 text-sm font-bold text-slate-400">
                  No results found matching "{query}"
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {matchingLinks.map((link) => (
                    <LinkCard
                      key={link.id}
                      link={link}
                      onSelect={onSelectLink}
                      onToggleFavorite={onToggleFavorite}
                      onShowToast={onShowToast}
                      isDark={isDark}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
