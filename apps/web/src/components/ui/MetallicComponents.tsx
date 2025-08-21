import React from 'react';

/**
 * Advanced Design System - Metallic Components
 * - Accessible, typed, Tailwind-friendly components
 * - Small, dependency-free implementations to be extended by designers
 */

export const ChromeSeparator: React.FC<{ className?: string }> = ({ className }) => (
  <hr className={`border-transparent bg-gradient-to-r from-transparent via-[#00ffff] to-transparent h-0.5 ${className || ''}`} />
);

export const MetallicBadge: React.FC<{
  children: React.ReactNode;
  variant?: 'tech'|'chrome'|'default';
  size?: 'sm'|'md'|'lg'|'xl';
  animated?: boolean;
  className?: string;
}> = ({ children, variant='default', size='md', animated=false, className }) => {
  const base = 'inline-flex items-center rounded-full font-semibold';
  const sizeMap: Record<string,string> = { sm: 'px-2 py-0.5 text-xs', md: 'px-3 py-1 text-sm', lg: 'px-4 py-1.5 text-sm', xl: 'px-6 py-3 text-base' };
  const variants: Record<string,string> = {
    tech: `bg-gradient-to-r from-[#00ffff]/20 to-[#7c3aed]/20 text-[#00ffff] border border-[#00ffff]/30`,
    chrome: 'bg-white/5 text-white border border-white/10',
    default: 'bg-gray-800 text-gray-100'
  };
  return (
    <span className={`${base} ${sizeMap[size]} ${variants[variant]} ${animated ? 'animate-pulse' : ''} ${className || ''}`}>{children}</span>
  );
};

export const MetallicButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'tech'|'outline'|'ghost'|'chrome';
  size?: 'sm'|'md'|'lg'|'xl';
  icon?: React.ReactNode;
  iconPosition?: 'left'|'right';
  loading?: boolean;
  fullWidth?: boolean;
}> = ({ children, variant='tech', size='md', className, icon, iconPosition='left', loading, fullWidth, type='button', ...rest }) => {
  const sizes: Record<string,string> = { sm: 'py-1 px-3 text-sm', md: 'py-2 px-4 text-base', lg: 'py-3 px-6 text-lg', xl: 'py-4 px-8 text-xl' };
  const variants: Record<string,string> = {
    tech: 'bg-gradient-to-r from-[#00ffff] to-[#7c3aed] text-black shadow-lg hover:brightness-105',
    outline: 'bg-transparent border border-[#00ffff]/30 text-[#00ffff]',
    ghost: 'bg-transparent text-white/90 hover:bg-white/5',
    chrome: 'bg-white text-black'
  };

  return (
    <button
      type={type as any}
      className={`inline-flex items-center justify-center gap-2 rounded-xl ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : ''} ${className || ''}`}
      disabled={rest.disabled}
      {...rest}
    >
      {loading ? (
        <span className="animate-spin inline-block w-4 h-4 border-2 border-white/20 border-t-white rounded-full" />
      ) : icon && iconPosition === 'left' ? <span className="inline-flex">{icon}</span> : null}
      <span>{children}</span>
      {icon && iconPosition === 'right' ? <span className="inline-flex">{icon}</span> : null}
    </button>
  );
};

export const MetallicCard: React.FC<React.HTMLAttributes<HTMLDivElement> & { glow?: 'subtle'|'medium'|'intense'|string; interactive?: boolean }> = ({ children, className, glow, interactive, ...rest }) => {
  const glowClass = glow === 'intense' ? 'shadow-[0_10px_30px_rgba(0,255,255,0.08)] ring-1 ring-[#00ffff]/20' : glow === 'medium' ? 'shadow-md ring-0' : glow === 'subtle' ? 'shadow-sm' : '';
  return (
    <div
      className={`rounded-2xl bg-white/3 backdrop-blur-sm border border-white/6 p-4 ${glowClass} ${interactive ? 'cursor-pointer hover:scale-[1.01] transition-transform' : ''} ${className || ''}`}
      {...rest}
    >
      {children}
    </div>
  );
};

export const SectionHeading: React.FC<{ title: string; subtitle?: string; centered?: boolean; align?: 'left'|'center'|'right'|string; className?: string }> = ({ title, subtitle, centered, align, className }) => {
  const isCentered = centered || align === 'center' || align === 'centre';
  const alignClass = isCentered ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  return (
    <div className={`${alignClass} ${className || ''}`}>
      <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">{title}</h2>
      {subtitle && <p className="text-sm text-gray-300 max-w-xl mx-auto">{subtitle}</p>}
    </div>
  );
};

// Small, accessible input
export const MetallicInput: React.FC<{
  id?: string;
  label?: string;
  name?: string;
  type?: string;
  value?: any;
  onChange?: React.ChangeEventHandler<any>;
  placeholder?: string;
  error?: string;
  className?: string;
  icon?: React.ReactNode;
  required?: boolean;
}> = ({ id, label, name, type='text', value, onChange, placeholder, error, className, icon, required }) => {
  const inputId = id || name || `input-${Math.random().toString(36).slice(2,7)}`;
  return (
    <label className={`block ${className || ''}`} htmlFor={inputId}>
      {label && <div className="text-sm font-medium mb-1">{label}</div>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange as any}
          placeholder={placeholder}
          required={required}
          className={`w-full rounded-xl bg-white/5 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 ${icon ? 'pl-11' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
        />
      </div>
      {error && <div id={`${inputId}-error`} className="text-xs text-red-400 mt-1">{error}</div>}
    </label>
  );
};

export const MetallicToggle: React.FC<{
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}> = ({ checked=false, onChange, label }) => (
  <label className="inline-flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange && onChange(e.target.checked)}
      className="sr-only"
    />
    <span className={`w-10 h-6 rounded-full transition-colors ${checked ? 'bg-[#00ffff]' : 'bg-gray-500/40'}`} />
    {label && <span className="text-sm">{label}</span>}
  </label>
);

export const MetallicProgress: React.FC<{ value: number; max?: number; className?: string; size?: 'sm'|'md'|'lg'|'xl'; showValue?: boolean; variant?: string; label?: string }> = ({ value=0, max=100, className, size='md', showValue=false, label }) => {
  const height = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-4' : size === 'xl' ? 'h-5' : 'h-3';
  const percent = Math.round((value / (max || 100)) * 100);
  return (
    <div className={`w-full bg-white/6 rounded-xl overflow-hidden ${className || ''}`}>
      <div className={`${height} bg-gradient-to-r from-[#00ffff] to-[#7c3aed] transition-all`} style={{ width: `${Math.min(100, Math.max(0, percent))}%` }} />
      {showValue && <div className="text-xs text-gray-300 mt-1">{percent}%</div>}
      {label && <div className="text-xs text-gray-300 mt-1">{label}</div>}
    </div>
  );
};

export const AmbientLighting: React.FC<{ className?: string }> = ({ className }) => (
  <div aria-hidden className={`pointer-events-none ${className || ''}`} />
);

export const MetallicStat: React.FC<{ label: string; value: string | number; className?: string; icon?: React.ReactNode; animated?: boolean }> = ({ label, value, className, icon, animated }) => (
  <div className={`text-center ${className || ''}`}>
    {icon && <div className={`mb-2 ${animated ? 'animate-pulse' : ''}`}>{icon}</div>}
    <div className="text-2xl font-bold">{value}</div>
    <div className="text-xs text-gray-300">{label}</div>
  </div>
);

export default {};
