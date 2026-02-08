import React from 'react';
import { AdminSidebar } from '../components/AdminSidebar';
import { ViewState } from '../types';

interface AdminWrapperProps {
  children: React.ReactNode;
  current: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
}

export const AdminWrapper: React.FC<AdminWrapperProps> = ({ children, current, onChangeView, onLogout }) => (
  <div className="flex h-screen w-full relative z-10 p-6 gap-6 bg-slate-100 dark:bg-background-dark overflow-hidden transition-colors duration-500">
    {/* Background Glows for Admin */}
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
       <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px]"></div>
       <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
    </div>

    <AdminSidebar currentView={current} onChangeView={onChangeView} onLogout={onLogout} />
    
    <main className="flex-1 flex flex-col gap-6 overflow-hidden relative">
      {children}
    </main>
  </div>
);