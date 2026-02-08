import React from 'react';
import { PublicHeader } from '../components/PublicHeader';
import { Config, ViewState } from '../types';

interface LayoutWrapperProps {
  children: React.ReactNode;
  configs: Config[];
  onNavigate: (view: ViewState) => void;
  currentView: ViewState;
}

export const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children, configs, onNavigate, currentView }) => (
  <div className="min-h-screen flex flex-col relative overflow-hidden text-slate-900 dark:text-white selection:bg-primary/30 transition-colors duration-500">
    {/* Liquid Background Orbs */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="liquid-halo halo-primary"></div>
      <div className="liquid-halo halo-secondary"></div>
      <div className="liquid-halo halo-accent"></div>
    </div>

    <PublicHeader configs={configs} onNavigate={onNavigate} currentView={currentView} />
    
    <main className="flex-1 w-full relative z-10 pt-32 pb-20 px-6 max-w-6xl mx-auto">
      {children}
    </main>
    
    <footer className="py-12 text-center border-t border-slate-200 dark:border-white/5 relative z-10 bg-white/40 dark:bg-background-dark/30 backdrop-blur-md transition-colors duration-300 mt-auto">
      <div className="flex flex-col items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="size-6 bg-slate-200 dark:bg-white/10 rounded flex items-center justify-center">
             <span className="material-symbols-outlined text-sm text-slate-600 dark:text-white">fluid</span>
          </div>
          <span className="font-bold tracking-tight text-slate-700 dark:text-white">
            {configs.find((c) => c.key === 'site_title')?.value || 'Douzhan Thoughts'}
          </span>
        </div>
        <p className="text-[10px] text-slate-500 dark:text-white/20 uppercase tracking-[0.2em]">
          {configs.find((c) => c.key === 'footer_text')?.value || '© 2026 Douzhan Thoughts · 个人博客，持续更新。'}
        </p>
      </div>
    </footer>
  </div>
);
