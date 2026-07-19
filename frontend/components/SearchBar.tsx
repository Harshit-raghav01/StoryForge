'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { books, formatCount } from '@/lib/mockData';

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function SearchBar({
  className = '',
  placeholder = 'Search what you want',
  size = 'md',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const containerRef = useRef<HTMLFormElement>(null);
  const router = useRouter();

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close desktop dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when mobile search modal is open
  useEffect(() => {
    if (isMobileModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileModalOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    setIsMobileModalOpen(false);
    if (query.trim()) {
      router.push(`/browse?search=${encodeURIComponent(query.trim())}`);
    } else {
      router.push('/browse');
    }
  };

  const handleInputFocus = () => {
    if (isMobile) {
      setIsMobileModalOpen(true);
    } else {
      setIsDropdownOpen(true);
    }
  };

  // Filter books in real-time
  const filteredBooks = books.filter((b) => {
    if (!query.trim()) return false;
    const q = query.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.authorName.toLowerCase().includes(q);
  });

  // Highlight matching search term text
  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return <span>{text}</span>;
    const regex = new RegExp(`(${highlight.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  // Recommended list for empty state (6 books for mobile grid, 3 for desktop quick list)
  const recommendedBooks = [books[0], books[1], books[3], books[4], books[5], books[9]];
  const desktopQuickList = books.slice(0, 3);

  const pyClass = size === 'sm' ? 'py-1.5 pl-4 pr-10 text-xs' : 'py-3 pl-6 pr-12 text-sm';
  const iconRight = size === 'sm' ? 'right-3' : 'right-4';
  const iconSize = size === 'sm' ? 14 : 18;

  return (
    <>
      <form
        ref={containerRef}
        onSubmit={handleSearch}
        className={`relative w-full flex items-center ${className}`}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          className={`w-full rounded-full border border-border bg-surface-alt text-text-primary font-body placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface transition-all ${pyClass}`}
        />
        <button
          type="submit"
          className={`absolute ${iconRight} p-1 text-text-secondary hover:text-primary transition-colors cursor-pointer flex items-center justify-center`}
          aria-label="Search"
        >
          <svg
            width={iconSize}
            height={iconSize}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </button>

        {/* ─── DESKTOP DROPDOWN ────────────────────────────────────────── */}
        {!isMobile && isDropdownOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-surface border border-border shadow-elevated rounded-xl z-50 overflow-hidden max-h-[400px] overflow-y-auto">
            {query.trim() === '' ? (
              <div className="p-4 font-body">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-3">
                  Recommended for you
                </h4>
                <div className="flex flex-col gap-2">
                  {desktopQuickList.map((book) => (
                    <Link
                      key={book._id}
                      href={`/book/${book._id}`}
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-alt transition-colors"
                    >
                      <img
                        src={book.coverUrl}
                        alt=""
                        className="w-8 h-12 object-cover rounded bg-surface-alt shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="font-semibold text-xs text-text-primary truncate">
                          {book.title}
                        </div>
                        <div className="text-[10px] text-text-secondary truncate">
                          {book.authorName}
                        </div>
                      </div>
                      <div className="text-[10px] font-semibold text-primary">
                        {book.genreName}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-2 font-body">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary px-3 py-2">
                  Search Results
                </h4>
                {filteredBooks.length === 0 ? (
                  <div className="text-xs text-text-secondary p-3 text-center">
                    No books found matching &quot;{query}&quot;
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {filteredBooks.slice(0, 5).map((book) => (
                      <Link
                        key={book._id}
                        href={`/book/${book._id}`}
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-surface-alt transition-colors"
                      >
                        <img
                          src={book.coverUrl}
                          alt=""
                          className="w-8 h-12 object-cover rounded bg-surface-alt shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-xs text-text-primary truncate">
                            {highlightText(book.title, query)}
                          </div>
                          <div className="text-[10px] text-text-secondary truncate">
                            By {book.authorName}
                          </div>
                        </div>
                        <div className="text-[10px] font-mono text-text-secondary">
                          ★ {book.ratingAvg.toFixed(1)}
                        </div>
                      </Link>
                    ))}
                    {filteredBooks.length > 5 && (
                      <button
                        type="submit"
                        className="w-full text-center text-xs font-semibold text-primary hover:text-primary-pop py-2 border-t border-border mt-1 transition-colors cursor-pointer"
                      >
                        See all results (+{filteredBooks.length - 5})
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </form>

      {/* ─── MOBILE FULLSCREEN MODAL ───────────────────────────────────── */}
      {isMobile && isMobileModalOpen && (
        <div className="fixed inset-0 bg-surface z-50 flex flex-col overflow-y-auto">
          {/* Header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border sticky top-0 bg-surface z-10">
            {/* Back button */}
            <button
              onClick={() => {
                setIsMobileModalOpen(false);
                setQuery('');
              }}
              className="p-1.5 text-text-primary hover:bg-surface-alt rounded-full transition-colors cursor-pointer shrink-0"
              aria-label="Back"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="19" y1="12" x2="5" y2="12" />
                <polyline points="12 19 5 12 12 5" />
              </svg>
            </button>

            {/* Input wrapper */}
            <div className="relative flex-1 flex items-center">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="absolute left-4 text-text-secondary"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                autoFocus
                placeholder={placeholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-2.5 pl-10 pr-10 rounded-full border border-border bg-surface-alt text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-surface transition-all"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-3 p-1 rounded-full bg-border/40 hover:bg-border/60 text-text-secondary transition-colors cursor-pointer flex items-center justify-center"
                  aria-label="Clear text"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
            </div>

            {/* Search text button */}
            <button
              onClick={handleSearch}
              className="text-sm font-bold text-primary hover:text-primary-pop px-2 py-1.5 transition-colors cursor-pointer shrink-0"
            >
              Search
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 px-4 py-6">
            {query.trim() === '' ? (
              <div>
                {/* Trending section */}
                <h3 className="font-display font-semibold text-base text-text-primary mb-3">Trending</h3>
                <div className="flex flex-col gap-2 mb-6">
                  {["The Alpha's Unwanted Bride", "Throne of Ember and Ash", "His Contract Wife"].map((phrase) => (
                    <button
                      key={phrase}
                      onClick={() => setQuery(phrase)}
                      className="w-full text-left px-5 py-3 rounded-full border border-border bg-surface-alt hover:bg-surface hover:border-primary text-sm font-body text-text-secondary hover:text-text-primary transition-colors cursor-pointer truncate"
                    >
                      {phrase}
                    </button>
                  ))}
                </div>

                {/* You May Also Like section */}
                <h3 className="font-display font-semibold text-base text-text-primary mb-4">You May Also Like</h3>
                <div className="grid grid-cols-3 gap-3 mb-8">
                  {recommendedBooks.map((book) => (
                    <Link
                      key={book._id}
                      href={`/book/${book._id}`}
                      onClick={() => setIsMobileModalOpen(false)}
                      className="flex flex-col gap-1.5 group"
                    >
                      <div className="relative aspect-[2/3] w-full rounded-card overflow-hidden bg-surface-alt border border-border/50 transition-colors shadow-soft">
                        <img
                          src={book.coverUrl}
                          alt=""
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <div>
                        <h4 className="font-body font-semibold text-[11px] text-text-primary line-clamp-2 leading-tight">
                          {book.title}
                        </h4>
                        <p className="text-[9px] font-semibold text-primary mt-0.5">{book.genreName}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Trending Keywords section */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-display font-semibold text-base text-text-primary">Trending keyword</h3>
                  <Link
                    href="/browse"
                    onClick={() => setIsMobileModalOpen(false)}
                    className="text-xs font-semibold text-primary hover:text-primary-pop transition-colors"
                  >
                    See more
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2 pb-8">
                  {['billionaire', 'werewolf', 'romance', 'fantasy', 'mafia'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag)}
                      className="px-4 py-2 rounded-full border border-border bg-surface-alt hover:bg-surface hover:border-primary text-xs font-body text-text-secondary hover:text-primary transition-colors cursor-pointer capitalize"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                {/* Search result list */}
                {filteredBooks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <span className="text-4xl mb-4">🔍</span>
                    <h4 className="font-display font-semibold text-text-primary text-sm mb-1">
                      No results found
                    </h4>
                    <p className="text-xs text-text-secondary max-w-[200px] leading-relaxed">
                      We couldn&apos;t find any stories matching &quot;{query}&quot;.
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {filteredBooks.map((book) => (
                      <Link
                        key={book._id}
                        href={`/book/${book._id}`}
                        onClick={() => {
                          setIsMobileModalOpen(false);
                          setQuery('');
                        }}
                        className="flex items-center gap-4 py-3.5 border-b border-border/40 hover:bg-surface-alt/20 transition-colors"
                      >
                        <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-surface-alt border border-border/20">
                          <img
                            src={book.coverUrl}
                            alt=""
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-body font-semibold text-sm text-text-primary truncate">
                            {highlightText(book.title, query)}
                          </h4>
                          <p className="text-[11px] text-text-secondary mt-1 flex items-center gap-2">
                            <span className="font-semibold text-primary">{book.genreName}</span>
                            <span>·</span>
                            <span className="capitalize">{book.status}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-text-secondary font-mono bg-surface-alt px-2 py-1 rounded-md shrink-0">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span>{formatCount(book.views)}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
