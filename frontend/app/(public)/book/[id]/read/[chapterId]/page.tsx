'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getBookById, chaptersForBook1, sampleChapterContent, wallet } from '@/lib/mockData';
import { useReaderSettingsStore } from '@/store/themeStore';
import { WaxSealIcon, CoinIcon } from '@/components/WaxSealIcon';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Modal } from '@/components/Modal';
import { Button } from '@/components/Button';

export default function ReaderViewPage() {
  const { id, chapterId } = useParams<{ id: string; chapterId: string }>();
  const book = getBookById(id);
  const bookTitle = book?.title ?? 'The Alpha\'s Unwanted Bride';

  const chapters = chaptersForBook1;
  const chapterIndex = chapters.findIndex((c) => c._id === chapterId);
  const chapter = chapters[chapterIndex] ?? chapters[0];
  const prevChapter = chapterIndex > 0 ? chapters[chapterIndex - 1] : null;
  const nextChapter = chapterIndex < chapters.length - 1 ? chapters[chapterIndex + 1] : null;

  const { fontSize, lineHeight, setFontSize, setLineHeight } = useReaderSettingsStore();
  const [bookmarked, setBookmarked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [unlockOpen, setUnlockOpen] = useState(!chapter.isFree);

  const isLocked = !chapter.isFree;

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* ─── Top bar ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="flex items-center h-14 px-4 md:px-8 gap-3">
          {/* Back to book */}
          <Link
            href={`/book/${id}`}
            className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors shrink-0"
            aria-label="Back to book"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="text-sm font-body hidden sm:block">Back</span>
          </Link>

          {/* Book + chapter info */}
          <div className="flex-1 min-w-0 text-center">
            <p className="text-xs font-body text-text-secondary truncate">{bookTitle}</p>
            <p className="text-sm font-body font-medium text-text-primary truncate">{chapter.title}</p>
          </div>

          {/* Chapter position */}
          <span className="font-mono text-xs text-text-secondary tabular-nums shrink-0">
            Ch. {chapter.order} / {chapters.length}
          </span>

          {/* Controls */}
          <div className="flex items-center gap-1 shrink-0">
            {/* Settings */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Reading settings"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/><path d="M19.07 4.93a10 10 0 0 1 1.41 1.41M4.93 19.07a10 10 0 0 1-1.41-1.41M12 2v2M12 20v2M2 12h2M20 12h2M6.34 6.34 4.93 4.93M19.07 19.07l-1.41-1.41M6.34 17.66l-1.41 1.41M17.66 6.34l1.41-1.41"/>
              </svg>
            </button>
            <ThemeToggle size="sm" />
            {/* Bookmark */}
            <button
              onClick={() => setBookmarked(!bookmarked)}
              className={`flex items-center justify-center w-9 h-9 rounded-full transition-colors ${bookmarked ? 'text-accent' : 'text-text-secondary hover:text-text-primary'} hover:bg-surface-alt`}
              aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this chapter'}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={bookmarked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Reading settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="border-t border-border bg-surface overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-6 px-6 py-3">
                {/* Font size */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-body text-text-secondary">Size</span>
                  <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-7 h-7 rounded border border-border text-text-secondary hover:text-text-primary text-sm flex items-center justify-center">A-</button>
                  <span className="font-mono text-xs text-text-primary w-8 text-center">{fontSize}px</span>
                  <button onClick={() => setFontSize(Math.min(28, fontSize + 2))} className="w-7 h-7 rounded border border-border text-text-secondary hover:text-text-primary flex items-center justify-center text-sm">A+</button>
                </div>
                {/* Line height */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-body text-text-secondary">Spacing</span>
                  {[1.5, 1.8, 2.2].map((lh) => (
                    <button
                      key={lh}
                      onClick={() => setLineHeight(lh)}
                      className={`px-2 py-1 rounded text-xs font-body border transition-colors ${lineHeight === lh ? 'border-primary text-primary bg-primary/10' : 'border-border text-text-secondary hover:text-text-primary'}`}
                    >
                      {lh === 1.5 ? 'Compact' : lh === 1.8 ? 'Normal' : 'Airy'}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ─── Chapter body ─────────────────────────────────────── */}
      <main className="flex-1 flex justify-center px-4 py-10">
        <article
          className="w-full max-w-[65ch] font-body text-text-primary"
          style={{ fontSize: `${fontSize}px`, lineHeight }}
        >
          {isLocked ? (
            /* Blurred preview for locked chapter */
            <div className="relative">
              <div
                className="blur-sm pointer-events-none select-none opacity-40"
                dangerouslySetInnerHTML={{ __html: sampleChapterContent }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <WaxSealIcon size={56} />
                <p className="font-display text-lg font-semibold text-text-primary text-center">This chapter is locked</p>
                <p className="text-text-secondary font-body text-sm text-center">
                  Unlock for <span className="font-mono font-bold text-accent">{chapter.coinPrice} coins</span>
                </p>
                <Button variant="accent" onClick={() => setUnlockOpen(true)} icon={<CoinIcon size={16} />}>
                  Unlock chapter
                </Button>
              </div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              dangerouslySetInnerHTML={{ __html: sampleChapterContent }}
            />
          )}
        </article>
      </main>

      {/* ─── Bottom nav bar ───────────────────────────────────── */}
      <footer className="sticky bottom-0 z-30 border-t border-border bg-surface/90 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-6 max-w-2xl mx-auto">
          <button
            disabled={!prevChapter}
            onClick={() => prevChapter && (window.location.href = `/book/${id}/read/${prevChapter._id}`)}
            className="flex items-center gap-1.5 text-sm font-body text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
            Previous
          </button>

          <div className="font-mono text-xs text-text-secondary">
            {chapter.wordCount > 0 && `${chapter.wordCount.toLocaleString()} words`}
          </div>

          <button
            onClick={() => nextChapter && !nextChapter.isFree
              ? setUnlockOpen(true)
              : nextChapter && (window.location.href = `/book/${id}/read/${nextChapter._id}`)
            }
            disabled={!nextChapter}
            className={`flex items-center gap-1.5 text-sm font-body disabled:opacity-30 disabled:cursor-not-allowed transition-colors
              ${nextChapter && !nextChapter.isFree ? 'text-accent font-medium' : 'text-text-secondary hover:text-text-primary'}`}
          >
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </footer>

      {/* ─── Unlock Modal ─────────────────────────────────────── */}
      <Modal isOpen={unlockOpen} onClose={() => setUnlockOpen(false)}>
        <div className="flex flex-col items-center text-center gap-5">
          <WaxSealIcon size={64} />
          <div>
            <h2 className="font-display text-2xl font-semibold text-text-primary mb-2">
              Unlock this chapter
            </h2>
            <p className="text-text-secondary font-body text-sm leading-relaxed">
              {nextChapter?.title ?? chapter.title}
            </p>
          </div>

          {/* Coin details */}
          <div className="w-full bg-surface-alt rounded-card p-5 border border-border space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-text-secondary">Chapter price</span>
              <div className="flex items-center gap-1.5">
                <CoinIcon size={16} />
                <span className="font-mono font-bold text-accent text-lg">{chapter.coinPrice}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-body text-text-secondary">Your balance</span>
              <div className="flex items-center gap-1.5">
                <CoinIcon size={16} />
                <span className={`font-mono font-bold text-lg ${wallet.coinBalance >= chapter.coinPrice ? 'text-success' : 'text-danger'}`}>
                  {wallet.coinBalance}
                </span>
              </div>
            </div>
            <div className="border-t border-border pt-3 flex items-center justify-between">
              <span className="text-sm font-body text-text-secondary">After unlock</span>
              <div className="flex items-center gap-1.5">
                <CoinIcon size={16} />
                <span className="font-mono font-bold text-text-primary text-lg">
                  {Math.max(0, wallet.coinBalance - chapter.coinPrice)}
                </span>
              </div>
            </div>
          </div>

          {wallet.coinBalance >= chapter.coinPrice ? (
            <Button
              fullWidth
              size="lg"
              variant="accent"
              icon={<CoinIcon size={18} />}
              onClick={() => setUnlockOpen(false)}
            >
              Unlock with {chapter.coinPrice} coins
            </Button>
          ) : (
            <div className="w-full space-y-3">
              <p className="text-danger text-sm font-body">You need {chapter.coinPrice - wallet.coinBalance} more coins.</p>
              <Button fullWidth size="lg" variant="primary" href="/dashboard/coins">
                Buy more coins
              </Button>
            </div>
          )}

          <p className="text-xs font-body text-text-secondary">
            Unlocked chapters stay accessible forever, at no additional cost.
          </p>
        </div>
      </Modal>
    </div>
  );
}
