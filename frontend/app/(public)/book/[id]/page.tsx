'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  books, getBookById, chaptersForBook1, reviewsForBook1,
  ratingBreakdownForBook1, formatCount, timeAgo
} from '@/lib/mockData';
import { RadialRating } from '@/components/RadialRating';
import { RibbonProgress } from '@/components/RibbonProgress';
import { WaxSealIcon, CoinIcon } from '@/components/WaxSealIcon';
import { Button, Badge } from '@/components/Button';
import { BookCard } from '@/components/BookCard';

const PLACEHOLDER_COLORS = [
  'from-primary/50 via-support/30 to-accent/20',
  'from-accent/40 via-primary/20 to-support/30',
  'from-support/40 via-primary/30 to-accent/20',
];

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const book = getBookById(id) || books[0];
  const colorClass = PLACEHOLDER_COLORS[parseInt(book._id.replace('b', ''), 10) % 3];

  // For demo: use chaptersForBook1 regardless of which book is shown
  const chapters = chaptersForBook1;
  const reviews = reviewsForBook1;
  const ratingBreakdown = ratingBreakdownForBook1;
  const total = Object.values(ratingBreakdown).reduce((a, b) => a + b, 0);

  const [showAllChapters, setShowAllChapters] = useState(false);
  const displayedChapters = showAllChapters ? chapters : chapters.slice(0, 8);

  const relatedBooks = books.filter((b) => b._id !== book._id && b.genreId === book.genreId).slice(0, 4);
  const moreLikeThis = books.filter((b) => b._id !== book._id).slice(0, 4);

  return (
    <div>
      {/* ─── Hero breadcrumb ─────────────────────────────────── */}
      <div className="border-b border-border bg-surface py-3">
        <div className="container-page">
          <nav className="text-xs font-body text-text-secondary flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
            <span>/</span>
            <Link href={`/browse?genre=${book.genreName.toLowerCase()}`} className="hover:text-text-primary transition-colors">{book.genreName}</Link>
            <span>/</span>
            <span className="text-text-primary truncate max-w-48">{book.title}</span>
          </nav>
        </div>
      </div>

      {/* ─── Main detail section ──────────────────────────────── */}
      <section className="container-page py-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* LEFT: Cover + Actions */}
          <div className="flex flex-col items-center lg:items-start shrink-0 lg:w-56">
            {/* Cover */}
            <div className="relative w-44 lg:w-full aspect-[3/4] rounded-card overflow-hidden border border-border shadow-card flex-shrink-0">
              <div className={`absolute inset-0 bg-gradient-to-b ${colorClass}`} />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-4 gap-3">
                <WaxSealIcon size={44} />
                <p className="text-white font-display font-semibold text-sm text-center leading-snug">{book.title}</p>
                <p className="text-white/60 text-xs font-body">{book.authorName}</p>
              </div>
              {/* Ribbon progress (demo: 18% read) */}
              <div className="absolute top-3 right-3">
                <RibbonProgress progress={0.18} height={80} />
              </div>
              {/* Status */}
              <div className="absolute bottom-3 left-3">
                <span className={`px-2 py-0.5 rounded-pill text-[10px] font-bold font-body
                  ${book.status === 'completed' ? 'bg-success/90 text-white' : 'bg-primary/90 text-white'}`}>
                  {book.status === 'completed' ? 'Complete' : 'Ongoing'}
                </span>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-2 w-44 lg:w-full mt-5">
              <Button href={`/book/${book._id}/read/ch1`} fullWidth size="lg" variant="primary">
                Start reading
              </Button>
              <Button fullWidth size="md" variant="secondary">
                + Add to library
              </Button>
            </div>

            {/* Share row */}
            <div className="flex items-center gap-2 mt-4">
              <span className="text-xs font-body text-text-secondary">Share:</span>
              {['Twitter', 'Copy link'].map((label) => (
                <button key={label} className="text-xs font-body text-text-secondary hover:text-primary transition-colors px-2 py-1 rounded hover:bg-surface-alt">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Metadata */}
          <div className="flex-1 min-w-0">
            {/* Title */}
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-text-primary leading-tight mb-2">
              {book.title}
            </h1>

            {/* Author */}
            <p className="font-body text-text-secondary mb-4">
              by{' '}
              <Link href={`/author/${book.authorId}`} className="text-primary hover:text-primary-pop font-medium transition-colors">
                {book.authorName}
              </Link>
            </p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge>{book.language}</Badge>
              <Badge variant={book.contentRating === '18+' ? 'danger' : 'default'}>{book.contentRating}</Badge>
              <Badge variant="support">{book.genreName}</Badge>
              <Badge variant={book.status === 'completed' ? 'success' : 'default'}>
                {book.status === 'completed' ? '✓ Completed' : '● Ongoing'}
              </Badge>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-6 mb-6 pb-6 border-b border-border">
              <RadialRating rating={book.ratingAvg} count={book.ratingCount} size={90} />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  <span className="text-sm font-mono tabular-nums text-text-primary font-bold">{formatCount(book.views)}</span>
                  <span className="text-xs font-body">views</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  <span className="text-sm font-mono tabular-nums text-text-primary font-bold">{book.chapterCount}</span>
                  <span className="text-xs font-body">chapters</span>
                </div>
                <div className="flex items-center gap-2 text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  <span className="text-xs font-body">Updated {timeAgo(book.updatedAt)}</span>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="mb-6">
              <h2 className="font-display text-lg font-semibold text-text-primary mb-3">Synopsis</h2>
              <p className="font-body text-text-secondary leading-relaxed text-sm">{book.synopsis}</p>
            </div>

            {/* Genre / Trope chips */}
            <div className="flex flex-wrap gap-2">
              {book.tags.map((tag) => (
                <span key={tag} className="px-3 py-1 rounded-pill text-xs font-medium font-body bg-support/15 text-support border border-support/20">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Chapter list ─────────────────────────────────────── */}
      <section className="border-t border-border bg-surface-alt py-10">
        <div className="container-page">
          {/* Unlock full book banner */}
          <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-card bg-gradient-to-r from-primary/10 to-support/10 border border-primary/20">
            <div className="flex items-center gap-3">
              <WaxSealIcon size={36} />
              <div>
                <p className="font-body font-semibold text-text-primary text-sm">Unlock the full book</p>
                <p className="text-text-secondary text-xs font-body mt-0.5">
                  {book.chapterCount - book.freeChapterCount} locked chapters · Save vs unlocking individually
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="flex items-center gap-1.5">
                  <CoinIcon size={16} />
                  <span className="font-mono font-bold text-accent text-lg">{book.fullBookUnlockPrice}</span>
                </div>
                <span className="text-[10px] font-body text-success">Save ~40%</span>
              </div>
              <Button variant="accent" size="md">Unlock full book</Button>
            </div>
          </div>

          <h2 className="font-display text-xl font-semibold text-text-primary mb-4">Chapters</h2>
          <div className="space-y-1.5">
            {displayedChapters.map((ch) => (
              <div key={ch._id} className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors
                ${ch.isFree
                  ? 'bg-surface border-border hover:border-primary/30'
                  : 'bg-surface-alt border-border opacity-90'}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-mono text-xs text-text-secondary tabular-nums w-8 shrink-0">
                    {String(ch.order).padStart(2, '0')}
                  </span>
                  <span className="font-body text-sm text-text-primary truncate">{ch.title}</span>
                  {ch.isFree && (
                    <span className="shrink-0 px-2 py-0.5 rounded-pill text-[10px] font-bold bg-success/20 text-success font-body">Free</span>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-3">
                  {ch.isFree ? (
                    <Link href={`/book/${book._id}/read/${ch._id}`} className="text-xs font-medium font-body text-primary hover:text-primary-pop transition-colors">
                      Read
                    </Link>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <CoinIcon size={13} />
                      <span className="font-mono text-xs text-accent font-bold">{ch.coinPrice}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {chapters.length > 8 && (
            <button
              onClick={() => setShowAllChapters(!showAllChapters)}
              className="mt-4 w-full py-3 text-sm font-medium font-body text-text-secondary border border-dashed border-border rounded-lg hover:border-primary/30 hover:text-primary transition-colors"
            >
              {showAllChapters ? 'Show less' : `Show all ${chapters.length} chapters`}
            </button>
          )}
        </div>
      </section>

      {/* ─── Ratings breakdown ───────────────────────────────── */}
      <section className="border-t border-border py-10">
        <div className="container-page">
          <div className="grid md:grid-cols-2 gap-10">
            {/* Breakdown bars */}
            <div>
              <h2 className="font-display text-xl font-semibold text-text-primary mb-5">Ratings breakdown</h2>
              <div className="space-y-2">
                {[10, 9, 8, 7, 6, 5, 4, 3, 2, 1].map((score) => {
                  const count = ratingBreakdown[score] || 0;
                  const pct = total > 0 ? (count / total) * 100 : 0;
                  return (
                    <div key={score} className="flex items-center gap-3">
                      <span className="font-mono text-xs text-text-secondary w-4 tabular-nums text-right">{score}</span>
                      <div className="flex-1 h-2 rounded-full bg-border overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-accent"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: (10 - score) * 0.04, ease: 'easeOut' }}
                        />
                      </div>
                      <span className="font-mono text-xs text-text-secondary w-8 tabular-nums">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display text-xl font-semibold text-text-primary">Reader reviews</h2>
                <button className="text-sm font-medium font-body text-primary hover:text-primary-pop transition-colors">
                  Write a review
                </button>
              </div>
              <div className="space-y-4">
                {reviews.map((r) => (
                  <div key={r._id} className="bg-surface-alt rounded-card p-4 border border-border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-support/20 flex items-center justify-center shrink-0">
                          <span className="text-white font-display font-semibold text-xs">{r.userName.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium font-body text-text-primary">{r.userName}</p>
                          <p className="text-[10px] font-mono text-text-secondary">{timeAgo(r.createdAt)}</p>
                        </div>
                      </div>
                      <span className="text-accent font-mono font-bold text-sm">{r.rating}/10</span>
                    </div>
                    <p className="text-sm font-body text-text-secondary leading-relaxed">{r.text}</p>
                    <div className="flex items-center gap-1 mt-2 text-text-secondary">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/><path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                      <span className="text-[10px] font-body">{r.helpfulCount} found helpful</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Related carousels ───────────────────────────────── */}
      {relatedBooks.length > 0 && (
        <section className="border-t border-border bg-surface-alt py-10">
          <div className="container-page">
            <h2 className="font-display text-xl font-semibold text-text-primary mb-6">More {book.genreName}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {relatedBooks.map((b, i) => <BookCard key={b._id} book={b} size="standard" index={i} />)}
            </div>
          </div>
        </section>
      )}
      <section className="border-t border-border py-10">
        <div className="container-page">
          <h2 className="font-display text-xl font-semibold text-text-primary mb-6">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {moreLikeThis.map((b, i) => <BookCard key={b._id} book={b} size="standard" index={i} />)}
          </div>
        </div>
      </section>
    </div>
  );
}
