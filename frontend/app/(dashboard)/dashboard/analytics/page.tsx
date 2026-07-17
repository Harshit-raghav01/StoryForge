'use client';

import { authorBooks, formatCount } from '@/lib/mockData';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
          Writing Analytics
        </h1>
        <p className="text-text-secondary font-body text-sm mt-1">
          Monitor your story engagement, chapter drop-offs, and unlock trends.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: 'Platform-wide Reads', value: formatCount(1234900), sub: 'all works', icon: '📈' },
          { label: 'Avg. Completion Rate', value: '74%', sub: 'readers reaching ch. 10+', icon: '🎯' },
          { label: 'Weekly Active Fans', value: '4,280', sub: 'active bookmarkers', icon: '👥' },
        ].map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-5 bg-surface rounded-card border border-border shadow-soft"
          >
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <p className="font-mono text-2xl font-bold text-text-primary tabular-nums">{kpi.value}</p>
            <p className="text-xs font-body text-text-secondary mt-1">{kpi.label}</p>
            <p className="text-[10px] font-body text-text-secondary mt-0.5">({kpi.sub})</p>
          </motion.div>
        ))}
      </div>

      {/* Detailed book performance table */}
      <div className="bg-surface rounded-card border border-border overflow-hidden shadow-soft">
        <div className="px-5 py-4 border-b border-border bg-surface-alt">
          <h2 className="font-display text-base font-semibold text-text-primary">Book-by-Book Breakdown</h2>
        </div>
        <table className="w-full text-sm font-body text-left">
          <thead>
            <tr className="border-b border-border bg-surface-alt/50 text-text-secondary text-xs uppercase tracking-wider font-semibold">
              <th className="px-5 py-3">Book Title</th>
              <th className="px-5 py-3 text-right">Chapters</th>
              <th className="px-5 py-3 text-right">Views</th>
              <th className="px-5 py-3 text-right">avg. rating</th>
              <th className="px-5 py-3 text-right">monthly unlocks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {authorBooks.map((book) => (
              <tr key={book._id} className="hover:bg-surface-alt transition-colors text-text-primary text-sm">
                <td className="px-5 py-4 font-semibold">{book.title}</td>
                <td className="px-5 py-4 text-right font-mono tabular-nums text-text-secondary">{book.chapterCount}</td>
                <td className="px-5 py-4 text-right font-mono tabular-nums text-text-secondary">{formatCount(book.views)}</td>
                <td className="px-5 py-4 text-right font-mono tabular-nums text-accent font-bold">{book.ratingAvg.toFixed(1)} ★</td>
                <td className="px-5 py-4 text-right font-mono tabular-nums text-success font-bold">{(book.views / 200).toFixed(0)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
