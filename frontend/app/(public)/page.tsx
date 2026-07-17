'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, type Variants } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import "swiper/css/navigation";

import { books, authors, genres, testimonials, formatCount } from '@/lib/mockData';
import { BookCard } from '@/components/BookCard';
import { WaxSealIcon, CoinIcon } from '@/components/WaxSealIcon';
import { Button, Badge } from '@/components/Button';

// Hero: 3 curated featured books
const heroBooks = [books[3], books[5], books[0]]; // Vow of Silence, The Last Siren, Alpha's Bride
const featuredBooks = [books[0], books[1], books[5], books[9]];
const trendingBooks = books.slice(2, 8);
const newReleases = books.slice(6, 10);

const stagger: Variants = { animate: { transition: { staggerChildren: 0.08 } } };
const fadeUp: Variants = { initial: { opacity: 0, y: 28 }, animate: { opacity: 1, y: 0 } };

export default function HomePage() {
  return (
    <div className="flex  flex-col">

      {/* ─── HERO SWIPER ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <Swiper
          modules={[Autoplay, Pagination, EffectFade, Navigation ]}
          effect="fade"
          autoplay={{ delay: 2500, disableOnInteraction: false }}
          loop
          pagination={{ clickable: true }}
          navigation={true}
          className="hero-swiper"
          style={{ 
            '--swiper-pagination-color': 'var(--color-primary)', 
            '--swiper-pagination-bullet-inactive-color': 'var(--color-text-secondary)', 
            '--swiper-pagination-bullet-inactive-opacity': '0.4' 
          } as React.CSSProperties}
        >
          {/* ── Slide 1-3: Featured books ── */}
          {heroBooks.map((book) => (
            <SwiperSlide key={book._id}>
              <div className="relative overflow-hidden bg-gradient-to-br from-bg via-surface to-primary/5 min-h-[600px] md:min-h-[680px] flex items-center transition-colors duration-300">
                {/* BG image blurred */}
                <div className="absolute inset-0 z-0">
                  <Image src={book.coverUrl} alt="" fill className="object-cover scale-105 blur-sm opacity-10 dark:opacity-25 saturate-50 transition-opacity duration-300" sizes="100vw" />
                  <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/80 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg/60 to-transparent" />
                </div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9952A]/8 rounded-full blur-[100px] translate-x-1/4 -translate-y-1/4 pointer-events-none z-0" />

                <div className="container-page py-20 md:py-28 grid md:grid-cols-2 gap-12 items-center relative z-10">
                  <div className="text-text-primary">
                    <div className="flex items-center gap-2 mb-5">
                      <Badge variant="accent">Featured</Badge>
                      <Badge variant="support">{book.genreName}</Badge>
                      <span className="px-2 py-0.5 rounded-pill text-[10px] font-bold bg-surface-alt text-text-secondary border border-border">{book.contentRating}</span>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight mb-5">{book.title}</h1>
                    <p className="text-text-secondary font-body text-base mb-2">By <span className="text-text-primary font-semibold">{book.authorName}</span></p>
                    <p className="text-text-secondary/80 font-body text-sm leading-relaxed mb-8 max-w-lg line-clamp-3">{book.synopsis}</p>
                    <div className="flex flex-wrap gap-5 mb-9 text-sm font-mono">
                      <span className="flex items-center gap-1.5 text-text-secondary">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                        {formatCount(book.views)}
                      </span>
                      <span className="text-[#D4AF37] font-bold">{book.ratingAvg.toFixed(1)} ★</span>
                      <span className="text-text-secondary">{book.chapterCount} chapters</span>
                      <span className="text-text-secondary">{book.freeChapterCount} free</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <Button href={`/book/${book._id}`} size="lg" variant="primary">Start reading free</Button>
                      <Button href={`/book/${book._id}`} size="lg" variant="secondary">View details</Button>
                    </div>
                  </div>

                  {/* Cover stack */}
                  <div className="hidden md:flex justify-center">
                    <div className="relative w-52 h-[320px]">
                      <div className="absolute inset-0 translate-x-5 translate-y-5 rounded-xl bg-text-primary/5 border border-border/40" />
                      <div className="absolute inset-0 translate-x-2.5 translate-y-2.5 rounded-xl bg-text-primary/8 border border-border/40" />
                      <div className="relative w-full h-full rounded-xl overflow-hidden border border-border/80 shadow-elevated">
                        <Image src={book.coverUrl} alt={book.title} fill className="object-cover" sizes="208px" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute -top-3 -right-3 flex items-center gap-1 bg-success px-2.5 py-1 rounded-pill z-10">
                          <span className="text-white text-[11px] font-semibold font-body">{book.freeChapterCount} free</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}

          {/* ── Slide 4: Author CTA ── */}
          <SwiperSlide key="author-cta">
            <div className="relative overflow-hidden min-h-[600px] md:min-h-[680px] flex items-center bg-gradient-to-br from-bg via-surface to-primary/5 transition-colors duration-300">
              {/* Decorative gold ink blobs */}
              <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-[#C9952A]/8 rounded-full blur-[120px] -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[100px] translate-x-1/4 translate-y-1/4 pointer-events-none" />
              {/* Subtle grid texture */}
              <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#C9952A 1px, transparent 1px), linear-gradient(90deg, #C9952A 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

              <div className="container-page py-20 md:py-28 relative z-10">
                <div className="max-w-3xl mx-auto text-center">
                  {/* Icon */}
                  <div className="flex justify-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#C9952A] to-[#D4AF37] flex items-center justify-center shadow-elevated">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8">
                        <path d="M12 20h9"/>
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    </div>
                  </div>

                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-pill bg-[#C9952A]/10 border border-[#C9952A]/20 text-[#D4AF37] text-xs font-semibold font-body mb-6 tracking-wide">
                    ✦ For Writers &amp; Storytellers
                  </div>

                  <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-text-primary mb-6">
                    Your story deserves
                    <span className="block" style={{ background: 'linear-gradient(135deg, #C9952A 0%, #E8B84B 50%, #D4AF37 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                      to be read.
                    </span>
                  </h1>

                  <p className="text-text-secondary font-body text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                    Publish your werewolf saga, dark romance, fantasy epic, or any story living rent-free in your head.
                    StoryForge gives you the tools — readers, chapters, coins &amp; royalties.
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
                    {['Free to publish', 'Keep 70% royalty', 'Chapter-by-chapter', 'Built-in audience', 'Analytics dashboard'].map((f) => (
                      <span key={f} className="px-3 py-1 rounded-pill border border-primary/20 bg-primary/5 text-primary text-xs font-semibold font-body">{f}</span>
                    ))}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button href="/register" size="lg" variant="primary">Start writing — it&apos;s free</Button>
                    <Button href="/author/dashboard" size="lg" variant="secondary">
                      Explore author tools
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </section>

      {/* ─── GENRE PILLS ───────────────────────────────────────────────── */}
      <section className="border-b py-2 border-border bg-surface">
        <div className="container-page py-4 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <Link href="/browse" className="px-4 py-2 rounded-pill text-sm font-semibold font-body bg-primary text-white shrink-0 hover:bg-primary-pop transition-colors">
              All stories
            </Link>
            {genres.map((g) => (
              <Link
                key={g._id}
                href={`/browse?genre=${g.slug}`}
                className="px-4 py-2 rounded-pill text-sm font-medium font-body border border-border text-text-secondary hover:border-primary/50 hover:text-primary bg-surface-alt shrink-0 transition-colors"
              >
                {g.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FEATURED ──────────────────────────────────────────────────── */}
      <section className="container-page section-y">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Featured picks</h2>
              <p className="text-text-secondary text-sm font-body mt-1">Handpicked by our editorial team</p>
            </div>
            <Link href="/browse" className="text-sm font-semibold font-body text-primary hover:text-primary-pop transition-colors">Browse all →</Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <motion.div variants={fadeUp} className="md:row-span-2">
              <Link href={`/book/${featuredBooks[0]._id}`} className="group relative rounded-card overflow-hidden flex flex-col justify-end min-h-[420px] border border-border block">
                <Image src={featuredBooks[0].coverUrl} alt={featuredBooks[0].title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="480px" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent z-10" />
                <div className="relative z-20 p-6">
                  <Badge variant="accent" className="mb-3">{featuredBooks[0].genreName}</Badge>
                  <h3 className="font-display text-xl font-semibold text-white mb-2 leading-snug">{featuredBooks[0].title}</h3>
                  <p className="text-white/60 text-sm font-body mb-4 line-clamp-2">{featuredBooks[0].synopsis}</p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-white/50 text-xs font-body">{featuredBooks[0].authorName}</span>
                    <span className="text-[#D4AF37] text-sm font-mono font-bold">{featuredBooks[0].ratingAvg.toFixed(1)} ★</span>
                  </div>
                  <div className="text-center py-2.5 rounded-pill bg-primary hover:bg-primary-pop text-white text-sm font-bold font-body transition-colors">
                    Start reading
                  </div>
                </div>
              </Link>
            </motion.div>
            {featuredBooks.slice(1, 4).map((book, i) => (
              <motion.div key={book._id} variants={fadeUp}>
                <BookCard book={book} size="featured" index={i + 1} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── TRENDING ──────────────────────────────────────────────────── */}
      <section className="bg-surface-alt py-16 border-y border-border">
        <div className="container-page">
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
              <div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Trending now</h2>
                <p className="text-text-secondary text-sm font-body mt-1">What readers can&apos;t put down this week</p>
              </div>
              <Link href="/browse?sort=trending" className="text-sm font-semibold font-body text-primary hover:text-primary-pop transition-colors">See more →</Link>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {trendingBooks.map((book, i) => (
                <motion.div key={book._id} variants={fadeUp}>
                  <BookCard book={book} size="compact" index={i} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── NEW RELEASES ──────────────────────────────────────────────── */}
      <section className="container-page section-y">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
            <div>
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">New releases</h2>
              <p className="text-text-secondary text-sm font-body mt-1">Fresh stories from this season</p>
            </div>
            <Link href="/browse?sort=newest" className="text-sm font-semibold font-body text-primary hover:text-primary-pop transition-colors">See all →</Link>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {newReleases.map((book, i) => (
              <motion.div key={book._id} variants={fadeUp}>
                <BookCard book={book} size="standard" index={i} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── TOP AUTHORS ───────────────────────────────────────────────── */}
      <section className="bg-surface-alt py-16 border-y border-border">
        <div className="container-page">
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.div variants={fadeUp} className="mb-10">
              <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Top authors</h2>
              <p className="text-text-secondary text-sm font-body mt-1">The storytellers building devoted followings</p>
            </motion.div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
              {authors.map((author, i) => (
                <motion.div key={author._id} variants={fadeUp}>
                  <Link href={`/author/${author._id}`} className="flex flex-col items-center gap-4 p-6 rounded-card bg-surface border border-border hover:border-primary/40 hover:shadow-card transition-all text-center group">
                    <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border group-hover:border-primary/40 transition-colors shrink-0">
                      <Image src={author.avatarUrl} alt={author.name} width={64} height={64} className="object-cover w-full h-full" />
                    </div>
                    <div>
                      <p className="font-body font-semibold text-sm text-text-primary group-hover:text-primary transition-colors leading-snug">{author.name}</p>
                      <p className="text-[11px] font-mono text-text-secondary mt-1 tabular-nums">{formatCount(author.followerCount)} followers</p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ──────────────────────────────────────────────── */}
      <section className="container-page section-y">
        <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
          <motion.div variants={fadeUp} className="text-center mb-14">
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-3">How StoryForge works</h2>
            <p className="text-text-secondary font-body max-w-xl mx-auto leading-relaxed">
              Read the first chapters free. Unlock more with coins. Your unlocked stories stay with you forever.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '📖', title: 'Browse & start free', desc: 'Every book has free opening chapters. No account needed to start reading.' },
              { icon: null, title: 'Unlock with coins', desc: 'Buy a coin pack once. Use coins to unlock chapters or the whole book at a bundle price.', isCoin: true },
              { icon: '🔒', title: 'Yours forever', desc: 'Unlocked chapters never expire or re-lock. Read at your own pace, return any time.' },
            ].map((step, i) => (
              <motion.div key={i} variants={fadeUp} className="flex flex-col items-center text-center p-10 rounded-card bg-surface border border-border hover:border-primary/30 hover:shadow-card transition-all">
                <div className="mb-5 w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {step.isCoin ? <CoinIcon size={36} /> : <span className="text-3xl">{step.icon}</span>}
                </div>
                <h3 className="font-display text-lg font-semibold text-text-primary mb-3">{step.title}</h3>
                <p className="text-text-secondary text-sm font-body leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ─── TESTIMONIALS ──────────────────────────────────────────────── */}
      <section className="bg-gradient-to-br from-primary/8 via-surface-alt to-accent/5 py-16 border-y border-border">
        <div className="container-page">
          <motion.div variants={stagger} initial="initial" whileInView="animate" viewport={{ once: true }}>
            <motion.h2 variants={fadeUp} className="font-display text-2xl md:text-3xl font-semibold text-text-primary text-center mb-12">
              What readers say
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t, i) => (
                <motion.blockquote key={i} variants={fadeUp} className="bg-surface rounded-card p-7 border border-border relative">
                  <div className="text-[#D4AF37] text-3xl font-display absolute -top-2 left-6 leading-none">&ldquo;</div>
                  <p className="font-body text-text-secondary text-sm leading-relaxed mt-4 italic">{t.text}</p>
                  <footer className="mt-5 text-xs font-semibold font-body text-text-primary">— {t.name}</footer>
                </motion.blockquote>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA NEWSLETTER ────────────────────────────────────────────── */}
      <section className="container-page section-y">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="rounded-card bg-gradient-to-br from-primary/15 via-surface to-accent/10 border border-primary/25 p-12 md:p-16 flex flex-col md:flex-row items-center gap-10"
        >
          <div className="flex-1 text-center md:text-left">
            <WaxSealIcon size={44} className="mb-5 mx-auto md:mx-0" />
            <h2 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-3">Never miss a new chapter</h2>
            <p className="font-body text-text-secondary max-w-md leading-relaxed">
              Weekly picks from our editors — the best new books, completed gems, and author spotlights.
            </p>
          </div>
          <form className="flex flex-col sm:flex-row gap-3 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email" placeholder="your@email.com" id="newsletter-email"
              className="px-4 py-3 rounded-input border border-border bg-surface text-text-primary font-body text-sm placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/30 w-full sm:w-64"
            />
            <Button type="submit" variant="primary" size="md">Subscribe</Button>
          </form>
        </motion.div>
      </section>

      {/* Swiper pagination dot styles */}
      <style>{`
        .hero-swiper { width: 100%; }
        .hero-swiper .swiper-pagination { bottom: 20px !important; }
        .hero-swiper .swiper-pagination-bullet { width: 8px; height: 8px; transition: all 0.3s; }
        .hero-swiper .swiper-pagination-bullet-active { width: 24px; border-radius: 4px; }
      `}</style>

    </div>
  );
}
