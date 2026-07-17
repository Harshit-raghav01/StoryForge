'use client';

import { readingHistory, timeAgo } from '@/lib/mockData';
import Link from 'next/link';

export default function HistoryPage() {
  return (
    <div className='mt-4'>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-8">Reading History</h1>
      {readingHistory.length === 0 ? (
        <div className="text-center py-20">
          <span className="text-5xl">🕐</span>
          <p className="font-body text-text-secondary mt-4">No reading history yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {readingHistory.map((item) => (
            <div key={item._id} className="flex items-center justify-between p-4 bg-surface rounded-card border border-border">
              <div>
                <Link href={`/book/${item.bookId}`} className="font-body font-semibold text-text-primary text-sm hover:text-primary transition-colors">
                  {item.bookTitle}
                </Link>
                <p className="text-xs font-body text-text-secondary mt-0.5">{item.chapterTitle}</p>
              </div>
              <span className="text-xs font-mono text-text-secondary tabular-nums">{timeAgo(item.readAt)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
