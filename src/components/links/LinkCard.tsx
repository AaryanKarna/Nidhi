import React from 'react';
import { Star, ArrowUpRight } from 'lucide-react';
import { SavedLink } from '../../types';
import { ServiceIcon } from './ServiceIcon';
import { openExternalUrl } from '../../utils/urlUtils';

interface LinkCardProps {
  link: SavedLink;
  onSelect: (link: SavedLink) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onShowToast: (message: string) => void;
  isDark?: boolean;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  onSelect,
  onToggleFavorite,
  onShowToast,
  isDark = false,
}) => {
  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    openExternalUrl(link.url);
  };

  return (
    <div
      onClick={() => onSelect(link)}
      className={`group relative rounded-2xl p-4 transition-all cursor-pointer border-2 border-black shadow-[2px_2px_0px_#000] hover:shadow-[3px_3px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 ${
        isDark
          ? 'bg-[#111622] text-white hover:bg-[#161D2B]'
          : 'bg-white text-black hover:bg-slate-50'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Service/Domain Icon */}
        <div className="rounded-xl border border-black overflow-hidden shrink-0 shadow-[1px_1px_0px_#000]">
          <ServiceIcon url={link.url} serviceId={link.serviceId} size="md" />
        </div>

        {/* Link Info */}
        <div className="flex-1 min-w-0 pr-1">
          <div className="flex items-center gap-2">
            <h3 className="font-black text-sm sm:text-base leading-tight truncate">
              {link.title}
            </h3>
          </div>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span
              className={`text-xs font-mono font-bold truncate ${
                isDark ? 'text-slate-400' : 'text-slate-500'
              }`}
            >
              {link.domain}
            </span>
            <span className="text-[10px] text-slate-400">•</span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-black bg-[#69818D] text-white border border-black shadow-[1px_1px_0px_#000]">
              {link.category}
            </span>
          </div>

          {link.description && (
            <p
              className={`text-xs font-medium mt-2 line-clamp-1 ${
                isDark ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {link.description}
            </p>
          )}
        </div>

        {/* Action Buttons: Favorite and Open */}
        <div className="flex items-center gap-1 shrink-0 pt-0.5">
          <button
            type="button"
            onClick={(e) => onToggleFavorite(link.id, e)}
            className={`p-2 rounded-xl border border-black shadow-[1px_1px_0px_#000] transition-colors cursor-pointer ${
              link.isFavorite
                ? 'bg-[#69818D] text-white'
                : isDark
                ? 'bg-[#18202E] text-slate-400 hover:text-white'
                : 'bg-white text-slate-400 hover:text-black'
            }`}
            title={link.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            aria-label="Toggle favorite"
          >
            <Star
              size={16}
              strokeWidth={2.4}
              className={link.isFavorite ? 'fill-white text-white' : ''}
            />
          </button>

          <button
            type="button"
            onClick={handleOpen}
            className="p-2 rounded-xl bg-white dark:bg-[#18202E] text-black dark:text-white border border-black shadow-[1px_1px_0px_#000] hover:bg-[#69818D] hover:text-white transition-colors cursor-pointer"
            title="Open link in browser"
            aria-label="Open link"
          >
            <ArrowUpRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
};
