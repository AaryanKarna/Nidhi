import React, { useState, useEffect } from 'react';
import { 
  Link as LinkIcon, 
  Type, 
  FileText, 
  Check, 
  Clipboard, 
  FolderPlus, 
  Globe 
} from 'lucide-react';
import { Category } from '../types';
import { Header } from '../components/common/Header';
import { InputField } from '../components/common/InputField';
import { Button } from '../components/common/Button';
import { extractDomain, generateSuggestedTitle } from '../utils/urlUtils';

interface AddLinkScreenProps {
  categories: Category[];
  initialUrl?: string;
  initialCategory?: string;
  onSave: (linkData: {
    title: string;
    url: string;
    category: string;
    description?: string;
    isFavorite?: boolean;
  }) => Promise<void>;
  onCancel: () => void;
  onShowToast: (message: string) => void;
  isDark?: boolean;
}

export const AddLinkScreen: React.FC<AddLinkScreenProps> = ({
  categories,
  initialUrl = '',
  initialCategory = '',
  onSave,
  onCancel,
  onShowToast,
  isDark = false,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(initialCategory || categories[0]?.name || 'Important');
  const [description, setDescription] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorUrl, setErrorUrl] = useState('');
  const [detectedDomain, setDetectedDomain] = useState('');

  // Handle URL change & auto-metadata detection
  useEffect(() => {
    if (url.trim()) {
      const domain = extractDomain(url.trim());
      setDetectedDomain(domain);

      // Auto-suggest title if user hasn't typed one
      if (!title) {
        const suggested = generateSuggestedTitle(url.trim());
        setTitle(suggested);
      }
    } else {
      setDetectedDomain('');
    }
  }, [url]);

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setUrl(text.trim());
        setErrorUrl('');
        onShowToast('Pasted from clipboard');
      } else {
        onShowToast('Clipboard is empty');
      }
    } catch {
      onShowToast('Unable to read clipboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      setErrorUrl('Please enter or paste a valid web address');
      return;
    }

    // Basic URL format normalization
    let cleanUrl = url.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const finalTitle = title.trim() || extractDomain(cleanUrl) || 'Saved Web Link';

    setIsSubmitting(true);
    try {
      await onSave({
        url: cleanUrl,
        title: finalTitle,
        category,
        description: description.trim(),
        isFavorite,
      });
      onShowToast('Saved to your vault');
    } catch {
      onShowToast('Failed to save link');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      <Header
        title="Save New Link"
        subtitle="Saved safely on your device"
        showBack={true}
        onBack={onCancel}
        isDark={isDark}
      />

      <form
        onSubmit={handleSubmit}
        className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 flex flex-col gap-5"
      >
        {/* Main URL Input */}
        <div className="flex flex-col gap-1.5">
          <InputField
            label="Target Web Address (URL)"
            placeholder="https://example.com/article"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (errorUrl) setErrorUrl('');
            }}
            error={errorUrl}
            icon={<LinkIcon size={18} strokeWidth={2.4} />}
            rightElement={
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="p-1.5 rounded-lg border border-black bg-[#69818D] text-white shadow-[1px_1px_0px_#000] text-xs font-black flex items-center gap-1 active:translate-x-0.5 active:translate-y-0.5 cursor-pointer"
                title="Paste from clipboard"
              >
                <Clipboard size={14} strokeWidth={2.4} />
                <span>PASTE</span>
              </button>
            }
            required
            autoFocus
            isDark={isDark}
          />

          {detectedDomain && (
            <div className="flex items-center gap-1.5 text-xs font-black text-slate-500 pl-1">
              <Globe size={14} strokeWidth={2.4} />
              <span>Detected Domain: {detectedDomain}</span>
            </div>
          )}
        </div>

        {/* Title Input */}
        <InputField
          label="Link Title / Heading"
          placeholder="e.g. React Native Documentation"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          hint="Leave blank to auto-name from domain"
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
            Notes & Hashtags (Optional)
          </label>
          <div className="relative">
            <textarea
              rows={3}
              placeholder="Add key notes, summaries, or #hashtags..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full p-3 rounded-2xl text-xs font-semibold outline-none border-2 border-black shadow-[2px_2px_0px_#000] resize-none ${
                isDark
                  ? 'bg-[#151D28] text-white placeholder-slate-500 focus:ring-2 focus:ring-[#69818D]'
                  : 'bg-white text-black placeholder-slate-400 focus:ring-2 focus:ring-[#69818D]'
              }`}
            />
          </div>
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
            Save Link
          </Button>
        </div>
      </form>
    </div>
  );
};
