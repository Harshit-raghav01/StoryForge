'use client';

import { use, useState, useCallback } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { chaptersForBook1, sampleChapterContent, type Chapter } from '@/lib/mockData';
import { Button } from '@/components/Button';

const WORD_TARGET_MIN = 600;
const WORD_TARGET_MAX = 1000;

function countWords(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').trim();
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function TiptapToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const btn = (
    action: () => void,
    active: boolean,
    label: string,
    content: React.ReactNode
  ) => (
    <button
      type="button"
      onClick={action}
      title={label}
      aria-label={label}
      className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors
        ${active ? 'bg-primary/15 text-primary' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}
    >
      {content}
    </button>
  );

  return (
    <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-border bg-surface-alt">
      {btn(() => editor.chain().focus().toggleBold().run(), editor.isActive('bold'), 'Bold', <strong>B</strong>)}
      {btn(() => editor.chain().focus().toggleItalic().run(), editor.isActive('italic'), 'Italic', <em>I</em>)}
      <div className="w-px h-5 bg-border mx-1" />
      {btn(() => editor.chain().focus().toggleHeading({ level: 2 }).run(), editor.isActive('heading', { level: 2 }), 'Heading 2', <span className="text-xs font-bold">H2</span>)}
      {btn(() => editor.chain().focus().toggleHeading({ level: 3 }).run(), editor.isActive('heading', { level: 3 }), 'Heading 3', <span className="text-xs font-bold">H3</span>)}
      <div className="w-px h-5 bg-border mx-1" />
      {btn(
        () => editor.chain().focus().toggleBulletList().run(),
        editor.isActive('bulletList'),
        'Bullet list',
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/>
          <line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/>
          <line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
        </svg>
      )}
      {btn(
        () => editor.chain().focus().toggleBlockquote().run(),
        editor.isActive('blockquote'),
        'Quote',
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
          <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
        </svg>
      )}
      <div className="w-px h-5 bg-border mx-1" />
      {btn(
        () => editor.chain().focus().undo().run(),
        false,
        'Undo',
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
        </svg>
      )}
      {btn(
        () => editor.chain().focus().redo().run(),
        false,
        'Redo',
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
        </svg>
      )}
    </div>
  );
}

