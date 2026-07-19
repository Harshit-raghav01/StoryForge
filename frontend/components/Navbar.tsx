'use client';

import Link from 'next/link';
import { WaxSealIcon } from './WaxSealIcon';
import { ThemeToggle } from './ThemeToggle';
import { SearchBar } from './SearchBar';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useUserStore } from '@/store/userStore';

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
  const { currentUser, logout, setCurrentUser } = useUserStore();

  // Hydrate session from cookie on first render (handles page reload & OAuth redirect)
  useEffect(() => {
    if (currentUser) return;
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then(({ user }) => { if (user) setCurrentUser(user); })
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

            {/* PC Search Bar */}
            <div className="hidden sm:block w-40 md:w-52 lg:w-64">
              <SearchBar size="sm" />
            </div>

            {/* Auth — desktop */}
            {currentUser ? (
              <div className="hidden sm:flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-pill text-sm font-bold bg-primary text-white hover:bg-primary-pop transition-all shadow-sm font-body ring-2 ring-primary/30"
                  id="nav-dashboard"
                >
                  Dashboard 📊
                </Link>
                <button
                  onClick={async () => {
                    await fetch('/api/auth/logout', { method: 'POST' });
                    logout();
                    window.location.href = '/';
                  }}
                  className="px-3 py-1.5 text-sm font-medium font-body text-text-secondary hover:text-text-primary transition-colors"
                  id="nav-logout"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <>
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
              </>
            )}

            {/* Mobile User Profile Icon */}
            <Link
              href={currentUser ? '/dashboard' : '/login'}
              className="sm:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-alt transition-colors"
              aria-label="User Profile"
            >
              {currentUser ? (
                currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="Profile"
                    className="w-9 h-9 rounded-full object-cover border border-border"
                  />
                ) : (
                  <span className="w-9 h-9 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-sm font-bold font-display">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </span>
                )
              ) : (
                <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              )}
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

              {/* Bottom auth section */}
              <div className="border-t border-border px-4 py-4 shrink-0">
                {currentUser ? (
                  <div className="space-y-3">
                    {/* User info row */}
                    <div className="flex items-center gap-3 px-1">
                      {currentUser.avatar ? (
                        <img src={currentUser.avatar} alt="Profile" className="w-9 h-9 rounded-full object-cover border border-border shrink-0" />
                      ) : (
                        <span className="w-9 h-9 rounded-full bg-primary/20 text-primary border border-primary/30 flex items-center justify-center text-sm font-bold font-display shrink-0">
                          {currentUser.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-sm font-semibold font-body text-text-primary truncate">{currentUser.name}</p>
                        <p className="text-[11px] font-body text-text-secondary truncate">{currentUser.email}</p>
                      </div>
                    </div>
                    {/* Dashboard link */}
                    <Link
                      href="/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-bold font-body hover:bg-primary/20 transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>
                      Dashboard
                    </Link>
                    {/* Sign out */}
                    <button
                      onClick={async () => {
                        setMobileOpen(false);
                        await fetch('/api/auth/logout', { method: 'POST' });
                        logout();
                        window.location.href = '/';
                      }}
                      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-border text-text-secondary text-sm font-medium font-body hover:bg-surface-alt hover:text-text-primary transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      Sign out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center py-2.5 rounded-xl border border-border text-sm font-medium font-body text-text-secondary hover:text-text-primary hover:bg-surface-alt transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-center py-2.5 rounded-xl bg-primary text-white text-sm font-bold font-body hover:bg-primary-pop transition-colors"
                    >
                      Get started ✨
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
