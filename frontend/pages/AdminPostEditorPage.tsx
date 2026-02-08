import React from 'react';
import { Category, Post } from '../types';
import { PostEditor } from './PostEditor';

interface AdminPostEditorPageProps {
  post: Partial<Post> | null;
  categories: Category[];
  onBack: () => void;
  onSave: (post: Partial<Post>) => Promise<void>;
}

export const AdminPostEditorPage: React.FC<AdminPostEditorPageProps> = ({ post, categories, onBack, onSave }) => {
  return (
    <div className="flex-1 flex flex-col overflow-hidden glass-panel rounded-2xl border border-slate-200 dark:border-white/10">
      <div className="px-6 py-4 border-b border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03]">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-white/70 hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          返回文章管理
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        <PostEditor
          post={post}
          categories={categories}
          onSave={onSave}
          onCancel={onBack}
        />
      </div>
    </div>
  );
};

