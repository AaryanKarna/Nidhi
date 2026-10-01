import React from 'react';
import { 
  ExternalLink, 
  Copy, 
  Edit3, 
  Trash2, 
  Star, 
  Calendar, 
  Folder, 
  Eye, 
  ShieldCheck,
  Share2
} from 'lucide-react';
import { SavedLink } from '../types';
import { Header } from '../components/common/Header';
import { Button } from '../components/common/Button';
import { ServiceIcon } from '../components/links/ServiceIcon';
import { openExternalUrl, copyToClipboard } from '../utils/urlUtils';

interface LinkDetailsScreenProps {
  link: SavedLink;
  onBack: () => void;
  onEdit: (link: SavedLink) => void;
  onDelete: (link: SavedLink) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onShowToast: (message: string) => void;
  isDark?: boolean;
}

export const LinkDetailsScreen: React.FC<LinkDetailsScreenProps> = ({
  link,
  onBack,
  onEdit,
  onDelete,
  onToggleFavorite,
  onShowToast,
  isDark = false,
}) => {
  const handleOpen = () => {
    openExternalUrl(link.url);
    onShowToast('Opening in browser...');
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(link.url);
    if (ok) {
      onShowToast('Full URL copied to clipboard');
    }
  };

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: link.title || 'Saved Link',
          url: link.url,
        });
        onShowToast('Shared successfully!');
        return;
      } catch {}
    }
    const ok = await copyToClipboard(link.url);
    if (ok) {
      onShowToast('Link copied to clipboard!');
    }
  };

  const formattedDate = new Date(link.createdAt).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden select-none">
      <Header
        title="Link Details"
        showBack={true}
        onBack={onBack}
        isDark={isDark}
        rightAction={
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-[#FFCE31] text-black border border-black shadow-[1px_1px_0px_#000] hover:bg-[#FFD54F] transition-all cursor-pointer"
              title="Share Link"
            >
              <Share2 size={18} strokeWidth={2.6} />
            </button>
            <button
              onClick={(e) => onToggleFavorite(link.id, e)}
              className={`p-2 rounded-xl border border-black shadow-[1px_1px_0px_#000] transition-colors ${
                link.isFavorite
                  ? 'bg-[#FFCE31] text-black'
                  : 'bg-white text-slate-400'
              }`}
              title="Toggle Favorite"
            >
              <Star
                size={18}
                strokeWidth={2.4}
                className={link.isFavorite ? 'fill-black text-black' : ''}
              />
            </button>
            <button
              onClick={() => onEdit(link)}
              className="p-2 rounded-xl bg-white dark:bg-slate-800 text-black dark:text-white border border-black shadow-[1px_1px_0px_#000]"
              title="Edit Link"
            >
              <Edit3 size={18} strokeWidth={2.4} />
            </button>
            <button
              onClick={() => onDelete(link)}
              className="p-2 rounded-xl bg-red-100 text-red-600 border border-black shadow-[1px_1px_0px_#000]"
              title="Delete Link"
            >
              <Trash2 size={18} strokeWidth={2.4} />
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 flex flex-col gap-5">
        {/* Hero Card */}
        <div
          className={`p-6 rounded-3xl border-2 border-black flex flex-col items-center text-center shadow-[3px_3px_0px_#000] transition-colors ${
            isDark
              ? 'bg-[#131B2E] text-white'
              : 'bg-white text-black'
          }`}
        >
          <div className="rounded-2xl border-2 border-black overflow-hidden shadow-[2px_2px_0px_#000] mb-4">
            <ServiceIcon url={link.url} serviceId={link.serviceId} size="xl" />
          </div>

          <h2 className="text-xl font-black tracking-tight max-w-xs leading-snug">
            {link.title}
          </h2>

          <span className="inline-block text-xs font-mono font-bold px-3 py-1 rounded-full mt-2.5 bg-slate-100 dark:bg-slate-800 text-black dark:text-white border border-black">
            {link.domain}
          </span>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 mt-6 w-full max-w-xs">
            <Button
              variant="primary"
              size="md"
              className="flex-1"
              icon={<ExternalLink size={18} strokeWidth={2.5} />}
              onClick={handleOpen}
              isDark={isDark}
            >
              Open Link
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<Share2 size={18} strokeWidth={2.5} />}
              onClick={handleShare}
              isDark={isDark}
              title="Share link"
            >
              Share
            </Button>
            <Button
              variant="secondary"
              size="md"
              icon={<Copy size={18} strokeWidth={2.4} />}
              onClick={handleCopy}
              isDark={isDark}
              title="Copy to clipboard"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Detailed Metadata Grid */}
        <div
          className={`rounded-3xl border-2 border-black p-5 flex flex-col gap-4 shadow-[3px_3px_0px_#000] ${
            isDark
              ? 'bg-[#131B2E] text-white'
              : 'bg-white text-black'
          }`}
        >
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
            Information & Attributes
          </h3>

          {/* Category */}
          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 font-bold">
              <Folder size={16} />
              <span>Category</span>
            </div>
            <span className="font-black px-2.5 py-0.5 rounded-md text-xs bg-[#FFCE31] text-black border border-black shadow-[1px_1px_0px_#000]">
              {link.category}
            </span>
          </div>

          {/* Full URL */}
          <div className="flex flex-col gap-1 py-1 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-500 font-bold">Full Address URL</span>
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs break-all select-all font-bold text-black dark:text-[#FFCE31]">
                {link.url}
              </span>
              <button
                onClick={handleCopy}
                className="p-1 rounded-md text-black dark:text-white hover:opacity-75"
                title="Copy URL"
              >
                <Copy size={14} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* Date Added */}
          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 font-bold">
              <Calendar size={16} />
              <span>Date Added</span>
            </div>
            <span className="font-bold text-xs font-mono">{formattedDate}</span>
          </div>

          {/* Access / Visit Count */}
          <div className="flex items-center justify-between text-sm py-1 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 text-slate-500 font-bold">
              <Eye size={16} />
              <span>Times Accessed</span>
            </div>
            <span className="font-black text-xs">{link.visitCount || 0} visits</span>
          </div>

          {/* Privacy Guarantee Note */}
          <div className="flex items-center gap-2 text-xs text-black dark:text-[#FFCE31] font-bold pt-1">
            <ShieldCheck size={16} strokeWidth={2.5} className="shrink-0" />
            <span>Stored 100% locally on this device. Never uploaded.</span>
          </div>
        </div>

        {/* Description Section */}
        {link.description && (
          <div
            className={`rounded-3xl border-2 border-black p-5 shadow-[3px_3px_0px_#000] ${
              isDark
                ? 'bg-[#131B2E] text-white'
                : 'bg-white text-black'
            }`}
          >
            <h3 className="text-xs font-black uppercase tracking-wider mb-2 text-slate-500">
              Notes & Description
            </h3>
            <p className="text-sm font-semibold leading-relaxed whitespace-pre-wrap">
              {link.description}
            </p>
          </div>
        )}

        {/* Bottom Action Footer */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            size="md"
            icon={<Edit3 size={17} strokeWidth={2.4} />}
            className="flex-1"
            onClick={() => onEdit(link)}
            isDark={isDark}
          >
            Edit Link
          </Button>
          <Button
            variant="danger"
            size="md"
            icon={<Trash2 size={17} strokeWidth={2.4} />}
            className="flex-1"
            onClick={() => onDelete(link)}
            isDark={isDark}
          >
            Delete Link
          </Button>
        </div>
      </div>
    </div>
  );
};
