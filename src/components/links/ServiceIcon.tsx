import React from 'react';
import { 
  Globe, 
  GraduationCap, 
  Folder, 
  ExternalLink,
  Code2, 
  Mail, 
  Video, 
  FileText 
} from 'lucide-react';
import { detectService } from '../../utils/urlUtils';

interface ServiceIconProps {
  url?: string;
  serviceId?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ServiceIcon: React.FC<ServiceIconProps> = ({
  url = '',
  serviceId,
  size = 'md',
  className = '',
}) => {
  const service = detectService(url);
  const effectiveId = serviceId || service?.id;

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs rounded-lg',
    md: 'w-10 h-10 text-sm rounded-xl',
    lg: 'w-12 h-12 text-base rounded-2xl',
    xl: 'w-16 h-16 text-lg rounded-2xl',
  }[size];

  const iconSizes = {
    sm: 14,
    md: 18,
    lg: 22,
    xl: 28,
  }[size];

  // Specific service renderings with authentic brand aesthetics
  switch (effectiveId) {
    case 'github':
      return (
        <div className={`${sizeClasses} bg-black text-white flex items-center justify-center font-bold shadow-xs shrink-0 ${className}`}>
          <svg className="w-3/5 h-3/5 fill-current" viewBox="0 0 24 24">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
        </div>
      );
    case 'youtube':
      return (
        <div className={`${sizeClasses} bg-red-600 text-white flex items-center justify-center shadow-xs shrink-0 ${className}`}>
          <svg className="w-3/5 h-3/5 fill-current" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        </div>
      );
    case 'docs':
      return (
        <div className={`${sizeClasses} bg-[#69818D] text-white border border-black flex items-center justify-center font-bold shadow-xs shrink-0 ${className}`}>
          <FileText size={iconSizes} />
        </div>
      );
    case 'university':
      return (
        <div className={`${sizeClasses} bg-[#69818D] text-white border border-black flex items-center justify-center font-bold shadow-xs shrink-0 ${className}`}>
          <GraduationCap size={iconSizes} />
        </div>
      );
    case 'twitter':
      return (
        <div className={`${sizeClasses} bg-black text-white border border-black flex items-center justify-center font-bold shadow-xs shrink-0 ${className}`}>
          <span className="font-sans font-black text-xs">𝕏</span>
        </div>
      );
    case 'reddit':
      return (
        <div className={`${sizeClasses} bg-black text-[#69818D] border border-black flex items-center justify-center font-bold shadow-xs shrink-0 ${className}`}>
          <svg className="w-3/5 h-3/5 fill-current" viewBox="0 0 24 24">
            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.703zM9.25 12C8.56 12 8 12.56 8 13.25c0 .688.56 1.25 1.25 1.25.688 0 1.249-.562 1.249-1.25 0-.69-.56-1.25-1.25-1.25zm5.5 0c-.687 0-1.248.56-1.248 1.25 0 .688.561 1.25 1.248 1.25.69 0 1.25-.562 1.25-1.25 0-.69-.56-1.25-1.25-1.25zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
          </svg>
        </div>
      );
    case 'tiktok':
      return (
        <div className={`${sizeClasses} bg-black text-[#69818D] border border-black flex items-center justify-center font-bold shadow-xs shrink-0 ${className}`}>
          <Video size={iconSizes} />
        </div>
      );
    default:
      return (
        <div className={`${sizeClasses} bg-[#69818D] text-white border border-black flex items-center justify-center font-black shadow-xs shrink-0 ${className}`}>
          <Globe size={iconSizes} strokeWidth={2.4} />
        </div>
      );
  }
};
