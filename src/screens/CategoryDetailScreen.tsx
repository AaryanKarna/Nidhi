import React, { useState, useRef } from 'react';
import { 
  ArrowLeft, 
  MoreVertical, 
  Trash2, 
  CheckSquare, 
  X, 
  Check, 
  Instagram, 
  Globe, 
  Youtube, 
  Twitter, 
  Github,
  ExternalLink,
  Pin,
  PinOff,
  Share2,
  Pencil,
  Folder
} from 'lucide-react';
import { Category, SavedLink } from '../types';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { openExternalUrl, copyToClipboard } from '../utils/urlUtils';

interface CategoryDetailScreenProps {
  categoryName: string;
  category?: Category;
  links: SavedLink[];
  onBack: () => void;
  onSelectLink: (link: SavedLink) => void;
  onEditLink?: (link: SavedLink) => void;
  onDeleteLink?: (link: SavedLink) => void;
  onUpdateLink?: (link: SavedLink) => void;
  onDeleteFolder?: (categoryName: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onOpenAddForCategory: (catName: string) => void;
  onDeleteMultipleLinks?: (ids: string[], categoryName: string) => void;
  onShowToast: (message: string) => void;
  isDark?: boolean;
}

export const CategoryDetailScreen: React.FC<CategoryDetailScreenProps> = ({
  categoryName,
  category,
  links,
  onBack,
  onSelectLink,
  onEditLink,
  onDeleteLink,
  onUpdateLink,
  onDeleteFolder,
  onToggleFavorite,
  onOpenAddForCategory,
  onDeleteMultipleLinks,
  onShowToast,
  isDark = false,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteFolderConfirm, setShowDeleteFolderConfirm] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeleteBatchConfirm, setShowDeleteBatchConfirm] = useState(false);

  // Long-press modal state (Image 1)
  const [longPressedLink, setLongPressedLink] = useState<SavedLink | null>(null);

  // Single-click modal popup state (Image 2)
  const [popupLink, setPopupLink] = useState<SavedLink | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');

  // Long press timer refs
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPressRef = useRef(false);

  const categoryLinks = links.filter(
    (l) => l.category.toLowerCase() === categoryName.toLowerCase()
  );

  // Format date matching Screenshot 2: "22 Sept 2026, 8:15 PM"
  const formatDetailDate = (timestamp: number) => {
    const d = new Date(timestamp);
    const day = d.getDate();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();
    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
  };

