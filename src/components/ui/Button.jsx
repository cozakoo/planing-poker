export function Button({ children, variant = 'primary', size = 'md', disabled, className = '', ...props }) {
  const base = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-950 disabled:opacity-50 disabled:cursor-not-allowed'

  const variants = {
    primary: 'bg-brand-600 hover:bg-brand-500 text-white focus:ring-brand-500',
    secondary: 'bg-slate-700 hover:bg-slate-600 text-slate-100 focus:ring-slate-500',
    danger: 'bg-red-700 hover:bg-red-600 text-white focus:ring-red-500',
    ghost: 'bg-transparent hover:bg-slate-800 text-slate-300 hover:text-white focus:ring-slate-500',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2',
  }

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
}
