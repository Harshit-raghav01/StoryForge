'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { motion, type Variants } from 'framer-motion';
import { getAuthorById, authors, books, formatCount } from '@/lib/mockData';
import { BookCard } from '@/components/BookCard';
import { Button, Badge } from '@/components/Button';
import { WaxSealIcon } from '@/components/WaxSealIcon';

// Motion variants defined outside components to avoid recreation on render
const containerVariants: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

export default function AuthorPublicProfilePage() {
  const { id } = useParams<{ id: string }>();
  const author = getAuthorById(id) || authors.find(a => a._id === id) || authors[0];

  // Filter books written by this author
  const authorBooks = books.filter((b) => b.authorId === author._id);

  // Calculate dynamic total reads (views) from all books
  const totalReads = authorBooks.reduce((sum, b) => sum + b.views, 0);

  // Follower state
  const [isFollowing, setIsFollowing] = useState(false);
  const [followerCount, setFollowerCount] = useState(author.followerCount);

  const handleFollowToggle = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount((prev) => prev - 1);
    } else {
      setIsFollowing(true);
      setFollowerCount((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-bg">
      {/* ─── BREADCRUMB ─────────────────────────────────────────── */}
      <div className="border-b border-border bg-surface py-3">
        <div className="container-page">
          <nav className="text-xs font-body text-text-secondary flex items-center gap-2" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-text-primary transition-colors">Home</Link>
            <span>/</span>
            <span className="text-text-secondary">Authors</span>
            <span>/</span>
            <span className="text-text-primary font-medium">{author.name}</span>
          </nav>
        </div>
      </div>

      {/* ─── HERO BANNER ────────────────────────────────────────── */}
      <div className="relative h-44 sm:h-56 bg-gradient-to-r from-primary via-[#522555] to-accent overflow-hidden border-b border-border">
        {/* Subtle mesh background shapes */}
        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[200%] bg-radial-gradient from-support/15 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-50%] right-[-10%] w-[60%] h-[180%] bg-radial-gradient from-accent/15 to-transparent rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* ─── PROFILE OVERVIEW ───────────────────────────────────── */}
      <div className="container-page relative -mt-16 sm:-mt-20 mb-10 z-10">
        <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-6 pb-6 border-b border-border bg-transparent">
          
          {/* Avatar and Name */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end text-center sm:text-left gap-5 sm:gap-6">
            <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-surface shadow-elevated bg-surface-alt shrink-0">
              <Image 
                src={author.avatarUrl} 
                alt={author.name} 
                fill 
                className="object-cover"
                sizes="(max-width: 640px) 128px, 144px"
              />
            </div>
            
            <div className="mb-2">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                <h1 className="font-display text-2xl sm:text-3xl font-semibold text-text-primary leading-tight">
                  {author.name}
                </h1>
                {author.isApproved && (
                  <Badge variant="success" className="h-5 py-0.5 text-[10px] tracking-wider uppercase font-semibold">
                    ✓ Verified Author
                  </Badge>
                )}
              </div>
              <p className="font-body text-xs text-text-secondary max-w-md">
                Inkveil serialist since 2024
              </p>
            </div>
          </div>

          {/* Follow Actions */}
          <div className="mb-2 shrink-0">
            <Button
              variant={isFollowing ? 'secondary' : 'primary'}
              size="md"
              onClick={handleFollowToggle}
              icon={
                isFollowing ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                )
              }
              className="shadow-soft"
            >
              {isFollowing ? 'Following' : 'Follow Author'}
            </Button>
          </div>

        </div>
      </div>

      {/* ─── MAIN CONTENT ───────────────────────────────────────── */}
      <main className="container-page py-4 pb-20">
        <motion.div 
          className="grid py-4 grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
          variants={containerVariants}
          initial="initial"
          animate="animate"
        >
          {/* LEFT COLUMN: Stats & About */}
          <motion.div className="lg:col-span-4 space-y-6" variants={itemVariants}>
            
            {/* Stats Panel */}
            <div className="bg-surface rounded-card p-6 border border-border shadow-soft">
              <h2 className="font-display text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
                <WaxSealIcon size={18} />
                <span>Stats Overview</span>
              </h2>
              <div className="grid grid-cols-3 gap-2 text-center divide-x divide-border">
                <div>
                  <p className="font-mono text-lg font-bold text-text-primary tabular-nums">
                    {formatCount(followerCount)}
                  </p>
                  <p className="text-[10px] font-body text-text-secondary uppercase tracking-wider mt-0.5">Followers</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-text-primary tabular-nums">
                    {authorBooks.length}
                  </p>
                  <p className="text-[10px] font-body text-text-secondary uppercase tracking-wider mt-0.5">books</p>
                </div>
                <div>
                  <p className="font-mono text-lg font-bold text-text-primary tabular-nums">
                    {formatCount(totalReads)}
                  </p>
                  <p className="text-[10px] font-body text-text-secondary uppercase tracking-wider mt-0.5">Reads</p>
                </div>
              </div>
            </div>

            {/* About / Bio */}
            <div className="bg-surface rounded-card p-6 border border-border shadow-soft">
              <h3 className="font-display text-base font-semibold text-text-primary mb-3">About the Author</h3>
              <p className="font-body text-sm text-text-secondary leading-relaxed mb-4">
                {author.bio || "No biography details available."}
              </p>
              
              <div className="border-t border-border pt-4 mt-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-body text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
                  <span>Active in Werewolf, Romance, Mafia</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-body text-text-secondary">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>Replies to readers daily</span>
                </div>
              </div>
            </div>

          </motion.div>

          {/* RIGHT COLUMN: books List */}
          <motion.div className="lg:col-span-8 space-y-6" variants={itemVariants}>
            
            <div>
              <h2 className="font-display text-xl font-semibold text-text-primary mb-1">
                Published books
              </h2>
              <p className="text-xs font-body text-text-secondary">
                Read chapters and follow progress updates
              </p>
            </div>

            {authorBooks.length === 0 ? (
              <div className="bg-surface rounded-card p-12 text-center border border-dashed border-border">
                <div className="text-4xl mb-3">📚</div>
                <p className="font-body text-sm font-semibold text-text-primary mb-1">No published books yet</p>
                <p className="font-body text-xs text-text-secondary">Check back soon for serial chapters!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {authorBooks.map((book, i) => (
                  <div key={book._id} className="h-full">
                    <BookCard book={book} size="standard" index={i} />
                  </div>
                ))}
              </div>
            )}

          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
