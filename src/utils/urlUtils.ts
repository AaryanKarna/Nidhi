export interface DetectedService {
  id: string;
  name: string;
  domainPattern: RegExp;
  brandColor: string;
  badgeBg: string;
  badgeText: string;
  iconType: string;
}

export const DETECTED_SERVICES: DetectedService[] = [
  {
    id: 'github',
    name: 'GitHub',
    domainPattern: /github\.com/i,
    brandColor: '#24292F',
    badgeBg: '#F3F4F6',
    badgeText: '#111827',
    iconType: 'github',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    domainPattern: /(youtube\.com|youtu\.be)/i,
    brandColor: '#FF0000',
    badgeBg: '#FEE2E2',
    badgeText: '#B91C1C',
    iconType: 'youtube',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    domainPattern: /instagram\.com/i,
    brandColor: '#E1306C',
    badgeBg: '#FCE7F3',
    badgeText: '#BE185D',
    iconType: 'instagram',
  },
  {
    id: 'googledrive',
    name: 'Google Drive',
    domainPattern: /drive\.google\.com/i,
    brandColor: '#1FA463',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    iconType: 'googledrive',
  },
  {
    id: 'gmail',
    name: 'Gmail',
    domainPattern: /mail\.google\.com/i,
    brandColor: '#EA4335',
    badgeBg: '#FEE2E2',
    badgeText: '#B91C1C',
    iconType: 'gmail',
  },
  {
    id: 'stackoverflow',
    name: 'Stack Overflow',
    domainPattern: /stackoverflow\.com/i,
    brandColor: '#F48024',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
    iconType: 'stackoverflow',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    domainPattern: /linkedin\.com/i,
    brandColor: '#0A66C2',
    badgeBg: '#DBEAFE',
    badgeText: '#1D4ED8',
    iconType: 'linkedin',
  },
  {
    id: 'twitter',
    name: 'X (Twitter)',
    domainPattern: /(twitter\.com|x\.com)/i,
    brandColor: '#0F1419',
    badgeBg: '#F3F4F6',
    badgeText: '#111827',
    iconType: 'twitter',
  },
  {
    id: 'reddit',
    name: 'Reddit',
    domainPattern: /reddit\.com/i,
    brandColor: '#FF4500',
    badgeBg: '#FFEDD5',
    badgeText: '#C2410C',
    iconType: 'reddit',
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    domainPattern: /tiktok\.com/i,
    brandColor: '#000000',
    badgeBg: '#F3F4F6',
    badgeText: '#111827',
    iconType: 'tiktok',
  },
  {
    id: 'figma',
    name: 'Figma',
    domainPattern: /figma\.com/i,
    brandColor: '#F24E1E',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    iconType: 'figma',
  },
  {
    id: 'notion',
    name: 'Notion',
    domainPattern: /notion\.so/i,
    brandColor: '#000000',
    badgeBg: '#F3F4F6',
    badgeText: '#111827',
    iconType: 'notion',
  },
  {
    id: 'spotify',
    name: 'Spotify',
    domainPattern: /spotify\.com/i,
    brandColor: '#1DB954',
    badgeBg: '#DCFCE7',
    badgeText: '#15803D',
    iconType: 'spotify',
  },
  {
    id: 'college',
    name: 'Campus / Academic',
    domainPattern: /(\.edu|\.ac\.|college|university|portal)/i,
    brandColor: '#4338CA',
    badgeBg: '#EEF2FF',
    badgeText: '#3730A3',
    iconType: 'college',
  },
];

/**
 * Normalizes input URL by adding https:// protocol if absent
 */
export function normalizeUrl(rawUrl: string): string {
  let trimmed = rawUrl.trim();
  if (!trimmed) return '';
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }
  return trimmed;
}

/**
 * Validates whether string is a valid URL
 */
export function isValidUrl(urlStr: string): boolean {
  if (!urlStr || urlStr.trim().length === 0) return false;
  const normalized = normalizeUrl(urlStr);
  try {
    const parsed = new URL(normalized);
    return parsed.hostname.includes('.') && parsed.hostname.length > 3;
  } catch {
    return false;
  }
}

/**
 * Extracts clean domain name, e.g. "github.com"
 */
export function extractDomain(urlStr: string): string {
  try {
    const normalized = normalizeUrl(urlStr);
    const parsed = new URL(normalized);
    let host = parsed.hostname.toLowerCase();
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    return host;
  } catch {
    return urlStr.replace(/^https?:\/\//i, '').split('/')[0] || urlStr;
  }
}

/**
 * Identifies recognized service from URL or domain
 */
export function detectService(urlStr: string): DetectedService | null {
  for (const s of DETECTED_SERVICES) {
    if (s.domainPattern.test(urlStr)) {
      return s;
    }
  }
  return null;
}

/**
 * Auto-suggests a readable title if the user hasn't provided one
 */
export function generateSuggestedTitle(urlStr: string): string {
  const service = detectService(urlStr);
  const domain = extractDomain(urlStr);

  if (service) {
    return `${service.name} Link`;
  }

  // Capitalize main domain part
  const parts = domain.split('.');
  if (parts.length > 0 && parts[0]) {
    const main = parts[0];
    return main.charAt(0).toUpperCase() + main.slice(1);
  }

  return 'Saved Link';
}

/**
 * Safely opens a link in a new browser tab/window or external browser
 */
export function openExternalUrl(urlStr: string): void {
  const normalized = normalizeUrl(urlStr);
  try {
    const a = document.createElement('a');
    a.href = normalized;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (e) {
    console.error('Error opening URL:', e);
  }
}

/**
 * Copies text to clipboard and returns success boolean
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const success = document.execCommand('copy');
      document.body.removeChild(textArea);
      return success;
    }
  } catch (err) {
    console.warn('Clipboard write failed:', err);
    return false;
  }
}
