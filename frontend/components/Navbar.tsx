'use client';

import Link from 'next/link';
import { WaxSealIcon } from './WaxSealIcon';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/browse', label: 'Browse' },
  { href: '/browse?genre=werewolf', label: 'Werewolf' },
  { href: '/browse?genre=romance', label: 'Romance' },
  { href: '/browse?genre=fantasy', label: 'Fantasy' },
  { href: '/browse?genre=mafia', label: 'Dark Fiction' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur-md">
        <div className="container-page flex h-16 items-center gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0" id="nav-logo">
            <WaxSealIcon size={30} />
            <span className="font-display font-semibold text-xl text-text-primary tracking-tight">StoryForge</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5 flex-1" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 rounded-lg text-sm font-body text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />

            {/* Search icon */}
            <Link
              href="/browse"
              className="hidden sm:flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-alt text-text-secondary hover:text-text-primary transition-colors"
              aria-label="Search"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </Link>

            {/* Auth — desktop */}
            <Link
              href="/login"
              className="hidden sm:block px-3 py-1.5 text-sm font-medium font-body text-text-secondary hover:text-text-primary transition-colors"
              id="nav-login"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="hidden sm:inline-flex items-center px-4 py-2 rounded-pill text-sm font-bold bg-primary text-white hover:bg-primary-pop transition-all shadow-sm hover:shadow-md font-body ring-2 ring-primary/30"
              id="nav-register"
            >
              Get started ✨
            </Link>

            {/* Hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-alt text-text-secondary transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileOpen ? (
                  <motion.svg key="close" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <path d="M18 6L6 18M6 6l12 12" />
                  </motion.svg>
                ) : (
                  <motion.svg key="open" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                    <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu — slides in from the right */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface border-l border-border shadow-elevated flex flex-col md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                <div className="flex items-center gap-2">
                  <WaxSealIcon size={26} />
                  <span className="font-display font-semibold text-lg text-text-primary">StoryForge</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-alt text-text-secondary"
                  aria-label="Close menu"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div key={link.href} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                    <Link
                      href={link.href}
                      className="flex items-center px-4 py-3 rounded-xl text-sm font-medium font-body text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Bottom CTA */}
              <div className="px-4 py-5 border-t border-border space-y-3">
                <Link
                  href="/login"
                  className="block w-full text-center px-4 py-2.5 rounded-pill border border-border text-sm font-semibold font-body text-text-secondary hover:text-text-primary hover:border-primary/40 transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Sign in
                </Link>
                <Link
                  href="/register"
                  className="block w-full text-center px-4 py-2.5 rounded-pill bg-primary text-white text-sm font-bold font-body hover:bg-primary-pop transition-all ring-2 ring-primary/30 shadow-sm"
                  onClick={() => setMobileOpen(false)}
                >
                  Get started ✨
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
