import React, { useEffect, useRef, useState } from 'react';
import { Button, Input } from '../components/UI';
import { Config } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/apiService';

interface AdminSettingsProps {
  configs: Config[];
  onUpdate: (key: string, value: string) => Promise<void>;
}

const DEFAULT_FOCUS_ORDER = ['1', '2', '3'] as const;

const normalizeFocusOrder = (raw: string | undefined) => {
  const values = (raw || '')
    .split(',')
    .map((item) => item.trim())
    .filter((item): item is '1' | '2' | '3' => item === '1' || item === '2' || item === '3');

  if (values.length !== 3) {
    return [...DEFAULT_FOCUS_ORDER];
  }

  const unique = Array.from(new Set(values));
  if (unique.length !== 3) {
    return [...DEFAULT_FOCUS_ORDER];
  }
  return unique;
};

export const AdminSettings: React.FC<AdminSettingsProps> = ({ configs, onUpdate }) => {
  const { lang, setLang, t } = useLanguage();
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [draggingFocusCard, setDraggingFocusCard] = useState<string | null>(null);
  const [focusOrder, setFocusOrder] = useState<string[]>(() => normalizeFocusOrder(''));
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const getValue = (key: string) => configs.find((config) => config.key === key)?.value || '';
  const avatarUrl = getValue('avatar');

  useEffect(() => {
    setFocusOrder(normalizeFocusOrder(getValue('about_focus_order')));
  }, [configs]);

  const handleChange = async (key: string, value: string) => {
    if (key === 'language') {
      setLang(value as 'en' | 'zh');
    }
    try {
      await onUpdate(key, value);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update settings');
    }
  };

  const handleAvatarUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    const file = fileList[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    setUploadingAvatar(true);
    try {
      const uploaded = await api.uploadAssets([file], 'profile/avatar');
      const first = uploaded[0];
      if (!first?.url) {
        throw new Error('Avatar upload failed');
      }
      await handleChange('avatar', first.url);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const reorderFocusCards = async (sourceCard: string, targetCard: string) => {
    if (!sourceCard || sourceCard === targetCard) return;
    const fromIndex = focusOrder.indexOf(sourceCard);
    const toIndex = focusOrder.indexOf(targetCard);
    if (fromIndex < 0 || toIndex < 0) return;

    const nextOrder = [...focusOrder];
    const [moved] = nextOrder.splice(fromIndex, 1);
    nextOrder.splice(toIndex, 0, moved);
    setFocusOrder(nextOrder);
    await handleChange('about_focus_order', nextOrder.join(','));
  };

  return (
    <div className="flex flex-col h-full gap-6">
      <header className="flex items-center justify-between glass-panel rounded-2xl px-8 py-4 shrink-0">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">{t('admin.site_mgmt')}</h2>
          <p className="text-xs text-slate-500 dark:text-white/40 font-medium">{t('admin.settings_page.subtitle')}</p>
        </div>
        <Button onClick={() => alert(t('admin.settings_page.saved_alert'))}>{t('common.save')}</Button>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 overflow-y-auto pb-6">
        <section className="glass-panel rounded-2xl p-8 border-slate-200 dark:border-white/10 flex flex-col gap-6 h-fit">
          <div className="flex items-center gap-3 mb-2 border-b border-slate-200 dark:border-white/5 pb-4">
            <span className="material-symbols-outlined text-primary">person</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('settings.personal_info')}</h3>
          </div>

          <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50/80 dark:bg-white/5 border border-slate-200 dark:border-white/10 border-dashed">
            <div className="size-20 rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-gradient-to-br from-primary/20 to-purple-500/20 shadow-lg">
              {avatarUrl ? (
                <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-3xl">person</span>
                </div>
              )}
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">{t('settings.avatar')}</p>
              <p className="text-xs text-slate-500 dark:text-white/40 mt-1">{t('admin.settings_page.avatar_recommendation')}</p>
              <button
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="mt-2 text-xs text-primary font-bold hover:text-slate-900 dark:hover:text-white transition-colors disabled:opacity-60"
              >
                {uploadingAvatar ? 'Uploading...' : t('admin.settings_page.change_image')}
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => void handleAvatarUpload(event.target.files)}
              />
            </div>
          </div>

          <Input
            label={t('settings.bio')}
            value={getValue('admin_bio')}
            onChange={(value) => { void handleChange('admin_bio', value); }}
            textarea
            rows={4}
          />

          <Input
            label="作者名称"
            value={getValue('author_name')}
            onChange={(value) => { void handleChange('author_name', value); }}
            placeholder="例如：Douzhan"
          />

          <Input
            label="作者头衔"
            value={getValue('author_title')}
            onChange={(value) => { void handleChange('author_title', value); }}
            placeholder="例如：Personal Blogger"
          />
        </section>

        <section className="glass-panel rounded-2xl p-8 border-slate-200 dark:border-white/10 flex flex-col gap-6 h-fit">
          <div className="flex items-center gap-3 mb-2 border-b border-slate-200 dark:border-white/5 pb-4">
            <span className="material-symbols-outlined text-primary">settings</span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{t('settings.site_info')}</h3>
          </div>

          <Input
            label={t('settings.title')}
            value={getValue('site_title')}
            onChange={(value) => { void handleChange('site_title', value); }}
          />

          <Input
            label={t('settings.footer')}
            value={getValue('footer_text')}
            onChange={(value) => { void handleChange('footer_text', value); }}
          />

          <Input
            label="首页描述"
            value={getValue('hero_subtitle')}
            onChange={(value) => { void handleChange('hero_subtitle', value); }}
            textarea
            rows={3}
          />

          <Input
            label="分类页子描述"
            value={getValue('categories_intro')}
            onChange={(value) => { void handleChange('categories_intro', value); }}
            textarea
            rows={3}
          />

          <Input
            label="关于页子描述"
            value={getValue('about_subtitle')}
            onChange={(value) => { void handleChange('about_subtitle', value); }}
            textarea
            rows={3}
          />

          <Input
            label="首页标签"
            value={getValue('hero_tag')}
            onChange={(value) => { void handleChange('hero_tag', value); }}
            placeholder="例如：个人博客"
          />

          <Input
            label="首页主标题（第一行）"
            value={getValue('hero_title_start')}
            onChange={(value) => { void handleChange('hero_title_start', value); }}
            placeholder="例如：写下"
          />

          <Input
            label="首页主标题（第二行）"
            value={getValue('hero_title_end')}
            onChange={(value) => { void handleChange('hero_title_end', value); }}
            placeholder="例如：生活与代码"
          />

          <div className="rounded-2xl border border-slate-200/80 dark:border-white/10 bg-slate-50/70 dark:bg-white/[0.03] p-5 space-y-4">
            <h4 className="text-sm font-bold text-slate-800 dark:text-white/90">关于页主题卡片（可拖拽排序）</h4>
            <p className="text-xs text-slate-500 dark:text-white/45">拖动卡片可调整前台展示顺序，松开后自动保存。</p>

            {focusOrder.map((cardId) => (
              <div
                key={cardId}
                data-focus-card={cardId}
                draggable
                onDragStart={(event) => {
                  setDraggingFocusCard(cardId);
                  event.dataTransfer.effectAllowed = 'move';
                  event.dataTransfer.setData('text/plain', cardId);
                }}
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  const sourceCard = event.dataTransfer.getData('text/plain') || draggingFocusCard || '';
                  void reorderFocusCards(sourceCard, cardId);
                }}
                onDragEnd={() => setDraggingFocusCard(null)}
                className={`rounded-xl border p-4 transition-all cursor-move ${
                  draggingFocusCard === cardId
                    ? 'border-primary bg-primary/5'
                    : 'border-slate-200 dark:border-white/10 bg-white/70 dark:bg-white/[0.02]'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-bold text-slate-500 dark:text-white/40">卡片 {cardId}</p>
                  <span className="material-symbols-outlined text-slate-400 dark:text-white/35">drag_indicator</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input
                    label="图标（Material Symbol）"
                    value={getValue(`about_focus_${cardId}_icon`)}
                    onChange={(value) => { void handleChange(`about_focus_${cardId}_icon`, value); }}
                    placeholder="例如：terminal"
                  />
                  <Input
                    label="标题"
                    value={getValue(`about_focus_${cardId}_title`)}
                    onChange={(value) => { void handleChange(`about_focus_${cardId}_title`, value); }}
                    placeholder="例如：Coding"
                  />
                </div>
                <Input
                  label="描述"
                  value={getValue(`about_focus_${cardId}_desc`)}
                  onChange={(value) => { void handleChange(`about_focus_${cardId}_desc`, value); }}
                  textarea
                  rows={2}
                  placeholder="卡片描述文案"
                />
              </div>
            ))}
          </div>

          <div className="mb-6 space-y-2">
            <label className="block text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1">{t('settings.language')}</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => { void handleChange('language', 'zh'); }}
                className={`px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                  lang === 'zh'
                    ? 'bg-primary border-primary text-white'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                中文 (Chinese)
              </button>
              <button
                onClick={() => { void handleChange('language', 'en'); }}
                className={`px-4 py-3 rounded-xl border transition-all text-sm font-bold ${
                  lang === 'en'
                    ? 'bg-primary border-primary text-white'
                    : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-white/60 hover:bg-slate-100 dark:hover:bg-white/10'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
