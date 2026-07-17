'use client';

import Link from 'next/link';
import { motion, type Variants } from 'framer-motion';
import { adminStats, formatCount, formatINR } from '@/lib/mockData';
import { CoinIcon, WaxSealIcon } from '@/components/WaxSealIcon';

const fadeUp: Variants = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

const kpis = [
  { label: 'Active readers', value: formatCount(adminStats.activeReaders), sub: 'total registered', icon: '👥', color: 'text-primary' },
  { label: 'Active authors', value: formatCount(adminStats.activeAuthors), sub: 'approved & publishing', icon: '✍️', color: 'text-support' },
  { label: 'Books published', value: formatCount(adminStats.booksPublished), sub: `+${adminStats.booksThisMonth} this month`, icon: '📚', color: 'text-accent' },
  { label: 'Gross revenue', value: formatINR(adminStats.revenueThisMonth), sub: 'this month', icon: null, color: 'text-success' },
];

const stubPages = [
  { href: '/admin/users', label: 'Users', desc: 'Manage reader accounts, search, suspend', icon: '👤' },
  { href: '/admin/authors', label: 'Authors', desc: 'Review applications, view profiles', icon: '✍️' },
  { href: '/admin/books', label: 'Books', desc: 'Moderate, feature, remove content', icon: '📚' },
  { href: '/admin/coinpacks', label: 'Coin Packs', desc: 'Create and edit coin packs', icon: '🪙' },
  { href: '/admin/transactions', label: 'Transactions', desc: 'All purchases and unlocks', icon: '📋' },
  { href: '/admin/offers', label: 'Offers', desc: 'Promotions and bonus-coin campaigns', icon: '🎁' },
  { href: '/admin/reports', label: 'Reports', desc: 'Platform-wide sales & engagement', icon: '📈' },
  { href: '/admin/settings', label: 'Settings', desc: 'Global config, default pricing, banners', icon: '⚙️' },
];

export default function AdminDashboardPage() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex items-center gap-4">
        <WaxSealIcon size={40} />
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Admin overview</h1>
          <p className="text-text-secondary font-body text-sm mt-0.5">Platform health at a glance</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: i * 0.07 }}
            className="bg-surface rounded-card border border-border p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{kpi.icon ?? ''}</span>
              {!kpi.icon && <CoinIcon size={24} />}
              <span className="text-[10px] font-body text-text-secondary">{kpi.sub}</span>
            </div>
            <p className={`font-mono text-2xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs font-body text-text-secondary mt-1">{kpi.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Top books table */}
      <div className="mb-10">
        <h2 className="font-display text-xl font-semibold text-text-primary mb-5">Top performing books</h2>
        <div className="bg-surface rounded-card border border-border overflow-hidden">
          <table className="w-full text-sm font-body">
            <thead>
              <tr className="border-b border-border bg-surface-alt">
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">#</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Book</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Author</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Views</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-text-secondary uppercase tracking-wide">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {adminStats.topBooks.map((book, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-surface-alt transition-colors">
                  <td className="px-5 py-3.5 font-mono text-text-secondary tabular-nums">{i + 1}</td>
                  <td className="px-5 py-3.5 font-medium text-text-primary">{book.title}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{book.author}</td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums text-text-secondary">{formatCount(book.views)}</td>
                  <td className="px-5 py-3.5 text-right font-mono tabular-nums font-bold text-success">{formatINR(book.revenue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Nav to other sections (stubbed) */}
      <div>
        <h2 className="font-display text-xl font-semibold text-text-primary mb-5">Manage platform</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stubPages.map((page, i) => (
            <motion.div key={page.href} variants={fadeUp} initial="initial" animate="animate" transition={{ delay: 0.1 + i * 0.05 }}>
              <Link
                href={page.href}
                className="flex flex-col gap-2 p-5 bg-surface rounded-card border border-border hover:border-primary/30 hover:shadow-card transition-all group"
              >
                <span className="text-2xl">{page.icon}</span>
                <p className="font-body font-semibold text-text-primary text-sm group-hover:text-primary transition-colors">{page.label}</p>
                <p className="text-xs font-body text-text-secondary leading-relaxed">{page.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