export default function ChapterEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [chapters, setChapters] = useState<Chapter[]>(chaptersForBook1);
  const [activeChapterId, setActiveChapterId] = useState('ch1');
  const [chapterTitle, setChapterTitle] = useState('The Ceremony');
  const [wordCount, setWordCount] = useState(0);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [chapterMenuOpen, setChapterMenuOpen] = useState<string | null>(null);

  const activeChapter = chapters.find((c) => c._id === activeChapterId) ?? chapters[0];

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing your chapter here…' }),
    ],
    content: sampleChapterContent,
    onUpdate({ editor }) {
      setWordCount(countWords(editor.getHTML()));
    },
    immediatelyRender: false,
  });

  const handleSave = useCallback(() => {
    setSaveStatus('saving');
    setTimeout(() => setSaveStatus('saved'), 800);
  }, []);

  const addNewChapter = () => {
    const newCh: Chapter = {
      _id: `ch-new-${Date.now()}`,
      bookId: id,
      order: chapters.length + 1,
      title: `Chapter ${chapters.length + 1}`,
      wordCount: 0,
      isFree: false,
      coinPrice: 8,
      status: 'draft',
      publishedAt: null,
    };
    setChapters((prev) => [...prev, newCh]);
    setActiveChapterId(newCh._id);
    setChapterTitle(newCh.title);
    editor?.commands.setContent('');
    setWordCount(0);
  };

  const publishChapter = () => {
    setChapters((prev) =>
      prev.map((c) =>
        c._id === activeChapterId
          ? { ...c, status: 'published' as const, publishedAt: new Date().toISOString() }
          : c
      )
    );
  };

  const wordStatus =
    wordCount < WORD_TARGET_MIN ? 'below' : wordCount > WORD_TARGET_MAX ? 'above' : 'ideal';

  return (
    <div className="flex h-[calc(100vh-11rem)] overflow-hidden rounded-card border border-border bg-surface">
      {/* ── Left sidebar ─────────────────────────────────── */}
      <aside className="w-56 shrink-0 border-r border-border bg-surface-alt flex flex-col">
        <div className="p-3 border-b border-border">
          <button
            onClick={addNewChapter}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-primary text-white text-sm font-medium font-body hover:bg-primary-pop transition-colors"
            id="new-chapter-btn"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New chapter
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {chapters.map((ch) => (
            <div
              key={ch._id}
              className={`group relative flex items-center gap-2 px-3 py-2 mx-1 rounded-lg cursor-pointer transition-colors
                ${activeChapterId === ch._id
                  ? 'bg-primary/10 text-primary'
                  : 'text-text-secondary hover:bg-surface hover:text-text-primary'}`}
              onClick={() => {
                setActiveChapterId(ch._id);
                setChapterTitle(ch.title);
              }}
            >
              <span className="font-mono text-[10px] text-text-secondary w-5 shrink-0 tabular-nums">
                {String(ch.order).padStart(2, '0')}
              </span>
              <span className="text-xs font-body truncate flex-1">{ch.title}</span>
              <span
                className={`shrink-0 w-1.5 h-1.5 rounded-full ${
                  ch.status === 'published'
                    ? 'bg-success'
                    : ch.status === 'scheduled'
                    ? 'bg-accent'
                    : 'bg-border'
                }`}
              />
              {/* 3-dot menu */}
              <button
                className="opacity-0 group-hover:opacity-100 shrink-0 w-5 h-5 flex items-center justify-center rounded hover:bg-surface-alt"
                onClick={(e) => {
                  e.stopPropagation();
                  setChapterMenuOpen(chapterMenuOpen === ch._id ? null : ch._id);
                }}
                aria-label="Chapter options"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>

              {chapterMenuOpen === ch._id && (
                <div
                  className="absolute right-0 top-8 z-30 w-36 bg-surface rounded-lg border border-border shadow-elevated py-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {['Rename', 'Delete', 'Set as free'].map((action) => (
                    <button
                      key={action}
                      className="w-full text-left px-3 py-1.5 text-xs font-body text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
                      onClick={() => setChapterMenuOpen(null)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* ── Main editor ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chapter title */}
        <div className="border-b border-border px-6 py-3">
          <input
            type="text"
            value={chapterTitle}
            onChange={(e) => setChapterTitle(e.target.value)}
            className="w-full font-display text-xl font-semibold text-text-primary bg-transparent outline-none placeholder:text-text-secondary"
            placeholder="Chapter title…"
            id="chapter-title-input"
          />
          <div className="flex items-center gap-3 mt-1 text-[10px] font-body text-text-secondary">
            <span>Ch. {activeChapter.order}</span>
            <span>·</span>
            <span className={activeChapter.isFree ? 'text-success' : 'text-accent'}>
              {activeChapter.isFree ? 'Free chapter' : `${activeChapter.coinPrice} coins`}
            </span>
            <span>·</span>
            <span className={activeChapter.status === 'published' ? 'text-success' : 'text-text-secondary capitalize'}>
              {activeChapter.status}
            </span>
          </div>
        </div>

        {/* Editor area */}
        <div className="flex-1 overflow-y-auto">
          <TiptapToolbar editor={editor} />
          <div className="px-8 py-6">
            <EditorContent editor={editor} className="tiptap min-h-[400px]" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-border px-6 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-surface-alt">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold tabular-nums text-text-primary">
              {wordCount.toLocaleString()}
            </span>
            <span className="text-xs font-body text-text-secondary">words</span>
            <span
              className={`ml-1 px-2 py-0.5 rounded-pill text-[10px] font-bold font-body
              ${wordStatus === 'ideal'
                ? 'bg-success/20 text-success'
                : wordStatus === 'below'
                ? 'bg-accent/20 text-accent'
                : 'bg-danger/20 text-danger'}`}
            >
              {wordStatus === 'ideal'
                ? '✓ Ideal'
                : wordStatus === 'below'
                ? `${WORD_TARGET_MIN - wordCount} to go`
                : `${wordCount - WORD_TARGET_MAX} over`}
            </span>
            <span className="text-[10px] font-body text-text-secondary ml-1">
              ({WORD_TARGET_MIN}–{WORD_TARGET_MAX} ideal)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {saveStatus !== 'idle' && (
              <span className={`text-xs font-body transition-colors ${saveStatus === 'saved' ? 'text-success' : 'text-accent'}`}>
                {saveStatus === 'saved' ? '✓ Saved' : 'Saving…'}
              </span>
            )}
            <Button variant="ghost" size="sm" onClick={handleSave} id="save-draft-btn">
              Save draft
            </Button>
            <Button variant="secondary" size="sm" id="preview-btn">
              Preview
            </Button>
            <Button variant="primary" size="sm" id="publish-btn" onClick={publishChapter}>
              Publish
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
