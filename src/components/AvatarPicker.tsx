import React from 'react';
import { TEACHERS } from '../data/teachers';

interface AvatarPickerProps {
  activeIndex: number;
  onSelect: (index: number) => void;
}

export const AvatarPicker: React.FC<AvatarPickerProps> = ({ activeIndex, onSelect }) => {
  return (
    <div className="flex items-end gap-2 sm:gap-3 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden pb-1 sm:overflow-visible sm:pb-0">
      {TEACHERS.map((teacher, index) => {
        const isActive = activeIndex === index;
        return (
          <button
            key={teacher.id}
            type="button"
            aria-label={`Show ${teacher.name}`}
            onClick={() => onSelect(index)}
            className="group flex shrink-0 flex-col items-center gap-2 cursor-pointer focus:outline-none"
          >
            {/* Active indicator dot: fades in/out in place */}
            <span
              className={`h-1 w-1 rounded-full bg-white transition-opacity duration-300 ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Circular thumbnail with liquid glass edge */}
            <span
              className={`relative block h-10 w-10 sm:h-14 sm:w-14 overflow-hidden rounded-full transition-all duration-300 ${
                isActive
                  ? 'ring-2 ring-white ring-offset-2 ring-offset-black/40 scale-105 shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                  : 'opacity-70 group-hover:opacity-100 group-hover:scale-105 ring-1 ring-white/20'
              }`}
            >
              <img
                src={teacher.imageUrl}
                alt={teacher.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {/* Glass subtle gloss overlay */}
              <span className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/25" />
            </span>
          </button>
        );
      })}
    </div>
  );
};
