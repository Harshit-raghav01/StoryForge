'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { WaxSealIcon } from '@/components/WaxSealIcon';

const navItems = [
  { href: '/author/dashboard', label: 'Overview', icon: '📊' },
  { href: '/author/books', label: 'My Books', icon: '📚' },
  { href: '/author/books/create', label: 'Create Book', icon: '✍️' },
  { href: '/author/books/b1/editor', label: 'Chapter Editor', icon: '📝' },
  { href: '/author/earnings', label: 'Earnings', icon: '💰' },
];

export default function AuthorLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Navbar />
      <div className="border-b border-border bg-surface px-4 py-3">
        <div className="container-page flex items-center gap-2 text-xs font-body text-text-secondary">
          <WaxSealIcon size={16} />
          <span className="text-text-primary font-medium">Author Dashboard</span>
          <span className="text-text-secondary">· Raven Blackwell</span>
        </div>
      </div>
      <div className="container-page py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="shrink-0 w-full md:w-52">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== '/author/dashboard' && pathname.startsWith(item.href));
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
          </nav>
        </aside>
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </>
  );
}
