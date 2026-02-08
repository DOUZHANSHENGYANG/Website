import React from 'react';

interface ButtonProps {
  children?: React.ReactNode;
  onClick: (e?: any) => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  className?: string;
  disabled?: boolean;
  icon?: any;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  icon: Icon 
}) => {
  // Liquid Glass Button Styles
  const baseStyle = "px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white hover:brightness-110 shadow-[0_0_20px_rgba(25,93,230,0.3)]",
    secondary: "bg-slate-200 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-700 dark:text-white/80 hover:bg-slate-300 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white backdrop-blur-sm",
    ghost: "bg-transparent text-slate-500 dark:text-white/60 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5",
    danger: "bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-500/20 border border-red-500/20"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} disabled={disabled}>
      {Icon && <Icon size={18} />}
      {children}
    </button>
  );
};

interface InputProps {
  label: string;
  value: string | number;
  onChange: (value: any) => void;
  type?: string;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
}

export const Input: React.FC<InputProps> = ({ 
  label, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  textarea = false, 
  rows = 3 
}) => (
  <div className="mb-6 space-y-2">
    <label className="block text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1">{label}</label>
    {textarea ? (
      <textarea
        className="w-full px-5 py-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary/50 focus:ring-0 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 resize-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
      />
    ) : (
      <input
        type={type}
        className="w-full px-5 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 focus:border-primary/50 focus:ring-0 outline-none transition-all text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    )}
  </div>
);

export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title?: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-slate-900/40 dark:bg-black/60 backdrop-blur-md transition-opacity animate-in fade-in" onClick={onClose}></div>
      <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col glass-panel rounded-3xl shadow-2xl animate-in fade-in zoom-in-95 duration-200 bg-[#f8fafc]/90 dark:bg-[#0f172a]/90 border-white/20 overflow-hidden">
         {title && (
           <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/10 shrink-0">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h3>
              <button onClick={onClose} className="size-8 rounded-full flex items-center justify-center hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-white/40 transition-colors">
                 <span className="material-symbols-outlined">close</span>
              </button>
           </div>
         )}
         <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
            {children}
         </div>
      </div>
    </div>
  );
};

export const Pagination: React.FC<{ current: number; total: number; onChange: (page: number) => void }> = ({ current, total, onChange }) => {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 mt-4 shrink-0 py-2">
       <button 
         disabled={current === 1}
         onClick={() => onChange(current - 1)}
         className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-white"
       >
         <span className="material-symbols-outlined text-sm">chevron_left</span>
       </button>
       <div className="px-4 py-2 rounded-xl bg-white/50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
          <span className="text-xs font-bold text-slate-600 dark:text-white uppercase tracking-widest">
              {current} / {total}
          </span>
       </div>
       <button 
         disabled={current === total}
         onClick={() => onChange(current + 1)}
         className="size-10 flex items-center justify-center rounded-xl border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-slate-600 dark:text-white"
       >
         <span className="material-symbols-outlined text-sm">chevron_right</span>
       </button>
    </div>
  );
};