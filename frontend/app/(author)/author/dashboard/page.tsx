'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { authorBooks, formatCount } from '@/lib/mockData';

const stats = [
  { label: 'Total books', value: '2', icon: '📚' },
  { label: 'Total reads', value: formatCount(1_234_900), icon: '👁' },
  { label: 'This month', value: '₹24,500', icon: '💰' },
  { label: 'Avg rating', value: '9.0 ★', icon: '⭐' },
];

const fadeUp: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function AuthorDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Author overview</h1>
        <p className="text-text-secondary font-body text-sm mt-1">Welcome back, Raven</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.06 }}
            className="bg-surface rounded-card border border-border p-5"
          >
            <div className="text-2xl mb-2">{stat.icon}</div>
            <p className="font-mono text-2xl font-bold text-text-primary tabular-nums">{stat.value}</p>
            <p className="text-xs font-body text-text-secondary mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* My Books quick view */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-lg font-semibold text-text-primary">My books</h2>
          <Link href="/author/books" className="text-sm font-body text-primary hover:text-primary-pop transition-colors">View all</Link>
        </div>
        <div className="space-y-3">
          {authorBooks.map((book) => (
            <div key={book._id} className="flex items-center gap-4 p-4 bg-surface rounded-card border border-border">
              <div className="w-12 h-16 rounded-lg bg-gradient-to-br from-primary/40 to-support/30 shrink-0 flex items-center justify-center">
                <span className="text-white text-[10px] font-display text-center px-1">{book.title.split(' ').slice(0, 2).join(' ')}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body font-semibold text-text-primary text-sm truncate">{book.title}</p>
                <div className="flex flex-wrap gap-3 mt-1 text-xs font-mono text-text-secondary tabular-nums">
                  <span>{formatCount(book.views)} reads</span>
                  <span>{book.chapterCount} chapters</span>
                  <span className={book.status === 'completed' ? 'text-success' : 'text-primary'}>{book.status}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="font-mono font-bold text-success text-sm tabular-nums">₹{book.earnings.toLocaleString()}</p>
                <p className="text-[10px] font-body text-text-secondary mt-0.5">earnings</p>
              </div>
              <Link href={`/author/books/${book._id}/editor`} className="text-xs font-medium font-body text-primary hover:text-primary-pop transition-colors shrink-0">
                Edit →
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link href="/author/books/create" className="flex items-center gap-4 p-5 rounded-card border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 transition-all group">
          <span className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-xl">✍️</span>
          <div>
            <p className="font-body font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">Create a new book</p>
            <p className="text-xs font-body text-text-secondary">Start a new story</p>
          </div>
        </Link>
        <Link href="/author/books/b1/editor" className="flex items-center gap-4 p-5 rounded-card border-2 border-dashed border-border hover:border-primary/30 hover:bg-surface-alt transition-all group">
          <span className="w-10 h-10 rounded-full bg-surface-alt flex items-center justify-center text-xl">📝</span>
          <div>
            <p className="font-body font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">Continue writing</p>
            <p className="text-xs font-body text-text-secondary">Open chapter editor</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
