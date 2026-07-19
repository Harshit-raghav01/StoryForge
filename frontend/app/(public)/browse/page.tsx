'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { books, genres, formatCount } from '@/lib/mockData';
import { BookCard } from '@/components/BookCard';

const contentRatings = ['4+', '12+', '16+', '18+'];
const statusOptions = ['ongoing', 'completed', 'draft'];
const sortOptions = [
  { value: 'trending', label: 'Trending' },
  { value: 'newest', label: 'Newest' },
  { value: 'rating', label: 'Top rated' },
  { value: 'views', label: 'Most read' },
];

function FilterSidebar({
  genre, setGenre, rating, setRating, status, setStatus,
  onClear, hasFilters,
}: {
  genre: string; setGenre: (v: string) => void;
  rating: string; setRating: (v: string) => void;
  status: string; setStatus: (v: string) => void;
  onClear: () => void; hasFilters: boolean;
}) {
  return (
    <div className="bg-surface rounded-card border border-border p-5 space-y-6">
      {/* Genre */}
      <div>
        <h3 className="text-xs font-semibold font-body uppercase tracking-wider text-text-secondary mb-3">Genre</h3>
        <div className="flex flex-col gap-1">
          <button onClick={() => setGenre('')} className={`cursor-pointer text-left text-sm font-body px-3 py-2 rounded-lg transition-colors ${genre === '' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}>
            All genres
          </button>
          {genres.map((g) => (
            <button key={g._id} onClick={() => setGenre(g.slug)}
              className={`cursor-pointer text-left text-sm font-body px-3 py-2 rounded-lg transition-colors ${genre === g.slug || genre === g.name.toLowerCase() ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}>
              {g.name}
            </button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-xs font-semibold font-body uppercase tracking-wider text-text-secondary mb-3">Content Rating</h3>
        <div className="flex flex-col gap-1">
          <button onClick={() => setRating('')} className={`cursor-pointer text-left text-sm font-body px-3 py-2 rounded-lg transition-colors ${rating === '' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}>All ages</button>
          {contentRatings.map((r) => (
            <button key={r} onClick={() => setRating(r)} className={`cursor-pointer text-left text-sm font-body px-3 py-2 rounded-lg transition-colors ${rating === r ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}>{r}</button>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <h3 className="text-xs font-semibold font-body uppercase tracking-wider text-text-secondary mb-3">Status</h3>
        <div className="flex flex-col gap-1">
          <button onClick={() => setStatus('')} className={`cursor-pointer text-left text-sm font-body px-3 py-2 rounded-lg transition-colors ${status === '' ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}>All</button>
          {statusOptions.map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={`cursor-pointer capitalize text-left text-sm font-body px-3 py-2 rounded-lg transition-colors ${status === s ? 'bg-primary/10 text-primary font-semibold' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}>{s}</button>
          ))}
        </div>
      </div>

      {hasFilters && (
        <button onClick={onClear} className="cursor-pointer w-full text-sm font-body text-danger hover:text-danger/80 py-2 transition-colors">
          Clear all filters
        </button>
      )}
    </div>
  );
}

