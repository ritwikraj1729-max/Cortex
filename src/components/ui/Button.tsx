import React from 'react';
import { cn } from '../../utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-indigo-500 text-white border-indigo-700 shadow-[0_4px_0_0_#3730a3] hover:bg-indigo-400 active:shadow-[0_1px_0_0_#3730a3]',
  secondary:
    'bg-slate-800 text-slate-100 border-slate-950 shadow-[0_4px_0_0_#020617] hover:bg-slate-700 active:shadow-[0_1px_0_0_#020617]',
  ghost: 'bg-transparent text-slate-300 border-transparent hover:bg-white/5 shadow-none',
  danger:
    'bg-rose-600 text-white border-rose-800 shadow-[0_4px_0_0_#7f1d1d] hover:bg-rose-500 active:shadow-[0_1px_0_0_#7f1d1d]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2.5 text-sm',
};

export function Button({ variant = 'secondary', size = 'md', className, children, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-xl border font-semibold tracking-wide transition-all duration-100 active:translate-y-[3px] disabled:opacity-40 disabled:pointer-events-none select-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export function IconButton({
  className,
  children,
  variant = 'ghost',
  ...rest
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-100 active:translate-y-[2px] disabled:opacity-30 disabled:pointer-events-none',
        variant === 'ghost'
          ? 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5'
          : 'border-rose-800 text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 shadow-[0_2px_0_0_#7f1d1d] active:shadow-none',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
