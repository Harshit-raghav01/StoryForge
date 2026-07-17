'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { WaxSealIcon } from '@/components/WaxSealIcon';

const navItems = [
  { href: '/admin/dashboard', label: 'Overview', icon: '📊' },
  { href: '/admin/users', label: 'Users', icon: '👤' },
  { href: '/admin/authors', label: 'Authors', icon: '✍️' },
  { href: '/admin/books', label: 'Books', icon: '📚' },
  { href: '/admin/categories', label: 'Categories', icon: '🏷️' },
  { href: '/admin/coinpacks', label: 'Coin Packs', icon: '🪙' },
  { href: '/admin/transactions', label: 'Transactions', icon: '📋' },
  { href: '/admin/reports', label: 'Reports', icon: '📈' },
  { href: '/admin/offers', label: 'Offers', icon: '🎁' },
  { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="shrink-0 w-full md:w-56 border-b md:border-b-0 md:border-r border-border bg-surface">
          <div className="p-4 border-b border-border flex items-center gap-2">
            <WaxSealIcon size={22} />
            <div>
              <p className="text-xs font-body font-semibold text-text-primary">Admin Panel</p>
              <p className="text-[10px] font-body text-text-secondary">Super Admin</p>
            </div>
          </div>
          <nav className="p-2 space-y-0.5">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors
                    ${active ? 'bg-primary/10 text-primary font-medium' : 'text-text-secondary hover:text-text-primary hover:bg-surface-alt'}`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="flex-1 p-6 md:p-8 min-w-0">{children}</main>
      </div>
    </>
  );
}
