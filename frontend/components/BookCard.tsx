'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { RibbonProgress } from './RibbonProgress';
import { CoinIcon } from './WaxSealIcon';
import { formatCount } from '@/lib/mockData';

export type BookCardSize = 'featured' | 'standard' | 'compact';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    coverUrl: string;
    authorName: string;
    genreName: string;
    ratingAvg: number;
    views: number;
    status: 'draft' | 'ongoing' | 'completed';
    contentRating: string;
    tags?: string[];
    defaultChapterPrice?: number;
  };
  size?: BookCardSize;
  progress?: number;
  index?: number;
}

export function BookCard({ book, size = 'standard', progress, index = 0 }: BookCardProps) {
  // Mobile: shorter images to avoid thin cards. Desktop: taller.
  const coverH =
    size === 'compact' ? 'h-32 sm:h-36' :
    size === 'featured' ? 'h-44' :
    'h-44 sm:h-52';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group relative bg-surface rounded-card overflow-hidden border border-border shadow-soft hover:shadow-card transition-all duration-300 h-full
        ${size === 'featured' ? 'flex gap-4 p-4' : 'flex flex-col'}`}
    >
      {/* Cover */}
      <Link
        href={`/book/${book._id}`}
        className={`relative shrink-0 overflow-hidden rounded-lg bg-surface-alt
          ${size === 'featured' ? 'w-28 h-40' : `w-full ${coverH}`}`}
        id={`book-card-${book._id}`}
      >
        <Image
          src={book.coverUrl}
          alt={book.title}
          loading='eager'
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes={size === 'compact' ? '160px' : size === 'featured' ? '112px' : '280px'}
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10" />

        {/* Status */}
        <span className={`absolute top-2 left-2 z-20 px-2 py-0.5 rounded-pill text-[10px] font-semibold font-body
          ${book.status === 'completed' ? 'bg-success/90 text-white' : book.status === 'ongoing' ? 'bg-primary/90 text-white' : 'bg-surface/80 text-text-secondary'}`}>
          {book.status === 'ongoing' ? 'Ongoing' : book.status === 'completed' ? 'Complete' : 'Draft'}
        </span>

        {/* 18+ badge */}
        {book.contentRating === '18+' && (
          <span className="absolute top-2 right-2 z-20 px-1.5 py-0.5 rounded text-[9px] font-bold bg-danger/90 text-white">18+</span>
        )}

        {/* Read progress */}
        {progress !== undefined && (
          <div className="absolute bottom-2 right-2 z-20">
            <RibbonProgress progress={progress} height={50} />
          </div>
        )}
      </Link>

      {/* Info */}
      <div className={`flex flex-col gap-2 ${size === 'featured' ? 'flex-1 min-w-0 justify-between py-1' : 'p-3'}`}>
        <div>
          <Link href={`/book/${book._id}`} className="block hover:text-primary transition-colors">
            <h3 className={`font-display font-semibold text-text-primary line-clamp-2 leading-snug
              ${size === 'compact' ? 'text-xs' : 'text-sm'}`}>
              {book.title}
            </h3>
          </Link>
          <p className="text-[11px] font-body text-text-secondary mt-0.5 truncate">{book.authorName}</p>
        </div>

        <div className="flex flex-wrap gap-1">
          <span className="px-2 py-0.5 rounded-pill text-[10px] font-semibold bg-primary/10 text-primary font-body">
            {book.genreName}
          </span>
          {book.tags && size !== 'compact' && book.tags[0] && (
            <span className="px-2 py-0.5 rounded-pill text-[10px] font-medium bg-surface-alt text-text-secondary font-body border border-border">
              {book.tags[0]}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="text-xs font-mono font-bold tabular-nums text-[#C9952A]">{book.ratingAvg.toFixed(1)}</span>
            <span className="text-[#D4AF37] text-xs">★</span>
          </div>
          <div className="flex items-center gap-1 text-text-secondary">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span className="text-[10px] font-mono tabular-nums">{formatCount(book.views)}</span>
          </div>
        </div>

        {size === 'featured' && book.defaultChapterPrice !== undefined && (
          <div className="flex items-center gap-1.5 text-primary">
            <CoinIcon size={13} />
            <span className="text-xs font-mono font-semibold">{book.defaultChapterPrice} / ch</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
