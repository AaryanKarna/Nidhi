import React, { useState } from 'react';
import {
  X,
  Check,
  Folder,
  Star,
  Heart,
  Bookmark,
  Music,
  Camera,
  Flag,
  Moon,
  Sun,
  Cloud,
  MapPin,
  Calendar,
  Globe,
  Gift,
  Leaf,
  Briefcase,
  ShoppingCart,
  Plane,
  Car,
  Coffee,
  Film,
  Headphones,
  Palette,
  MoreHorizontal,
} from 'lucide-react';
import { Category } from '../../types';

interface AddCollectionBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (cat: Omit<Category, 'id'>) => void;
  isDark?: boolean;
}

export const AddCollectionBottomSheet: React.FC<AddCollectionBottomSheetProps> = ({
  isOpen,
  onClose,
  onCreate,
  isDark = false,
}) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FFCE31');
  const [selectedIcon, setSelectedIcon] = useState('Folder');

  if (!isOpen) return null;

  // 16 curated theme colors matching Screenshot 3
  const colors = [
    // Row 1
    '#FFCE31', // 1: Golden Yellow (default)
    '#FF5A79', // 2: Coral Pink
    '#A855F7', // 3: Purple
    '#4A85F6', // 4: Sky Blue
    '#00C49F', // 5: Teal / Emerald
    '#48BB78', // 6: Green
    '#9EDC39', // 7: Lime
    '#FF7A30', // 8: Orange
    // Row 2
    '#F8DE7E', // 9: Cream
    '#CBD5E1', // 10: Light Gray
    '#708A9E', // 11: Slate
    '#C077B0', // 12: Mauve
    '#A77B52', // 13: Tan
    '#334155', // 14: Dark Slate
    '#FF6B6B', // 15: Coral Red
    '#7C78FB', // 16: Periwinkle
  ];

  // 24 Lucide icons (3 rows of 8) matching Screenshot 3
  const iconList = [
    // Row 1
    { name: 'Folder', Icon: Folder },
    { name: 'Star', Icon: Star },
    { name: 'Heart', Icon: Heart },
    { name: 'Bookmark', Icon: Bookmark },
    { name: 'Music', Icon: Music },
    { name: 'Camera', Icon: Camera },
    { name: 'Flag', Icon: Flag },
    { name: 'Moon', Icon: Moon },
    // Row 2
    { name: 'Sun', Icon: Sun },
    { name: 'Cloud', Icon: Cloud },
    { name: 'MapPin', Icon: MapPin },
    { name: 'Calendar', Icon: Calendar },
    { name: 'Globe', Icon: Globe },
    { name: 'Gift', Icon: Gift },
    { name: 'Leaf', Icon: Leaf },
    { name: 'Briefcase', Icon: Briefcase },
    // Row 3
    { name: 'ShoppingCart', Icon: ShoppingCart },
    { name: 'Plane', Icon: Plane },
    { name: 'Car', Icon: Car },
    { name: 'Coffee', Icon: Coffee },
    { name: 'Film', Icon: Film },
    { name: 'Headphones', Icon: Headphones },
    { name: 'Palette', Icon: Palette },
    { name: 'MoreHorizontal', Icon: MoreHorizontal },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreate({
      name: name.trim(),
      color: selectedColor,
      icon: selectedIcon,
      description: '',
    });

    setName('');
    setSelectedColor('#FFCE31');
    setSelectedIcon('Folder');
  };

  const isFormValid = name.trim().length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center select-none">
      {/* Dimmed backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-Up Bottom Sheet Modal matching Screenshot 3 */}
      <div
        className={`relative z-10 w-full max-w-lg rounded-t-[32px] border-t-2 border-x-2 border-black p-6 pb-8 shadow-[0px_-4px_24px_rgba(0,0,0,0.3)] animate-slide-up flex flex-col max-h-[90vh] overflow-y-auto no-scrollbar ${
          isDark ? 'bg-[#0B0F15] text-white' : 'bg-white text-black'
        }`}
      >
        {/* Header: Title + Circular Close Icon */}
        <div className="flex items-center justify-between pb-2 mb-2">
          <h3 className="text-xl font-black tracking-tight">Add new collection</h3>
          <button
            type="button"
            onClick={onClose}
            className={`w-9 h-9 rounded-full border-2 border-black flex items-center justify-center shadow-[1px_1px_0px_#000] active:translate-x-0.5 active:translate-y-0.5 cursor-pointer ${
              isDark ? 'bg-[#151D28] text-white' : 'bg-white text-black'
            }`}
            title="Close"
          >
            <X size={18} strokeWidth={2.8} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Text Input with 0/40 counter on top right */}
          <div>
            <div className="flex justify-end mb-1">
              <span className="text-xs font-bold text-slate-400">
                {name.length}/40
              </span>
            </div>
            <input
              type="text"
              autoFocus
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Travel, Design Inspiration..."
              className={`w-full h-13 px-4 rounded-2xl border-2 border-black font-semibold text-sm outline-none shadow-[2px_2px_0px_#000] focus:ring-2 focus:ring-[#FFCE31] ${
                isDark ? 'bg-[#151D28] text-white placeholder-slate-500' : 'bg-white text-black placeholder-slate-400'
              }`}
            />
          </div>

          {/* Color Picker: 2 rows of 8 rounded squares */}
          <div className="grid grid-cols-8 gap-2 pt-1">
            {colors.map((color) => {
              const isSelected = selectedColor.toLowerCase() === color.toLowerCase();
              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  style={{ backgroundColor: color }}
                  className={`aspect-square rounded-xl border-2 border-black flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'shadow-[1.5px_1.5px_0px_#000] scale-105'
                      : 'hover:scale-105 opacity-90 hover:opacity-100'
                  }`}
                >
                  {isSelected && (
                    <Check
                      size={16}
                      strokeWidth={3.5}
                      className="text-black"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Icon Picker: 3 rows of 8 icons */}
          <div className="grid grid-cols-8 gap-2 pt-1">
            {iconList.map(({ name: iconName, Icon }) => {
              const isSelected = selectedIcon === iconName;
              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={`aspect-square rounded-xl border-2 border-black flex items-center justify-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFCE31] text-black shadow-[1.5px_1.5px_0px_#000] scale-105'
                      : isDark
                      ? 'bg-[#151D28] text-slate-300 hover:bg-[#1E2938]'
                      : 'bg-white text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={17} strokeWidth={2.4} />
                </button>
              );
            })}
          </div>

          {/* Dark Create collection Button matching Screenshot 3 */}
          <div className="pt-3">
            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-4 rounded-2xl font-black text-sm border-2 border-black transition-all flex items-center justify-center shadow-[3px_3px_0px_#000] ${
                isFormValid
                  ? 'bg-[#1E293B] text-white hover:bg-[#2A374A] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#000] cursor-pointer'
                  : 'bg-[#1E293B]/60 text-slate-400 cursor-not-allowed'
              }`}
            >
              Create collection
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
