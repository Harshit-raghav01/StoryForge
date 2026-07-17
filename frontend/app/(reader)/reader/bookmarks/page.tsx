'use client';

import { bookmarks, books } from '@/lib/mockData';

export default function BookmarksPage() {
  const bookmarkEntries = bookmarks.map((bm) => ({ bm, book: books.find((b) => b._id === bm.bookId) }));
  return (
    <div className='mt-4'>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-8">Bookmarks</h1>
      {bookmarkEntries.length === 0 ? (
        <div className="text-center py-20"><span className="text-5xl">🔖</span><p className="font-body text-text-secondary mt-4">No bookmarks yet.</p></div>
      ) : (
        <div className="space-y-3">
          {bookmarkEntries.map(({ bm, book }) => (
            <div key={bm._id} className="flex items-center justify-between p-4 bg-surface rounded-card border border-border">
              <div>
                <p className="font-body font-semibold text-text-primary text-sm">{book?.title}</p>
                <p className="text-xs font-body text-text-secondary mt-0.5">Chapter {bm.chapterId}</p>
              </div>
              <a href={`/book/${bm.bookId}/read/${bm.chapterId}`} className="text-xs font-medium font-body text-primary hover:text-primary-pop transition-colors">Continue →</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
