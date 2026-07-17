'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { useUserStore } from '@/store/userStore';
import { authorBooks, formatCount, readerLibrary, books, readingHistory, bookmarks } from '@/lib/mockData';
import { CoinIcon, WaxSealIcon } from '@/components/WaxSealIcon';
import { Button } from '@/components/Button';

const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function UnifiedDashboardPage() {
  const { currentUser } = useUserStore();
  const [activeTab, setActiveTab] = useState<'reader' | 'author'>('reader');

  if (!currentUser) return null;

  const hasAuthorProfile = !!currentUser.authorProfile;

  // Reader statistics
  const readerStats = [
    { label: 'Books saved', value: String(readerLibrary.length), icon: '📚' },
    { label: 'Coin balance', value: String(currentUser.coinBalance), icon: '🪙' },
    { label: 'Chapters read', value: String(readingHistory.length), icon: '🕐' },
    { label: 'Saved bookmarks', value: String(bookmarks.length), icon: '🔖' },
  ];

  // Author statistics
  const authorStats = [
    { label: 'Total books', value: String(authorBooks.length), icon: '📚' },
    { label: 'Total reads', value: formatCount(1234900), icon: '👁' },
    { label: 'This month', value: '₹24,500', icon: '💰' },
    { label: 'Avg rating', value: '9.0 ★', icon: '⭐' },
  ];

  // Get reading list
  const libraryEntries = readerLibrary.map((entry) => ({
    entry,
    book: books.find((b) => b._id === entry.bookId),
  })).filter((e) => e.book).slice(0, 3); // top 3 for dashboard quick view

  return (
    <div className="space-y-8">
      {/* Dashboard Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-text-secondary font-body text-sm mt-1">
            {hasAuthorProfile 
              ? `Pen name: ${currentUser.authorProfile?.penName}`
              : 'Reader account'}
          </p>
        </div>

        {/* Tab switcher if user has an author profile */}
        {hasAuthorProfile && (
          <div className="flex p-1 bg-surface-alt border border-border rounded-pill self-start sm:self-auto shadow-sm">
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-4 py-1.5 rounded-pill text-xs font-semibold font-body transition-all
                ${activeTab === 'reader' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'}`}
            >
              Reader Space
            </button>
            <button
              onClick={() => setActiveTab('author')}
              className={`px-4 py-1.5 rounded-pill text-xs font-semibold font-body transition-all
                ${activeTab === 'author' 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'}`}
            >
              Author Studio
            </button>
          </div>
        )}
      </div>

      {/* ── READER SPACE VIEW ───────────────────────────────── */}
      {(activeTab === 'reader' || !hasAuthorProfile) && (
        <div className="space-y-8">
          {/* Become Author Prompt banner (Only if no author profile exists) */}
          {!hasAuthorProfile && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-card bg-gradient-to-r from-primary/10 via-support/5 to-accent/10 border border-primary/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            >
              <div>
                <h3 className="font-display text-lg font-semibold text-text-primary mb-1">
                  Start sharing your own stories today! ✨
                </h3>
                <p className="text-sm font-body text-text-secondary max-w-xl">
                  Create your author pen name, publish your chapters, and start earning from unlocks. Setting up your profile takes less than a minute.
                </p>
              </div>
              <Button href="/dashboard/become-author" variant="primary" size="md" className="shrink-0 shadow-sm">
                Become an Author
              </Button>
            </motion.div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {readerStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.05 }}
                className="bg-surface rounded-card border border-border p-5 shadow-soft"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="font-mono text-2xl font-bold text-text-primary tabular-nums">{stat.value}</p>
                <p className="text-xs font-body text-text-secondary mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Continue Reading List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">Continue reading</h2>
              <Link href="/dashboard/library" className="text-xs font-body text-primary hover:text-primary-pop transition-colors">
                View library →
              </Link>
            </div>

            {libraryEntries.length === 0 ? (
              <div className="p-8 text-center rounded-card border border-dashed border-border bg-surface-alt text-text-secondary text-sm font-body">
                You haven&apos;t started reading any books yet. <Link href="/browse" className="text-primary hover:underline">Browse novels</Link> to get started.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {libraryEntries.map(({ entry, book }) => (
                  <div key={entry.bookId} className="p-4 bg-surface rounded-card border border-border flex flex-col justify-between h-40 hover:border-primary/20 hover:shadow-soft transition-all">
                    <div>
                      <span className="px-2 py-0.5 rounded-pill text-[9px] font-bold bg-accent/15 text-accent font-body capitalize">
                        {book?.genreName}
                      </span>
                      <h3 className="font-body font-semibold text-text-primary text-sm line-clamp-1 mt-2">
                        {book?.title}
                      </h3>
                      <p className="text-xs font-body text-text-secondary">{book?.authorName}</p>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[10px] font-body text-text-secondary mb-1">
                        <span>Progress</span>
                        <span className="font-mono tabular-nums">{Math.round(entry.progress * 100)}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-border overflow-hidden mb-3">
                        <div className="h-full bg-accent" style={{ width: `${entry.progress * 100}%` }} />
                      </div>
                      <Link 
                        href={`/book/${book?._id}/read/${entry.lastReadChapter}`}
                        className="text-xs font-medium font-body text-primary hover:text-primary-pop transition-colors"
                      >
                        Resume Reading →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/browse" className="flex items-center gap-4 p-5 rounded-card border border-border bg-surface hover:border-primary/30 hover:shadow-soft transition-all group">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">✨</span>
              <div>
                <p className="font-body font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">Explore Novels</p>
                <p className="text-xs font-body text-text-secondary">Discover romance, werewolf, and fantasy sagas</p>
              </div>
            </Link>
            <Link href="/dashboard/coins" className="flex items-center gap-4 p-5 rounded-card border border-border bg-surface hover:border-primary/30 hover:shadow-soft transition-all group">
              <span className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-xl">🪙</span>
              <div>
                <p className="font-body font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">Refill Wallet</p>
                <p className="text-xs font-body text-text-secondary">Get more coins to unlock premium chapters</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* ── AUTHOR STUDIO VIEW ──────────────────────────────── */}
      {hasAuthorProfile && activeTab === 'author' && (
        <div className="space-y-8 animate-fadeIn">
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {authorStats.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={fadeUp}
                initial="initial"
                animate="animate"
                transition={{ delay: i * 0.05 }}
                className="bg-surface rounded-card border border-border p-5 shadow-soft"
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <p className="font-mono text-2xl font-bold text-text-primary tabular-nums">{stat.value}</p>
                <p className="text-xs font-body text-text-secondary mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Book Catalog list summary */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg font-semibold text-text-primary">My published books</h2>
              <Link href="/dashboard/books" className="text-xs font-body text-primary hover:text-primary-pop transition-colors">
                Manage books →
              </Link>
            </div>
            
            <div className="space-y-3">
              {authorBooks.map((book) => (
                <div key={book._id} className="flex items-center gap-4 p-4 bg-surface rounded-card border border-border shadow-soft">
                  <div className="w-12 h-16 rounded bg-gradient-to-br from-primary/40 to-support/30 shrink-0 flex items-center justify-center border border-border">
                    <span className="text-white text-[10px] font-display text-center px-1 leading-tight line-clamp-2">
                      {book.title}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-text-primary text-sm truncate">{book.title}</p>
                    <div className="flex flex-wrap gap-3 mt-1 text-xs font-mono text-text-secondary tabular-nums">
                      <span>{formatCount(book.views)} reads</span>
                      <span>{book.chapterCount} chapters</span>
                      <span className={book.status === 'completed' ? 'text-success' : 'text-primary'}>
                        {book.status}
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-mono font-bold text-success text-sm tabular-nums">₹{book.earnings.toLocaleString()}</p>
                    <p className="text-[10px] font-body text-text-secondary">earnings</p>
                  </div>
                  <Link 
                    href={`/dashboard/books/${book._id}/edit`} 
                    className="text-xs font-medium font-body text-primary hover:text-primary-pop transition-colors shrink-0"
                  >
                    Edit →
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Author Quick actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/dashboard/books/create" className="flex items-center gap-4 p-5 rounded-card border border-border bg-surface hover:border-primary/30 hover:shadow-soft transition-all group">
              <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">✍️</span>
              <div>
                <p className="font-body font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">Write a New Book</p>
                <p className="text-xs font-body text-text-secondary">Create a story and schedule your first chapter</p>
              </div>
            </Link>
            <Link href="/dashboard/books/b1/edit" className="flex items-center gap-4 p-5 rounded-card border border-border bg-surface hover:border-primary/30 hover:shadow-soft transition-all group">
              <span className="w-10 h-10 rounded-full bg-support/10 flex items-center justify-center text-xl">📝</span>
              <div>
                <p className="font-body font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">Continue drafting</p>
                <p className="text-xs font-body text-text-secondary">Open chapter editor for Kael & Lira saga</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
