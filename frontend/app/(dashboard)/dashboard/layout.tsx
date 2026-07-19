'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { WaxSealIcon, CoinIcon } from '@/components/WaxSealIcon';
import { useUserStore } from '@/store/userStore';
import { useEffect, useState } from 'react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useUserStore();
  // Only show spinner when we have no user AND haven't checked the cookie yet
  const [hydrating, setHydrating] = useState(true);

  useEffect(() => {
    // If store already has a user (e.g. after email login), skip the API call
    if (currentUser) {
      setHydrating(false);
      return;
    }
    // Try to restore session from the httpOnly access token cookie
    fetch('/api/auth/me')
      .then((r) => r.json())
      .then(({ user }) => {
        if (user) {
          setCurrentUser(user);
        } else {
          router.replace('/login?from=/dashboard');
        }
      })
      .catch(() => router.replace('/login?from=/dashboard'))
      .finally(() => setHydrating(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (hydrating) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-3 text-text-secondary">
            <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-sm font-body">Loading your session…</p>
          </div>
        </div>
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <Navbar />
        <div className="w-screen h-sreen flex flex-col items-center justify-center py-20 text-center">
          <h2 className="font-display text-2xl font-bold text-text-primary mb-4">Please log in to access your dashboard</h2>
          <Link href="/login" className="px-6 py-2.5 rounded-pill bg-primary text-white font-medium hover:bg-primary-pop transition-colors">
            Go to Login
          </Link>
        </div>
      </>
    );
  }

  const hasProfile = !!currentUser.authorProfile;

  // Base navigation items for all users (Reader role features)
  const readerNavItems = [
    { href: '/dashboard', label: 'Overview', icon: '📊' },
    { href: '/dashboard/library', label: 'My Library', icon: '📚' },
    { href: '/dashboard/wallet', label: 'Wallet', icon: null }, // Handled specially below or with coin icon
    { href: '/dashboard/coins', label: 'Buy Coins', icon: '🪙' },
    { href: '/dashboard/history', label: 'History', icon: '🕐' },
    { href: '/dashboard/bookmarks', label: 'Bookmarks', icon: '🔖' },
    { href: '/dashboard/transactions', label: 'Transactions', icon: '📋' },
    { href: '/dashboard/settings', label: 'Settings', icon: '⚙️' },
  ];

  // Author-specific navigation items
  const authorNavItems = [
    { href: '/dashboard/books', label: 'My Books', icon: '📚' },
    { href: '/dashboard/books/create', label: 'Create Book', icon: '✍️' },
    { href: '/dashboard/earnings', label: 'Earnings', icon: '💰' },
    { href: '/dashboard/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <>
      <Navbar />
      
      {/* Top dashboard header bar */}
      <div className="border-b border-border bg-surface px-4 py-3">
        <div className="container-page flex items-center justify-between text-xs font-body text-text-secondary">
          <div className="flex items-center gap-2">
            <WaxSealIcon size={16} />
            <span className="text-text-primary font-medium">Member Workspace</span>
            <span className="text-text-secondary">· {currentUser.name}</span>
          </div>
          {hasProfile && (
            <span className="px-2 py-0.5 rounded bg-support/10 text-support text-[10px] font-bold">
              Author: {currentUser.authorProfile?.penName}
            </span>
          )}
        </div>
      </div>

      <div  className="custom-container-page py-2  flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <aside className="shrink-0 w-full md:w-56 space-y-6">
          {/* User Profile Block & Coin balance */}
          <div className="p-4 rounded-card bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border border-border overflow-hidden bg-surface-alt flex items-center justify-center font-display font-bold text-primary">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                ) : (
                  currentUser.name.charAt(0)
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-body font-semibold text-text-primary truncate">{currentUser.name}</p>
                <p className="text-[10px] font-body text-text-secondary uppercase tracking-wider">{currentUser.role}</p>
              </div>
            </div>
            
            <hr className="border-border/60 my-3" />

            <p className="text-xs font-body text-text-secondary mb-1">Coin balance</p>
            <div className="flex items-center gap-2">
              <CoinIcon size={20} />
              <span className="font-mono font-bold text-2xl text-accent tabular-nums">{currentUser.coinBalance}</span>
            </div>
            <Link href="/dashboard/coins" className="text-xs font-body text-primary hover:text-primary-pop mt-1 inline-block transition-colors font-medium">
              Buy more →
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-6">
            <div>
              <p className="text-[10px] font-bold font-body text-text-secondary uppercase tracking-wider px-4 mb-2">Reader Panel</p>
              <div className="space-y-1">
                {readerNavItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition-colors
                        ${active ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}
                    >
                      {item.href === '/dashboard/wallet' ? <CoinIcon size={14} /> : <span>{item.icon}</span>}
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <hr className="border-border/60" />

            {/* Author Section */}
            <div>
              <p className="text-[10px] font-bold font-body text-text-secondary uppercase tracking-wider px-4 mb-2">Author Panel</p>
              {hasProfile ? (
                <div className="space-y-1">
                  {authorNavItems.map((item) => {
                    const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition-colors
                          ${active ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}
                      >
                        <span>{item.icon}</span>
                        {item.label}
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="px-4 py-3 rounded-lg bg-surface-alt border border-border text-center">
                  <p className="text-xs text-text-secondary font-body mb-3">Want to publish your own stories?</p>
                  <Link
                    href="/dashboard/become-author"
                    className={`inline-block w-full px-3 py-2 rounded-pill bg-primary text-white text-xs font-bold font-body hover:bg-primary-pop transition-colors
                      ${pathname === '/dashboard/become-author' ? 'ring-2 ring-primary/40' : ''}`}
                  >
                    Become an Author ✨
                  </Link>
                </div>
              )}
            </div>
          </nav>
        </aside>

        {/* Main Content Pane */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
