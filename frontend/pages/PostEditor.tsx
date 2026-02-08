import React, { useEffect, useMemo, useRef, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { Button, Input } from '../components/UI';
import { generateSummary } from '../services/geminiService';
import { api } from '../services/apiService';
import { Category, Post } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { ThemedSelect, ThemedSelectOption } from '../components/ThemedSelect';

interface PostEditorProps {
  post: Partial<Post> | null;
  categories: Category[];
  onSave: (data: Partial<Post>) => Promise<void>;
  onCancel: () => void;
}

type MarkdownViewMode = 'edit' | 'live' | 'preview';

export const PostEditor: React.FC<PostEditorProps> = ({ post, categories, onSave, onCancel }) => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Partial<Post>>({
    title: '',
    content: '',
    summary: '',
    status: 'draft',
    category_id: 1
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [markdownMode, setMarkdownMode] = useState<MarkdownViewMode>('live');
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const folderInputRef = useRef<HTMLInputElement | null>(null);

  const dataColorMode = useMemo<'light' | 'dark'>(
    () => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'),
    []
  );

  useEffect(() => {
    if (post) {
      setFormData({
        id: post.id,
        title: post.title || '',
        content: post.content || '',
        summary: post.summary || '',
        status: post.status || 'draft',
        category_id: post.category_id || 1,
        created_at: post.created_at,
        updated_at: post.updated_at
      });
    } else {
      setFormData({
        title: '',
        content: '',
        summary: '',
        status: 'draft',
        category_id: 1
      });
    }
  }, [post]);

  const handleGenerateSummary = async () => {
    if (!formData.content) return;
    setIsGenerating(true);
    const summary = await generateSummary(formData.content);
    setFormData((prev) => ({ ...prev, summary }));
    setIsGenerating(false);
  };

  const appendMarkdownImages = (urls: Array<{ original_name: string; url: string }>) => {
    const imageBlocks = urls.map((item) => `![${item.original_name}](${item.url})`).join('\n');
    setFormData((prev) => {
      const existing = prev.content?.trimEnd() || '';
      return {
        ...prev,
        content: existing ? `${existing}\n\n${imageBlocks}` : imageBlocks
      };
    });
  };

  const handleUpload = async (fileList: FileList | null, folderMode = false) => {
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList).filter((file) => file.type.startsWith('image/'));
    if (files.length === 0) {
      alert('请选择图片文件。');
      return;
    }

    setIsUploading(true);
    try {
      const folder = folderMode ? `articles/folder-${Date.now()}` : undefined;
      const uploaded = await api.uploadAssets(files, folder);
      appendMarkdownImages(uploaded);
    } catch (error) {
      alert(error instanceof Error ? error.message : '图片上传失败');
    } finally {
      setIsUploading(false);
      if (imageInputRef.current) imageInputRef.current.value = '';
      if (folderInputRef.current) folderInputRef.current.value = '';
    }
  };

  const categoryOptions: Array<ThemedSelectOption<number>> = categories.map((category) => ({
    value: category.id,
    label: category.name
  }));

  const statusOptions: Array<ThemedSelectOption<'draft' | 'published'>> = [
    { value: 'draft', label: t('admin.editor.status_draft') },
    { value: 'published', label: t('admin.editor.status_published') }
  ];

  return (
    <div className="flex flex-col h-full w-full">
      <header className="px-6 py-5 border-b border-slate-200 dark:border-white/10 bg-gradient-to-r from-primary/15 to-purple-500/10 backdrop-blur-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {formData.id ? t('admin.editor.edit_title') : t('admin.editor.create_title')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-white/50 mt-1">支持 Markdown、图片上传与文件夹导入，给长文创作更大的工作区。</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel}>{t('admin.editor.discard')}</Button>
            <Button onClick={async () => { await onSave(formData); }} icon={() => <span className="material-symbols-outlined text-sm">save</span>}>
              {t('admin.editor.save')}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-5 custom-scrollbar">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">
          <div className="space-y-5">
            <div className="glass-panel rounded-2xl p-5">
              <Input
                label={t('admin.editor.label_title')}
                value={formData.title || ''}
                onChange={(value: string) => setFormData({ ...formData, title: value })}
                placeholder={t('admin.editor.placeholder_title')}
              />

              <div className="grid grid-cols-2 gap-6 mb-2">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1 mb-2">{t('admin.editor.label_category')}</label>
                  <ThemedSelect
                    value={(formData.category_id || categories[0]?.id || 1) as number}
                    options={categoryOptions}
                    onChange={(value) => setFormData({ ...formData, category_id: value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1 mb-2">{t('admin.editor.label_status')}</label>
                  <ThemedSelect
                    value={(formData.status || 'draft') as 'draft' | 'published'}
                    options={statusOptions}
                    onChange={(value) => setFormData({ ...formData, status: value })}
                  />
                </div>
              </div>
            </div>

            <div className="glass-panel rounded-2xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <label className="block text-xs font-bold text-slate-400 dark:text-white/40 uppercase tracking-widest ml-1">{t('admin.editor.label_content')}</label>
                  <p className="text-xs text-slate-500 dark:text-white/40 mt-1">保存后将写入数据库，并在后端生成 markdown 快照文件。</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden">
                    <button onClick={() => setMarkdownMode('edit')} className={`px-3 py-1.5 text-xs font-bold ${markdownMode === 'edit' ? 'bg-primary text-white' : 'bg-slate-100/80 dark:bg-white/[0.06] text-slate-600 dark:text-white/60'}`}>编辑</button>
                    <button onClick={() => setMarkdownMode('live')} className={`px-3 py-1.5 text-xs font-bold ${markdownMode === 'live' ? 'bg-primary text-white' : 'bg-slate-100/80 dark:bg-white/[0.06] text-slate-600 dark:text-white/60'}`}>分屏</button>
                    <button onClick={() => setMarkdownMode('preview')} className={`px-3 py-1.5 text-xs font-bold ${markdownMode === 'preview' ? 'bg-primary text-white' : 'bg-slate-100/80 dark:bg-white/[0.06] text-slate-600 dark:text-white/60'}`}>预览</button>
                  </div>
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.06] text-slate-600 dark:text-white/70 hover:border-primary/50 transition-colors disabled:opacity-60"
                  >
                    {isUploading ? '上传中...' : '上传图片'}
                  </button>
                  <button
                    onClick={() => folderInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-white/10 bg-slate-100/80 dark:bg-white/[0.06] text-slate-600 dark:text-white/70 hover:border-primary/50 transition-colors disabled:opacity-60"
                  >
                    导入图片文件夹
                  </button>
                </div>
              </div>

              <div data-color-mode={dataColorMode}>
                <MDEditor
                  value={formData.content || ''}
                  preview={markdownMode}
                  onChange={(value) => setFormData((prev) => ({ ...prev, content: value || '' }))}
                  height={460}
                  textareaProps={{ placeholder: t('admin.editor.placeholder_content') }}
                />
              </div>

              <input ref={imageInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(event) => handleUpload(event.target.files, false)} />
              <input
                ref={folderInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(event) => handleUpload(event.target.files, true)}
                {...({ webkitdirectory: 'true', directory: 'true' } as any)}
              />
            </div>
          </div>

          <div className="space-y-5">
            <div className="glass-panel rounded-2xl p-5 relative">
              <Input
                label={t('admin.editor.label_summary')}
                value={formData.summary || ''}
                onChange={(value: string) => setFormData({ ...formData, summary: value })}
                textarea
                rows={6}
                placeholder={t('admin.editor.placeholder_summary')}
              />
              <button
                onClick={handleGenerateSummary}
                disabled={isGenerating || !formData.content}
                className="absolute right-6 bottom-6 text-xs bg-gradient-to-r from-purple-500 to-primary text-white px-3 py-1.5 rounded-lg flex items-center gap-1.5 hover:opacity-90 disabled:opacity-50 transition-all font-bold shadow-lg"
              >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                {isGenerating ? t('admin.editor.ai_generating') : t('admin.editor.ai_button')}
              </button>
            </div>

            <div className="glass-panel rounded-2xl p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-white/40 mb-3">编辑建议</p>
              <ul className="text-sm text-slate-600 dark:text-white/60 leading-7 list-disc pl-5 space-y-1">
                <li>建议第一屏先写核心观点，再展开细节。</li>
                <li>图片建议压缩后上传，提升前台加载性能。</li>
                <li>可以用“导入图片文件夹”一次上传全部素材并自动生成相对路径。</li>
                <li>保存后系统会在后端 storage 目录生成 markdown 快照文件。</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
