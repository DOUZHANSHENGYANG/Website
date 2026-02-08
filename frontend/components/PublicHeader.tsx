import React from 'react';
import { Config, ViewState } from '../types';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';

interface PublicHeaderProps {
  configs: Config[];
  onNavigate: (view: ViewState) => void;
  currentView?: ViewState;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ configs, onNavigate, currentView = 'home' }) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  const handleNav = (view: ViewState) => {
    onNavigate(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { id: 'home', label: t('nav.home') },
    { id: 'categories', label: t('common.category') },
    { id: 'about', label: t('nav.about') },
  ];

  const getThemeIcon = () => {
    switch(theme) {
        case 'light': return 'light_mode';
        case 'dark': return 'dark_mode';
        case 'cream': return 'icecream'; // or 'palette' or 'wb_sunny'
        default: return 'light_mode';
    }
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-5xl">
      <nav className="glass-nav px-8 py-4 rounded-3xl flex items-center justify-between shadow-2xl transition-all duration-300">
        <div 
          className="flex items-center gap-3 group cursor-pointer"
          onClick={() => handleNav('home')}
        >
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(25,93,230,0.5)] transition-colors">
            <span className="material-symbols-outlined text-[20px] text-white">blur_on</span>
          </div>
          <span className="text-lg font-extrabold tracking-tight text-slate-800 dark:text-white group-hover:text-primary transition-colors">
            {configs.find(c => c.key === 'site_title')?.value || 'Liquid Glass'}
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isCategoryFlow = (currentView === 'categories' || currentView === 'post-search');
            const isActive =
              currentView === item.id ||
              (currentView === 'post-detail' && item.id === 'home') ||
              (isCategoryFlow && item.id === 'categories');
            return (
              <button 
                key={item.id}
                onClick={() => handleNav(item.id as ViewState)} 
                className={`relative px-6 py-2 rounded-full text-sm font-bold transition-colors ${isActive ? 'text-primary' : 'text-slate-600 dark:text-white/60 hover:text-slate-900 dark:hover:text-white'}`}
              >
                {isActive && (
                   <motion.div
                     layoutId="nav-pill"
                     className="absolute inset-0 bg-slate-100 dark:bg-white/10 rounded-full"
                     transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                   />
                )}
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          <div className="relative hidden sm:block">
             <span className="material-symbols-outlined text-slate-400 dark:text-white/60 text-xl absolute left-3 top-1/2 -translate-y-1/2">search</span>
             <input 
                type="text" 
                placeholder={t('nav.search_placeholder')}
                readOnly
                tabIndex={-1}
                onFocus={(event) => event.currentTarget.blur()}
                aria-label={t('nav.search_placeholder')}
                className="bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-white/20 outline-none w-32 transition-all duration-300 cursor-default select-none"
             />
          </div>
          
          <button onClick={toggleTheme} className="text-slate-500 dark:text-white/60 hover:text-primary transition-colors p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 active:rotate-180 transition-transform duration-500">
            <span className="material-symbols-outlined text-xl">{getThemeIcon()}</span>
          </button>
          
          <button 
            onClick={() => onNavigate('login')}
            className="size-8 rounded-full bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-white transition-all border border-slate-200 dark:border-white/10"
          >
             <span className="material-symbols-outlined text-lg">person</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
