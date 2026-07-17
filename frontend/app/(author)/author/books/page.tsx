'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { authorBooks, formatCount } from '@/lib/mockData';
import { Button } from '@/components/Button';

const statusColors = {
  ongoing: 'bg-primary/15 text-primary',
  completed: 'bg-success/15 text-success',
  draft: 'bg-border text-text-secondary',
};

export default function MyBooksPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">My Books</h1>
          <p className="text-text-secondary font-body text-sm mt-1">{authorBooks.length} books in your catalogue</p>
        </div>
        <Button href="/author/books/create" variant="primary" size="md">
          + Create new book
        </Button>
      </div>

      <div className="space-y-4">
        {authorBooks.map((book, i) => (
          <motion.div
            key={book._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="flex items-center gap-5 p-5 bg-surface rounded-card border border-border hover:border-primary/30 hover:shadow-card transition-all"
          >
            {/* Cover */}
            <div className="w-16 h-22 rounded-lg bg-gradient-to-br from-primary/40 via-support/30 to-accent/20 shrink-0 flex items-center justify-center border border-border overflow-hidden"
              style={{ height: '88px' }}
            >
              <span className="text-white font-display text-[10px] font-semibold text-center px-2 leading-tight">
                {book.title.split(' ').slice(0, 3).join(' ')}
              </span>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="font-body font-semibold text-text-primary text-base truncate">{book.title}</h2>
                <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold font-body capitalize ${statusColors[book.status]}`}>
                  {book.status}
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-xs font-mono text-text-secondary tabular-nums mt-1">
                <span>{book.chapterCount} chapters</span>
                <span>{formatCount(book.views)} reads</span>
                <span className="text-accent font-bold">{book.ratingAvg.toFixed(1)} ★</span>
                <span className="text-success font-bold">₹{book.earnings.toLocaleString()} earned</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/author/books/${book._id}/editor`}
                className="px-3 py-1.5 rounded-pill text-xs font-medium font-body border border-border text-text-secondary hover:border-primary/40 hover:text-primary transition-colors"
              >
                Edit chapters
              </Link>
              <button className="px-3 py-1.5 rounded-pill text-xs font-medium font-body border border-border text-text-secondary hover:border-primary/40 hover:text-primary transition-colors">
                Analytics
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-alt text-text-secondary transition-colors">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                </svg>
              </button>
            </div>
          </motion.div>
        ))}

        {/* New book CTA tile */}
        <Link
          href="/author/books/create"
          className="flex items-center justify-center gap-3 p-8 rounded-card border-2 border-dashed border-border hover:border-primary/40 hover:bg-primary/5 transition-all group"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary group-hover:text-primary transition-colors">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          <span className="font-body font-medium text-text-secondary group-hover:text-primary transition-colors">
            Start a new story
          </span>
        </Link>
      </div>
    </div>
  );
}
