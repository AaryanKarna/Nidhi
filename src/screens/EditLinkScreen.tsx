import React, { useState } from 'react';
import { 
  Link as LinkIcon, 
  Type, 
  Check, 
  Trash2, 
  Globe 
} from 'lucide-react';
import { SavedLink, Category } from '../types';
import { Header } from '../components/common/Header';
import { InputField } from '../components/common/InputField';
import { Button } from '../components/common/Button';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { extractDomain } from '../utils/urlUtils';

interface EditLinkScreenProps {
  link: SavedLink;
  categories: Category[];
  onSave: (updatedLink: SavedLink) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onCancel: () => void;
  onShowToast: (message: string) => void;
  isDark?: boolean;
}

export const EditLinkScreen: React.FC<EditLinkScreenProps> = ({
  link,
  categories,
  onSave,
  onDelete,
  onCancel,
  onShowToast,
  isDark = false,
}) => {
  const [url, setUrl] = useState(link.url);
  const [title, setTitle] = useState(link.title);
  const [category, setCategory] = useState(link.category);
  const [description, setDescription] = useState(link.description || '');
  const [isFavorite, setIsFavorite] = useState(link.isFavorite);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorUrl, setErrorUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setErrorUrl('Target URL cannot be empty');
      return;
    }

    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const domain = extractDomain(cleanUrl);
    const finalTitle = title.trim() || domain || 'Saved Web Link';

    setIsSubmitting(true);
    try {
      await onSave({
        ...link,
        url: cleanUrl,
        title: finalTitle,
        domain,
        category,
        description: description.trim(),
        isFavorite,
        updatedAt: Date.now(),
      });
      onShowToast('Link updated');
    } catch {
      onShowToast('Failed to update link');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    setShowDeleteConfirm(false);
    try {
      await onDelete(link.id);
      onShowToast('Link removed from vault');
    } catch {
      onShowToast('Failed to delete link');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      <Header
        title="Edit Link Details"
        subtitle={link.domain}
        showBack={true}
        onBack={onCancel}
        isDark={isDark}
        rightAction={
          <button
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
            className="p-2 rounded-xl bg-red-100 text-red-600 border border-black shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
            title="Delete this link"
          >
            <Trash2 size={18} strokeWidth={2.4} />
          </button>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 flex flex-col gap-5"
      >
        {/* Target URL */}
        <InputField
          label="Target Web Address (URL)"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (errorUrl) setErrorUrl('');
          }}
          error={errorUrl}
          icon={<LinkIcon size={18} strokeWidth={2.4} />}
          required
          isDark={isDark}
        />

        {/* Title */}
        <InputField
          label="Link Title / Heading"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          icon={<Type size={18} strokeWidth={2.4} />}
          isDark={isDark}
        />

        {/* Category Picker */}
        <div className="flex flex-col gap-2">
          <label
            className={`text-xs font-black uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            Category / Collection
          </label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-2.5 rounded-2xl border-2 border-black text-left text-xs font-black flex items-center gap-2.5 transition-all shadow-[2px_2px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
                    isSelected
                      ? 'bg-[#69818D] text-white ring-2 ring-black'
                      : isDark
                      ? 'bg-[#151D28] text-white hover:bg-slate-800'
                      : 'bg-white text-black hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0 border border-black"
                    style={{ backgroundColor: cat.color || '#69818D' }}
                  />
                  <span className="truncate flex-1">{cat.name}</span>
                  {isSelected && (
                    <Check size={16} strokeWidth={3} className="text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Optional Description / Notes */}
        <div className="flex flex-col gap-1.5">
          <label
            className={`text-xs font-black uppercase tracking-wider ${
              isDark ? 'text-white' : 'text-black'
            }`}
          >
            Notes & Description
          </label>
          <textarea
            rows={3}
            placeholder="Add personal notes or summary..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full p-3 rounded-2xl text-xs font-semibold outline-none border-2 border-black shadow-[2px_2px_0px_#000] resize-none ${
              isDark
                ? 'bg-[#151D28] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#69818D]'
                : 'bg-white text-black placeholder-slate-400 focus:ring-2 focus:ring-[#69818D]'
            }`}
          />
        </div>

        {/* Star as Favorite Toggle */}
        <div
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-3 rounded-2xl border-2 border-black shadow-[2px_2px_0px_#000] flex items-center justify-between cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 transition-colors ${
            isDark ? 'bg-[#151D28]' : 'bg-white'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl border border-black flex items-center justify-center ${
                isFavorite
                  ? 'bg-[#69818D] text-white'
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              ★
            </div>
            <div>
              <p
                className={`text-xs font-black ${
                  isDark ? 'text-white' : 'text-black'
                }`}
              >
                Mark as Favorite
              </p>
              <p className="text-[11px] text-slate-500 font-medium">
                Puts this link on quick-access
              </p>
            </div>
          </div>

          <div
            className={`w-6 h-6 rounded-lg border-2 border-black flex items-center justify-center ${
              isFavorite ? 'bg-[#69818D]' : 'bg-transparent'
            }`}
          >
            {isFavorite && <Check size={14} strokeWidth={3} className="text-white" />}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="secondary"
            size="lg"
            onClick={onCancel}
            className="flex-1"
            isDark={isDark}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="flex-2"
            isDark={isDark}
          >
            Save Changes
          </Button>
        </div>
      </form>

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Link?"
        message={`Are you sure you want to remove "${link.title}" from your vault? This cannot be undone.`}
        confirmText="Delete Link"
        isDangerous={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        isDark={isDark}
      />
    </div>
  );
};
