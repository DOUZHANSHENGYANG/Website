import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface AdminSidebarProps {
  currentView: string;
  onChangeView: (view: any) => void;
  onLogout: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentView, onChangeView, onLogout }) => {
  const { t } = useLanguage();
  
  const items = [
    { id: 'admin-dashboard', label: t('admin.dashboard'), icon: 'dashboard' },
    { id: 'admin-posts', label: t('admin.post_mgmt'), icon: 'description' },
    { id: 'admin-categories', label: t('admin.cat_mgmt'), icon: 'category' },
    { id: 'admin-settings', label: t('admin.site_mgmt'), icon: 'settings' },
  ];

  return (
    <aside className="w-72 h-full flex flex-col glass-panel rounded-2xl overflow-hidden p-6 transition-all border-slate-200 dark:border-white/10 shrink-0">
      <div className="flex items-center gap-4 mb-12 px-2">
        <div className="size-10 bg-primary rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(25,93,230,0.4)]">
          <span className="material-symbols-outlined text-white">blur_on</span>
        </div>
        <div>
          <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Liquid Glass</h1>
          <p className="text-xs text-slate-500 dark:text-white/40 uppercase tracking-widest font-bold">{t('admin.console')}</p>
        </div>
      </div>
      
      <nav className="flex-1 space-y-2">
        {items.map(item => {
          const isActive = currentView === item.id || (item.id === 'admin-posts' && currentView === 'post-editor');
          return (
            <div
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all cursor-pointer ${
                isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-500 dark:text-white/60 hover:bg-slate-200 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-200 dark:border-white/5">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-slate-200/50 dark:bg-white/5 border border-slate-200 dark:border-white/5 cursor-pointer hover:bg-slate-300 dark:hover:bg-white/10 transition-colors" onClick={onLogout}>
          <div className="size-10 rounded-xl bg-center bg-cover border border-slate-300 dark:border-white/10 bg-gradient-to-br from-primary to-purple-600"></div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-slate-900 dark:text-white">{t('admin.admin_user')}</p>
            <p className="text-[10px] text-slate-500 dark:text-white/40 uppercase font-bold tracking-tighter">{t('admin.logout')}</p>
          </div>
          <span className="material-symbols-outlined text-slate-400 dark:text-white/40 text-lg">logout</span>
        </div>
      </div>
    </aside>
  );
};