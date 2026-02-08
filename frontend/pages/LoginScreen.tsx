import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '../components/UI';
import { useLanguage } from '../context/LanguageContext';

interface LoginScreenProps {
  onLogin: (u: string, p: string) => Promise<boolean>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const { t } = useLanguage();
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onLogin(user, pass);
    if (success) {
      setError('');
    } else {
      setError(t('login.invalid'));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-background-dark relative overflow-hidden transition-colors duration-500">
       {/* Liquid Background Blobs */}
       <div className="fixed inset-0 overflow-hidden pointer-events-none">
         <div className="liquid-halo halo-primary"></div>
         <div className="liquid-halo halo-secondary"></div>
         <div className="liquid-halo halo-accent"></div>
       </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md glass-panel p-10 rounded-3xl"
      >
        <div className="text-center mb-10">
          <div className="size-16 bg-primary rounded-2xl mx-auto mb-6 shadow-[0_0_30px_rgba(25,93,230,0.4)] flex items-center justify-center text-white font-bold text-2xl">
            <span className="material-symbols-outlined text-3xl">blur_on</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Liquid Glass</h1>
          <p className="text-slate-500 dark:text-white/40 text-sm">{t('login.subtitle')}</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input label={t('login.username')} value={user} onChange={setUser} placeholder="admin" />
          <Input label={t('login.password')} type="password" value={pass} onChange={setPass} placeholder="•••••••" />
          
          {error && <p className="text-red-500 dark:text-red-400 text-xs text-center bg-red-100 dark:bg-red-500/10 p-3 rounded-xl border border-red-200 dark:border-red-500/20">{error}</p>}
          
          <Button className="w-full justify-center py-4 text-base shadow-xl shadow-primary/20" onClick={() => {}}>
            {t('login.authenticate')}
          </Button>
        </form>
      </motion.div>
    </div>
  );
};
