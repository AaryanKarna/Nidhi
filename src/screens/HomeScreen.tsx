import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  Clipboard, 
  Folder 
} from 'lucide-react';
import { SavedLink, Category } from '../types';
import { AddCollectionBottomSheet } from '../components/collections/AddCollectionBottomSheet';
import { NoUrlDialog } from '../components/common/NoUrlDialog';

interface HomeScreenProps {
  links: SavedLink[];
  categories: Category[];
  onSelectLink: (link: SavedLink) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAdd: (initialUrl?: string) => void;
  onQuickSaveLink: (url: string) => void;
  onOpenCategory: (categoryName: string) => void;
  onOpenSearch: () => void;
  onOpenAllLinks: () => void;
  onCreateCategory: (cat: Omit<Category, 'id'>) => void;
  onShowToast: (message: string) => void;
  isDark?: boolean;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  links,
  categories,
  onSelectLink,
  onToggleFavorite,
  onOpenAdd,
  onQuickSaveLink,
  onOpenCategory,
  onOpenSearch,
  onOpenAllLinks,
  onCreateCategory,
  onShowToast,
  isDark = false,
}) => {
  const [quickUrl, setQuickUrl] = useState('');
  const [showAddCollectionSheet, setShowAddCollectionSheet] = useState(false);
  const [showNoUrlDialog, setShowNoUrlDialog] = useState(false);

  // Clipboard paste handler
  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setQuickUrl(text.trim());
        onShowToast('Pasted URL from clipboard');
      } else {
        onShowToast('Clipboard is empty');
      }
    } catch {
      onShowToast('Clipboard permission was not granted');
    }
  };

  // Direct quick save into "Unsorted" or show No URL alert
  const handleQuickSaveOrAdd = () => {
    if (!quickUrl.trim()) {
      setShowNoUrlDialog(true);
      return;
    }

    onQuickSaveLink(quickUrl.trim());
    setQuickUrl('');
  };

  // Add new collection from bottom sheet
  const handleCreateCollection = (catData: Omit<Category, 'id'>) => {
    onCreateCategory(catData);
    onShowToast(`Created collection "${catData.name}"`);
    setShowAddCollectionSheet(false);
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden select-none transition-colors ${
        isDark ? 'bg-[#0B0F19] text-white' : 'bg-[#FFFFFF] text-black'
      }`}
    >
      {/* Top App Bar: Top-right Folder & Search */}
      <div className="pt-4 px-5 pb-2 flex items-center justify-end">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setShowAddCollectionSheet(true)}
            className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] tactile-btn ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
            title="Add new collection"
          >
            <div className="relative flex items-center justify-center">
              <Folder size={22} strokeWidth={2.4} />
              <div className="absolute -bottom-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-[#FFCE31] border border-black flex items-center justify-center shadow-xs">
                <Plus size={9} strokeWidth={3.5} className="text-black" />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={onOpenSearch}
            className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] tactile-btn ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
            title="Search"
          >
            <Search size={22} strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-5 pb-8 flex flex-col">
        {/* Large Prominent Headline */}
        <div className="mb-6">
          <h1
            className={`text-4xl sm:text-5xl font-black tracking-tight leading-[1.08] ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            Save it once.
            <br />
            Access it anytime.
          </h1>
        </div>

        {/* Quick Save Bar + Yellow Add Button */}
        <div className="flex items-center gap-3 mb-8">
          {/* Input Box */}
          <div
            className={`flex-1 h-14 rounded-2xl border-2 border-black flex items-center px-4 transition-all shadow-[2px_2px_0px_#000] ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
          >
            <span className="text-lg font-black mr-3 text-slate-800 dark:text-slate-200 select-none">
              #
            </span>
            <input
              type="text"
              value={quickUrl}
              onChange={(e) => setQuickUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuickSaveOrAdd()}
              placeholder="Paste link to quick save"
              className="w-full text-sm font-medium outline-none bg-transparent placeholder:text-slate-400"
            />
            <button
              type="button"
              onClick={handlePasteClipboard}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300 hover:text-black dark:hover:text-white transition-colors"
              title="Paste from clipboard"
            >
              <Clipboard size={20} strokeWidth={2.3} />
            </button>
          </div>

          {/* Yellow Square [+] Button */}
          <button
            type="button"
            onClick={handleQuickSaveOrAdd}
            className="w-14 h-14 rounded-2xl bg-[#FFCE31] hover:bg-[#FFD54F] border-2 border-black flex items-center justify-center text-black shadow-[3px_3px_0px_#000] tactile-btn shrink-0 cursor-pointer"
            title="Quick add link"
          >
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>

        {/* Section Heading: My Collections */}
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-xl font-black tracking-tight ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            My Collections
          </h2>
        </div>

        {/* Collections Grid matching Screenshot 1 */}
        {categories.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-10 animate-fade-in">
            <h3
              className={`text-xl font-black tracking-tight mb-2 ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              Your saved links will appear here
            </h3>
            <p className="text-sm font-medium text-slate-500 max-w-[270px] leading-relaxed mb-6">
              Start organizing your saves by creating your first collection.
            </p>
            <button
              type="button"
              onClick={() => setShowAddCollectionSheet(true)}
              className="py-2.5 px-8 rounded-2xl bg-[#FFCE31] hover:bg-[#FFD54F] text-black font-extrabold text-sm border-2 border-black shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] transition-all cursor-pointer"
            >
              Create now
            </button>
          </div>
        ) : (
          /* Real Folder Tabs Grid matching Screenshot 1 */
          <div className="grid grid-cols-2 gap-3.5 animate-fade-in pt-1">
            {categories.map((cat) => {
              const count = links.filter(
                (l) => l.category.toLowerCase() === cat.name.toLowerCase()
              ).length;
              const folderColor = cat.color || '#FFCE31';

              return (
                <div
                  key={cat.id}
                  onClick={() => onOpenCategory(cat.name)}
                  className="flex flex-col cursor-pointer group select-none hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-transform duration-150"
                >
                  {/* Top-Left Folder Tab */}
                  <div
                    className="w-24 h-3.5 rounded-t-xl border-t-2 border-x-2 border-black ml-1.5"
                    style={{ backgroundColor: folderColor }}
                  />

                  {/* Main Folder Card */}
                  <div
                    className={`border-2 border-black rounded-b-2xl rounded-tr-2xl rounded-tl-none p-3.5 shadow-[3px_3px_0px_#000] flex flex-col justify-between h-36 ${
                      isDark ? 'bg-[#131B2E]' : 'bg-white'
                    }`}
                  >
                    {/* Top Row: Square Icon Box + Item Count */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center text-black shrink-0"
                        style={{ backgroundColor: folderColor }}
                      >
                        <Folder size={22} strokeWidth={2.4} fill={folderColor} />
                      </div>
                      <span className="text-xs font-black text-black truncate">
                        {count} {count === 1 ? 'item' : 'items'}
                      </span>
                    </div>

                    {/* Bottom Row: Collection Name */}
                    <div>
                      <h4
                        className={`text-base font-black truncate leading-tight ${
                          isDark ? 'text-white' : 'text-black'
                        }`}
                      >
                        {cat.name}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add New Collection Bottom Sheet */}
      <AddCollectionBottomSheet
        isOpen={showAddCollectionSheet}
        onClose={() => setShowAddCollectionSheet(false)}
        onCreate={handleCreateCollection}
        isDark={isDark}
      />

      {/* No URL Dialog */}
      <NoUrlDialog
        isOpen={showNoUrlDialog}
        onClose={() => setShowNoUrlDialog(false)}
        isDark={isDark}
      />
    </div>
  );
};
