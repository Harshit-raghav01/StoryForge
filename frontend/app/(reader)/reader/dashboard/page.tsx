'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { books, readerLibrary } from '@/lib/mockData';
import { BookCard } from '@/components/BookCard';

export default function ReaderDashboardPage() {
  const libraryEntries = readerLibrary.map((entry) => ({
    entry,
    book: books.find((b) => b._id === entry.bookId),
  })).filter((e) => e.book);

  const inProgress = libraryEntries.filter((e) => e.entry.progress > 0 && e.entry.progress < 1);
  const completed = libraryEntries.filter((e) => e.entry.progress >= 1);
  const notStarted = libraryEntries.filter((e) => e.entry.progress === 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">My Library</h1>
        <p className="text-text-secondary font-body text-sm mt-1">{libraryEntries.length} books saved</p>
      </div>

      {/* In Progress */}
      {inProgress.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Continue reading</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {inProgress.map(({ entry, book }, i) => (
              <motion.div
                key={entry.bookId}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="flex gap-4 p-4 bg-surface rounded-card border border-border hover:border-primary/30 hover:shadow-card transition-all group"
              >
                {/* Mini cover */}
                <div className="w-16 h-22 rounded-lg bg-gradient-to-br from-primary/40 to-support/30 shrink-0 flex items-center justify-center relative overflow-hidden">
                  <span className="text-white font-display text-xs font-semibold text-center px-1 leading-tight line-clamp-3">{book!.title}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/book/${book!._id}`} className="font-body font-semibold text-text-primary text-sm hover:text-primary transition-colors line-clamp-2">
                    {book!.title}
                  </Link>
                  <p className="text-xs font-body text-text-secondary mt-0.5">{book!.authorName}</p>
                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-body text-text-secondary">Progress</span>
                      <span className="text-[10px] font-mono text-accent font-bold">{Math.round(entry.progress * 100)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-border overflow-hidden">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${entry.progress * 100}%` }} />
                    </div>
                  </div>
                  <Link
                    href={`/book/${book!._id}/read/${entry.lastReadChapter}`}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium font-body text-primary hover:text-primary-pop transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                    Continue reading
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* All books grid */}
      {libraryEntries.length > 0 && (
        <section className="mb-10">
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">All saved books</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {libraryEntries.map(({ entry, book }, i) => (
              book && <BookCard key={book._id} book={book} size="standard" progress={entry.progress} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {libraryEntries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-6xl mb-4">📚</span>
          <h2 className="font-display text-xl font-semibold text-text-primary mb-2">Your library is empty</h2>
          <p className="text-text-secondary font-body text-sm max-w-sm">
            Browse stories and tap &ldquo;Add to library&rdquo; to save them here.
          </p>
          <Link href="/browse" className="mt-6 px-6 py-2.5 rounded-pill bg-primary text-white text-sm font-medium font-body hover:bg-primary-pop transition-colors">
            Browse stories
          </Link>
        </div>
      )}
    </div>
  );
}