function BrowseContent() {
  const searchParams = useSearchParams();
  const [genre, setGenre] = useState(searchParams.get('genre') || '');
  const [rating, setRating] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState(searchParams.get('sort') || 'trending');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    setGenre(searchParams.get('genre') || '');
    setSort(searchParams.get('sort') || 'trending');
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  // Lock scroll when mobile filter open
  useEffect(() => {
    document.body.style.overflow = filterOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [filterOpen]);

  const clearFilters = () => { setGenre(''); setRating(''); setStatus(''); setSearch(''); };
  const hasFilters = !!(genre || rating || status || search);

  let filtered = books.filter((b) => {
    const matchGenre = genre ? b.genreName.toLowerCase() === genre.toLowerCase() || b.genreId === genre || b.genreId === genres.find(g => g.slug === genre)?._id : true;
    const matchRating = rating ? b.contentRating === rating : true;
    const matchStatus = status ? b.status === status : true;
    const matchSearch = search ? b.title.toLowerCase().includes(search.toLowerCase()) || b.authorName.toLowerCase().includes(search.toLowerCase()) : true;
    return matchGenre && matchRating && matchStatus && matchSearch;
  });

  filtered = [...filtered].sort((a, b) => {
    if (sort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    if (sort === 'rating') return b.ratingAvg - a.ratingAvg;
    if (sort === 'views') return b.views - a.views;
    return b.views - a.views;
  });

  return (
    <div className="container-page py-10 pb-16">
      {/* Header */}
      <div className="mb-8 mt-8 ">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-text-primary">
          {genre ? `${genre.charAt(0).toUpperCase() + genre.slice(1)} stories` : 'Browse all stories'}
        </h1>
        <p className="text-text-secondary font-body mt-2">
          {filtered.length} {filtered.length === 1 ? 'story' : 'stories'} found
        </p>
      </div>

      {/* Search + Sort + Filter button */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text" placeholder="Search titles or authors…" value={search}
            onChange={(e) => setSearch(e.target.value)} id="browse-search"
            className="w-full pl-10 pr-4 py-2.5 rounded-input border border-border bg-surface text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <select
          value={sort} onChange={(e) => setSort(e.target.value)} id="browse-sort"
          className="cursor-pointer px-4 py-2.5 rounded-input border border-border bg-surface text-text-primary font-body text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {sortOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {/* Mobile filter button */}
        <button
          onClick={() => setFilterOpen(true)}
          className="cursor-pointer sm:hidden flex items-center justify-center gap-2 px-4 py-2.5 rounded-input border border-border bg-surface text-text-secondary text-sm font-semibold font-body hover:border-primary/40 hover:text-primary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
          Filters {hasFilters && <span className="w-2 h-2 rounded-full bg-primary shrink-0" />}
        </button>
      </div>

      {/* Body: sidebar (desktop always visible) + results */}
      <div className="flex pb-8 gap-8">
        {/* Desktop sidebar — always in layout, never collapses */}
        <aside className="hidden sm:block shrink-0 w-56">
          <div className="sticky top-24">
            <FilterSidebar genre={genre} setGenre={setGenre} rating={rating} setRating={setRating} status={status} setStatus={setStatus} onClear={clearFilters} hasFilters={hasFilters} />
          </div>
        </aside>

        {/* Results grid */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {filtered.length === 0 ? (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-24 text-center">
                <span className="text-6xl mb-5">🔍</span>
                <h2 className="font-display text-xl font-semibold text-text-primary mb-2">No stories found</h2>
                <p className="text-text-secondary font-body text-sm max-w-sm leading-relaxed">
                  Try adjusting your filters or searching for something different.
                </p>
                <button onClick={clearFilters} className="cursor-pointer mt-6 px-5 py-2 rounded-pill bg-primary text-white text-sm font-semibold font-body hover:bg-primary-pop transition-colors">
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch">
                {filtered.map((book, i) => (
                  <BookCard key={book._id} book={book} size="standard" index={i} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Mobile filter drawer (overlay, slides from left) ── */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              key="filter-backdrop"
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm sm:hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
            />
            <motion.div
              key="filter-panel"
              className="fixed top-0 left-0 bottom-0 z-50 w-72 bg-surface border-r border-border shadow-elevated flex flex-col sm:hidden"
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <h2 className="font-display text-lg font-semibold text-text-primary">Filters</h2>
                <button onClick={() => setFilterOpen(false)} className="cursor-pointer w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-alt text-text-secondary">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterSidebar genre={genre} setGenre={(v) => { setGenre(v); }} rating={rating} setRating={(v) => { setRating(v); }} status={status} setStatus={(v) => { setStatus(v); }} onClear={clearFilters} hasFilters={hasFilters} />
              </div>
              <div className="p-4 border-t border-border">
                <button
                  onClick={() => setFilterOpen(false)}
                  className="cursor-pointer w-full py-3 rounded-pill bg-primary text-white text-sm font-bold font-body hover:bg-primary-pop transition-colors"
                >
                  Done — Show {filtered.length} results
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BrowsePage() {
  return (
    <Suspense fallback={<div className="container-page py-10 text-text-secondary font-body">Loading…</div>}>
      <BrowseContent />
    </Suspense>
  );
}
