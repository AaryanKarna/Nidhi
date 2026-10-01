import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  X, 
} from 'lucide-react';
import { SavedLink, Category, SortOption } from '../types';
import { Header } from '../components/common/Header';
import { LinkCard } from '../components/links/LinkCard';
import { EmptyState } from '../components/common/EmptyState';

interface LinksScreenProps {
  links: SavedLink[];
  categories: Category[];
  onSelectLink: (link: SavedLink) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAdd: () => void;
  onShowToast: (message: string) => void;
  isDark?: boolean;
}

export const LinksScreen: React.FC<LinksScreenProps> = ({
  links,
  categories,
  onSelectLink,
  onToggleFavorite,
  onOpenAdd,
  onShowToast,
  isDark = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<SortOption>('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Filter & Sort
  const filteredLinks = useMemo(() => {
    let result = [...links];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (l) =>
          l.title.toLowerCase().includes(q) ||
          l.domain.toLowerCase().includes(q) ||
          l.url.toLowerCase().includes(q) ||
          l.category.toLowerCase().includes(q) ||
          (l.description && l.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(
        (l) => l.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'az':
          return a.title.localeCompare(b.title);
        case 'za':
          return b.title.localeCompare(a.title);
        case 'most-visited':
          return (b.visitCount || 0) - (a.visitCount || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [links, searchQuery, selectedCategory, sortOption]);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      <Header
        title="All Saved Links"
        subtitle={`${links.length} total saved links`}
        isDark={isDark}
      />

      <div className="flex-1 overflow-y-auto no-scrollbar p-4 pb-24">
        {/* Search Bar & Filter Toggle */}
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`flex-1 flex items-center px-3.5 py-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] transition-colors ${
              isDark
                ? 'bg-[#151D28] text-white'
                : 'bg-white text-black'
            }`}
          >
            <Search
              size={18}
              strokeWidth={2.4}
              className="mr-2.5 text-slate-400 shrink-0"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search title, URL, tag..."
              className="w-full text-sm font-semibold outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="p-1 rounded-md text-black dark:text-white hover:opacity-70"
              >
                <X size={15} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`p-2.5 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] transition-colors cursor-pointer ${
              showFilters || selectedCategory !== 'all'
                ? 'bg-[#69818D] text-white'
                : isDark
                ? 'bg-[#151D28] text-white'
                : 'bg-white text-black'
            }`}
            title="Filter by category"
          >
            <Filter size={18} strokeWidth={2.5} />
          </button>

          {/* Sort Selector */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as SortOption)}
              className={`px-3 py-2.5 text-xs font-black rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] outline-none appearance-none pr-7 cursor-pointer ${
                isDark
                  ? 'bg-[#151D28] text-white'
                  : 'bg-white text-black'
              }`}
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="az">A to Z</option>
              <option value="za">Z to A</option>
              <option value="most-visited">Most Visited</option>
            </select>
            <ArrowUpDown
              size={12}
              strokeWidth={2.5}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-black dark:text-white"
            />
          </div>
        </div>

        {/* Category Pill Filters (Shown when toggled or active) */}
        {(showFilters || selectedCategory !== 'all') && (
          <div className="mb-4 pt-1 animate-fade-in">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all border border-black shadow-[1px_1px_0px_#000] cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#69818D] text-white'
                    : isDark
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-black'
                }`}
              >
                All ({links.length})
              </button>
              {categories.map((cat) => {
                const count = links.filter(
                  (l) => l.category.toLowerCase() === cat.name.toLowerCase()
                ).length;
                const isSelected = selectedCategory.toLowerCase() === cat.name.toLowerCase();
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-black shrink-0 transition-all flex items-center gap-1.5 border border-black shadow-[1px_1px_0px_#000] cursor-pointer ${
                      isSelected
                        ? 'bg-[#69818D] text-white'
                        : isDark
                        ? 'bg-slate-800 text-white'
                        : 'bg-white text-black'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black"
                      style={{ backgroundColor: cat.color || '#69818D' }}
                    />
                    <span>{cat.name}</span>
                    <span className="opacity-80 text-[10px]">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Links List */}
        {filteredLinks.length === 0 ? (
          <EmptyState
            title={searchQuery ? 'No matching links' : 'No links saved yet'}
            description={
              searchQuery
                ? `No items found matching "${searchQuery}". Try different keywords.`
                : 'Save your first link to access it securely on this device anytime.'
            }
            actionText={searchQuery ? undefined : 'Add New Link'}
            onAction={searchQuery ? undefined : onOpenAdd}
            isDark={isDark}
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {filteredLinks.map((link) => (
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
  );
};
