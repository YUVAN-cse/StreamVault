export function Button({ children, variant = 'primary', size = 'md', loading, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed';
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
  const variants = {
    primary: 'bg-brand-red text-white hover:bg-red-600 active:scale-95',
    secondary: 'bg-brand-muted text-brand-text hover:bg-brand-border',
    ghost: 'text-brand-sub hover:text-brand-text hover:bg-brand-card',
    danger: 'bg-red-900/30 text-red-400 hover:bg-red-900/50 border border-red-900/50',
    outline: 'border border-brand-border text-brand-sub hover:border-brand-red/50 hover:text-brand-text',
  };

  return (
    <button className={`${base} ${sizes[size]} ${variants[variant]} ${className}`} disabled={loading} {...props}>
      {loading && (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      )}
      {children}
    </button>
  );
}

export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm text-brand-sub">{label}</label>}
      <input
        className={`w-full px-3 py-2.5 rounded-lg bg-brand-card border ${error ? 'border-red-500' : 'border-brand-border'} text-brand-text placeholder:text-brand-sub/60 text-sm transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm text-brand-sub">{label}</label>}
      <textarea
        className={`w-full px-3 py-2.5 rounded-lg bg-brand-card border ${error ? 'border-red-500' : 'border-brand-border'} text-brand-text placeholder:text-brand-sub/60 text-sm resize-none transition-colors ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}

export function Avatar({ src, name, size = 'md', className = '' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-9 h-9 text-sm', lg: 'w-14 h-14 text-lg', xl: 'w-20 h-20 text-2xl' };
  const initials = name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className={`${sizes[size]} rounded-full overflow-hidden shrink-0 ring-1 ring-brand-border ${className}`}>
      {src
        ? <img src={src} alt={name} className="w-full h-full object-cover" />
        : <div className="w-full h-full bg-brand-red flex items-center justify-center font-bold text-white">{initials}</div>
      }
    </div>
  );
}
