import React from 'react';

interface LiquidGlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'accent' | 'subtle';
  size?: 'sm' | 'md' | 'lg' | 'pill';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export const LiquidGlassButton: React.FC<LiquidGlassButtonProps> = ({
  variant = 'default',
  size = 'md',
  children,
  icon,
  className = '',
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-xl',
    md: 'px-4 py-2 text-sm gap-2 rounded-2xl',
    lg: 'px-6 py-3 text-base gap-2.5 rounded-2xl',
    pill: 'px-5 py-2 text-xs font-medium tracking-wide uppercase rounded-full gap-2',
  }[size];

  const variantClasses = {
    default:
      'bg-white/[0.08] hover:bg-white/[0.14] text-white border border-white/20 shadow-[0_1px_2px_rgba(255,255,255,0.2)_inset,0_4px_16px_rgba(0,0,0,0.3)]',
    primary:
      'bg-gradient-to-b from-white/25 to-white/10 hover:from-white/35 hover:to-white/15 text-white border border-white/35 shadow-[0_1px_1px_rgba(255,255,255,0.45)_inset,0_6px_24px_rgba(0,0,0,0.4)]',
    accent:
      'bg-gradient-to-b from-emerald-500/25 to-teal-500/10 hover:from-emerald-500/35 hover:to-teal-500/20 text-emerald-100 border border-emerald-400/35 shadow-[0_1px_2px_rgba(52,211,153,0.3)_inset,0_6px_20px_rgba(16,185,129,0.25)]',
    subtle:
      'bg-black/20 hover:bg-black/35 text-white/80 hover:text-white border border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.2)]',
  }[variant];

  return (
    <button
      className={`relative group inline-flex items-center justify-center font-medium backdrop-blur-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {/* Refractive top sheen overlay */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/20 to-transparent rounded-t-2xl opacity-70 group-hover:opacity-100 transition-opacity" />
      {icon && <span className="relative z-10 shrink-0">{icon}</span>}
      <span className="relative z-10 whitespace-nowrap">{children}</span>
    </button>
  );
};
