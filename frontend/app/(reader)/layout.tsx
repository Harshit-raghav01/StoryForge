'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { WaxSealIcon, CoinIcon } from '@/components/WaxSealIcon';
import { wallet } from '@/lib/mockData';

const navItems = [
  { href: '/reader/dashboard', label: 'Library', icon: '📚' },
  { href: '/reader/wallet', label: 'Wallet', icon: null },
  { href: '/reader/coins', label: 'Buy coins', icon: null },
  { href: '/reader/history', label: 'History', icon: '🕐' },
  { href: '/reader/bookmarks', label: 'Bookmarks', icon: '🔖' },
];

export default function ReaderLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <Navbar />
      <div className="container-page py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="shrink-0 w-full md:w-56">
          {/* Wallet balance */}
          <div className="mb-5 p-4 rounded-card bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
            <p className="text-xs font-body text-text-secondary mb-1">Coin balance</p>
            <div className="flex items-center gap-2">
              <CoinIcon size={20} />
              <span className="font-mono font-bold text-2xl text-accent tabular-nums">{wallet.coinBalance}</span>
            </div>
            <Link href="/reader/coins" className="text-xs font-body text-primary hover:text-primary-pop mt-1 inline-block transition-colors">
              Buy more →
            </Link>
          </div>

          {/* Nav */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-body transition-colors
                    ${active ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}
                >
                  {item.href === '/reader/wallet' ? <CoinIcon size={14} /> : <span>{item.icon}</span>}
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