  // Long press handlers
  const handlePressStart = (link: SavedLink) => {
    if (isSelectionMode) return;
    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      setLongPressedLink(link);
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate(40);
      }
    }, 450);
  };

  const handlePressEnd = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handlePressCancel = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // Click card handler (Single click pops Image 2; multi-select toggles selection)
  const handleCardClick = (link: SavedLink) => {
    if (isLongPressRef.current) {
      isLongPressRef.current = false;
      return;
    }

    if (isSelectionMode) {
      handleToggleSelect(link.id);
    } else {
      // Single click: Pop Image 2 modal popup
      setPopupLink(link);
      setEditingNotes(link.notes || '');
    }
  };

  // Toggle selection for a single link card
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Toggle Select All / Deselect All
  const handleToggleSelectAll = () => {
    if (selectedIds.length === categoryLinks.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(categoryLinks.map((l) => l.id));
    }
  };

  // Exit selection mode
  const handleExitSelectionMode = () => {
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  // Confirm delete of selected links
  const handleConfirmBatchDelete = () => {
    if (selectedIds.length === 0) return;
    if (onDeleteMultipleLinks) {
      onDeleteMultipleLinks(selectedIds, categoryName);
    }
    setShowDeleteBatchConfirm(false);
    setIsSelectionMode(false);
    setSelectedIds([]);
  };

  // Handle note edits in Image 2 modal
  const handleNotesChange = (val: string) => {
    setEditingNotes(val);
    if (popupLink && onUpdateLink) {
      const updated = { ...popupLink, notes: val, updatedAt: Date.now() };
      setPopupLink(updated);
      onUpdateLink(updated);
    }
  };

  // Render service icon matching Screenshot 2 (e.g. Instagram Share)
  const renderServiceBadge = (link: SavedLink) => {
    const urlLower = (link.url + ' ' + link.domain).toLowerCase();
    if (urlLower.includes('instagram')) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] flex items-center justify-center text-white p-0.5 shadow-xs">
            <Instagram size={11} strokeWidth={2.4} />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Share
          </span>
        </div>
      );
    }

    if (urlLower.includes('youtube')) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-red-600 flex items-center justify-center text-white p-0.5 shadow-xs">
            <Youtube size={11} strokeWidth={2.4} />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Video
          </span>
        </div>
      );
    }

    if (urlLower.includes('twitter') || urlLower.includes('x.com')) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-black flex items-center justify-center text-white p-0.5 shadow-xs">
            <Twitter size={11} strokeWidth={2.4} />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Post
          </span>
        </div>
      );
    }

    if (urlLower.includes('github')) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-slate-900 flex items-center justify-center text-white p-0.5 shadow-xs">
            <Github size={11} strokeWidth={2.4} />
          </div>
          <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Repo
          </span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-md bg-slate-700 flex items-center justify-center text-white p-0.5 shadow-xs">
          <Globe size={11} strokeWidth={2.4} />
        </div>
        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Share
        </span>
      </div>
    );
  };

  return (
    <div
      className={`flex-1 flex flex-col h-full overflow-hidden select-none transition-colors relative ${
        isDark ? 'bg-[#0B0F19] text-white' : 'bg-[#FFFFFF] text-black'
      }`}
    >
      {/* Top Bar: Standard Mode vs Selection Mode */}
      {isSelectionMode ? (
        /* Multi-Select Header Bar */
        <div className="pt-4 px-5 pb-3 flex items-center justify-between animate-fade-in">
          {/* Left: Close selection mode [✕] */}
          <button
            type="button"
            onClick={handleExitSelectionMode}
            className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
            title="Cancel selection"
          >
            <X size={22} strokeWidth={2.8} />
          </button>

          {/* Center: Selected count */}
          <div className="flex flex-col items-center justify-center text-center px-2">
            <span className="text-lg font-black tracking-tight leading-tight">
              {selectedIds.length} selected
            </span>
          </div>

          {/* Right: Batch Delete button */}
          <button
            type="button"
            disabled={selectedIds.length === 0}
            onClick={() => setShowDeleteBatchConfirm(true)}
            className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center transition-all ${
              selectedIds.length > 0
                ? 'bg-[#FF4D4D] text-white shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer'
                : 'bg-slate-200 text-slate-400 border-slate-300 opacity-60 cursor-not-allowed'
            }`}
            title="Delete selected links"
          >
            <Trash2 size={22} strokeWidth={2.6} />
          </button>
        </div>
      ) : (
        /* Standard Header Bar matching Screenshot */
        <div className="pt-4 px-5 pb-3 flex items-center justify-between">
          {/* Left: Back Button [←] */}
          <button
            type="button"
            onClick={onBack}
            className={`w-12 h-12 rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
              isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
            }`}
            title="Back"
          >
            <ArrowLeft size={22} strokeWidth={2.8} />
          </button>

          {/* Center: Collection Name */}
          <div className="flex flex-col items-center justify-center text-center px-2">
            <h1 className="text-xl font-black tracking-tight leading-tight">
              {categoryName}
            </h1>
          </div>

          {/* Right Action: 3-Dots Button */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className={`w-11 h-11 rounded-2xl border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer ${
                isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
              }`}
              title="More options"
            >
              <MoreVertical size={20} strokeWidth={2.6} />
            </button>

            {/* 3-Dots Popover */}
            {showMenu && (
              <div
                className={`absolute right-0 top-13 z-50 w-48 rounded-2xl border-2 border-black p-1.5 shadow-[4px_4px_0px_#000] animate-fade-in ${
                  isDark ? 'bg-[#131B2E] text-white' : 'bg-white text-black'
                }`}
              >
                {/* 1. Select links option */}
                <button
                  type="button"
                  disabled={categoryLinks.length === 0}
                  onClick={() => {
                    setShowMenu(false);
                    setIsSelectionMode(true);
                    setSelectedIds([]);
                  }}
                  className={`w-full text-left px-3 py-2.5 text-xs font-black rounded-xl flex items-center gap-2.5 transition-colors ${
                    categoryLinks.length === 0
                      ? 'opacity-40 cursor-not-allowed'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer'
                  }`}
                >
                  <CheckSquare size={16} strokeWidth={2.4} />
                  <span>Select links</span>
                </button>

                {/* 2. Delete folder option (clears all links at once) */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteFolderConfirm(true);
                  }}
                  className="w-full text-left px-3 py-2.5 text-xs font-black rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 flex items-center gap-2.5 cursor-pointer transition-colors border-t border-slate-200 dark:border-slate-700 mt-1"
                >
                  <Trash2 size={16} strokeWidth={2.4} />
                  <span>Delete folder</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-6 pt-4 pb-12 flex flex-col">
        {/* SAVES (X) Heading */}
        <h2 className="text-base font-black uppercase tracking-tight text-black dark:text-white mb-4">
          SAVES ({categoryLinks.length})
        </h2>

        {/* Empty State vs Link List */}
        {categoryLinks.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center my-auto py-16 animate-fade-in">
            {/* Minimalist Folder Vector */}
            <div className="relative w-36 h-28 flex items-center justify-center mb-4">
              <svg
                viewBox="0 0 130 96"
                className="w-full h-full overflow-visible"
                fill="none"
              >
                <ellipse cx="65" cy="92" rx="40" ry="3.5" fill="#CBD5E1" opacity="0.8" />
                <path
                  d="M 24,20 C 24,14 28,10 34,10 L 58,10 C 62,10 65,13 67,16 L 70,20 L 106,20 C 112,20 116,24 116,30 L 116,74 C 116,80 112,84 106,84 L 24,84 C 18,84 14,80 14,74 L 14,30 C 14,24 18,20 24,20 Z"
                  fill="#E5E7EB"
                  stroke="#000000"
                  strokeWidth="2.8"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3
              className={`text-2xl font-black tracking-tight ${
                isDark ? 'text-white' : 'text-black'
              }`}
            >
              No items yet
            </h3>
          </div>
        ) : (
          /* Active Links Grid */
          <div className="grid grid-cols-2 gap-4 animate-fade-in">
            {categoryLinks.map((link) => {
              const isSelected = selectedIds.includes(link.id);

              return (
                <div
                  key={link.id}
                  onTouchStart={() => handlePressStart(link)}
                  onTouchEnd={handlePressEnd}
                  onTouchMove={handlePressCancel}
                  onMouseDown={() => handlePressStart(link)}
                  onMouseUp={handlePressEnd}
                  onMouseLeave={handlePressCancel}
                  onClick={() => handleCardClick(link)}
                  className={`relative border-2 border-black rounded-2xl shadow-[3px_3px_0px_#000] overflow-hidden cursor-pointer select-none tactile-card ${
                    isDark ? 'bg-[#131B2E]' : 'bg-white'
                  } ${isSelected ? 'ring-3 ring-black dark:ring-white scale-[0.98]' : ''}`}
                >
                  {/* Selection Mode Checkbox Indicator */}
                  {isSelectionMode && (
                    <div className="absolute top-2.5 right-2.5 z-20">
                      <div
                        className={`w-6 h-6 rounded-lg border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] transition-all ${
                          isSelected ? 'bg-black text-white' : 'bg-white text-transparent'
                        }`}
                      >
                        <Check size={14} strokeWidth={3.5} />
                      </div>
                    </div>
                  )}

                  {/* Top Yellow Card Half with Bold Centered Letter */}
                  <div className="h-32 bg-[#FFCE31] border-b-2 border-black flex items-center justify-center">
                    <span className="text-4xl font-black text-black select-none">
                      {link.title ? link.title.charAt(0).toUpperCase() : 'S'}
                    </span>
                  </div>

                  {/* Bottom Card Half with Title and Service badge */}
                  <div className="p-3.5">
                    <h3
                      className={`font-black text-sm truncate mb-2 leading-tight ${
                        isDark ? 'text-white' : 'text-black'
                      }`}
                    >
                      {link.title || link.domain}
                    </h3>

                    {renderServiceBadge(link)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* IMAGE 1: LONG-PRESS FLOATING ACTION OVERLAY                               */}
      {/* ========================================================================= */}
      {longPressedLink && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-start justify-start p-6 pt-24 animate-fade-in select-none"
          onClick={() => setLongPressedLink(null)}
        >
          <div
            className="relative w-56 max-w-xs animate-scale-up ml-2 mt-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action 1: External Link (Top-Left, overlapping card) */}
            <button
              type="button"
              onClick={() => {
                openExternalUrl(longPressedLink.url);
                onShowToast('Opening in browser...');
                setLongPressedLink(null);
              }}
              className="absolute -top-7 -left-5 z-30 w-16 h-16 rounded-full bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] flex items-center justify-center tactile-btn animate-pop-in cursor-pointer"
              title="Open external link"
            >
              <ExternalLink size={26} strokeWidth={2.8} />
            </button>

            {/* Action 2: Pin / Pushpin (Top, right of ExternalLink) */}
            <button
              type="button"
              onClick={(e) => {
                onToggleFavorite(longPressedLink.id, e);
                onShowToast(longPressedLink.isFavorite ? 'Unpinned link' : 'Pinned link');
                setLongPressedLink(null);
              }}
              className={`absolute -top-8 left-18 z-30 w-13 h-13 rounded-full border-[3px] border-black shadow-[3px_3px_0px_#000] flex items-center justify-center tactile-btn animate-pop-in delay-50 cursor-pointer ${
                longPressedLink.isFavorite ? 'bg-[#FFCE31] text-black' : 'bg-white text-black'
              }`}
              title="Pin / Favorite"
            >
              <Pin
                size={22}
                strokeWidth={2.6}
                className={longPressedLink.isFavorite ? 'fill-black' : ''}
              />
            </button>

            {/* Action 3: Share (Right side, upper) */}
            <button
              type="button"
              onClick={async () => {
                const ok = await copyToClipboard(longPressedLink.url);
                if (ok) onShowToast('Link copied to clipboard');
                setLongPressedLink(null);
              }}
              className="absolute -top-1 -right-8 z-30 w-14 h-14 rounded-full bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] flex items-center justify-center tactile-btn animate-pop-in delay-100 cursor-pointer"
              title="Share link"
            >
              <Share2 size={24} strokeWidth={2.6} />
            </button>

            {/* Action 4: Trash (Right side, lower) */}
            <button
              type="button"
              onClick={() => {
                const target = longPressedLink;
                setLongPressedLink(null);
                if (onDeleteLink) {
                  onDeleteLink(target);
                } else if (onDeleteMultipleLinks) {
                  onDeleteMultipleLinks([target.id], categoryName);
                }
              }}
              className="absolute top-16 -right-7 z-30 w-13 h-13 rounded-full bg-white text-black border-[3px] border-black shadow-[3px_3px_0px_#000] flex items-center justify-center tactile-btn animate-pop-in delay-150 cursor-pointer"
              title="Delete link"
            >
              <Trash2 size={22} strokeWidth={2.6} />
            </button>

            {/* Focused Elevated Card */}
            <div className="border-[3px] border-black rounded-3xl shadow-[5px_5px_0px_#000] overflow-hidden bg-white animate-scale-up">
              {/* Top Yellow Half */}
              <div className="h-36 bg-[#FFCE31] border-b-[2.8px] border-black flex items-center justify-center">
                <span className="text-5xl font-black text-black select-none">
                  {longPressedLink.title ? longPressedLink.title.charAt(0).toUpperCase() : 'S'}
                </span>
              </div>
              {/* Bottom White Half */}
              <div className="p-4 bg-white">
                <h3 className="font-black text-base truncate mb-2 text-black leading-tight">
                  {longPressedLink.title || longPressedLink.domain}
                </h3>
                {renderServiceBadge(longPressedLink)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* IMAGE 2: SINGLE-PRESS POPUP MODAL DIALOG                                  */}
      {/* ========================================================================= */}
      {popupLink && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in select-none overflow-y-auto"
          onClick={() => setPopupLink(null)}
        >
          <div
            className="w-full max-w-sm rounded-[28px] border-[3px] border-black shadow-[6px_6px_0px_#000] bg-white overflow-hidden animate-scale-up my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: "SHARE" on left, 4 square action buttons on right */}
            <div className="px-5 pt-4 pb-3 flex items-center justify-between">
              <span className="text-xs font-black tracking-widest text-slate-700 uppercase">
                SHARE
              </span>

              <div className="flex items-center gap-2">
                {/* 1. Share */}
                <button
                  type="button"
                  onClick={async () => {
                    const ok = await copyToClipboard(popupLink.url);
                    if (ok) onShowToast('Link copied to clipboard');
                  }}
                  className="w-9 h-9 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  title="Share"
                >
                  <Share2 size={16} strokeWidth={2.4} />
                </button>

                {/* 2. Red Delete Button */}
                <button
                  type="button"
                  onClick={() => {
                    const target = popupLink;
                    setPopupLink(null);
                    if (onDeleteLink) {
                      onDeleteLink(target);
                    } else if (onDeleteMultipleLinks) {
                      onDeleteMultipleLinks([target.id], categoryName);
                    }
                  }}
                  className="w-9 h-9 rounded-xl border-2 border-black bg-[#FF4D6D] text-white flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                  title="Delete link"
                >
                  <Trash2 size={16} strokeWidth={2.4} />
                </button>
              </div>
            </div>

            {/* Yellow Graphic Section with Big Initial */}
            <div className="relative h-56 bg-[#FFCE31] border-y-2 border-black flex items-center justify-center">
              <span className="text-7xl font-black text-black select-none tracking-tighter">
                {popupLink.title ? popupLink.title.charAt(0).toUpperCase() : 'S'}
              </span>

              {/* Top-Right Toggle Pin/Visibility Button */}
              <button
                type="button"
                onClick={(e) => {
                  onToggleFavorite(popupLink.id, e);
                  setPopupLink({ ...popupLink, isFavorite: !popupLink.isFavorite });
                  onShowToast(popupLink.isFavorite ? 'Unpinned' : 'Pinned');
                }}
                className="absolute top-3 right-3 w-9 h-9 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-[1.5px_1.5px_0px_#000] cursor-pointer"
                title="Toggle pin"
              >
                {popupLink.isFavorite ? (
                  <Pin size={16} strokeWidth={2.6} className="fill-black" />
                ) : (
                  <PinOff size={16} strokeWidth={2.4} />
                )}
              </button>
            </div>

            {/* Lower Info Section */}
            <div className="p-4 flex flex-col gap-3 bg-white">
              {/* Title Row with Edit Pencil Button */}
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-2xl font-black text-black tracking-tight truncate flex-1">
                  {popupLink.title || popupLink.domain}
                </h2>

                <button
                  type="button"
                  onClick={() => {
                    setPopupLink(null);
                    if (onEditLink) {
                      onEditLink(popupLink);
                    }
                  }}
                  className="w-10 h-10 rounded-xl border-2 border-black bg-white flex items-center justify-center shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer shrink-0"
                  title="Edit link"
                >
                  <Pencil size={18} strokeWidth={2.6} />
                </button>
              </div>

              {/* Black Divider */}
              <div className="border-b-2 border-black w-full" />

              {/* Subtitle: Folder Icon + Category · Date */}
              <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                <Folder size={15} strokeWidth={2.4} />
                <span>{categoryName}</span>
                <span>·</span>
                <span>{formatDetailDate(popupLink.createdAt)}</span>
              </div>

              {/* Yellow URL Box */}
              <button
                type="button"
                onClick={() => {
                  openExternalUrl(popupLink.url);
                  onShowToast('Opening in browser...');
                }}
                className="w-full bg-[#FFCE31] border-2 border-black rounded-xl p-3 flex items-center gap-2.5 shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 transition-all text-left cursor-pointer"
              >
                <ExternalLink size={20} strokeWidth={2.6} className="shrink-0 text-black" />
                <span className="text-xs font-bold text-black truncate flex-1">
                  {popupLink.url}
                </span>
              </button>

              {/* Black Divider */}
              <div className="border-b-2 border-black w-full my-0.5" />

              {/* NOTES Section */}
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-black uppercase tracking-wider text-black">
                  NOTES
                </span>
                <div className="bg-[#FFF9EB] border-2 border-black rounded-2xl p-3 shadow-[1.5px_1.5px_0px_#000]">
                  <textarea
                    rows={3}
                    value={editingNotes}
                    placeholder="Tap to add notes..."
                    onChange={(e) => handleNotesChange(e.target.value)}
                    className="w-full bg-transparent resize-none text-xs font-semibold text-black placeholder:text-slate-400 placeholder:italic outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Select Batch Delete Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteBatchConfirm}
        title="Delete Selected Links?"
        message={`Are you sure you want to delete ${selectedIds.length} ${
          selectedIds.length === 1 ? 'link' : 'links'
        }? If this folder becomes empty, it will be automatically removed.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={handleConfirmBatchDelete}
        onCancel={() => setShowDeleteBatchConfirm(false)}
        isDark={isDark}
      />

      {/* Delete Entire Folder Confirmation */}
      <ConfirmDialog
        isOpen={showDeleteFolderConfirm}
        title={`Delete "${categoryName}" Folder?`}
        message={`Are you sure you want to delete this folder? All ${categoryLinks.length} link${
          categoryLinks.length === 1 ? '' : 's'
        } inside will be permanently cleared.`}
        confirmText="Delete Folder"
        cancelText="Cancel"
        isDangerous={true}
        onConfirm={() => {
          setShowDeleteFolderConfirm(false);
          if (onDeleteFolder) {
            onDeleteFolder(categoryName);
          }
        }}
        onCancel={() => setShowDeleteFolderConfirm(false)}
        isDark={isDark}
      />
    </div>
  );
};
