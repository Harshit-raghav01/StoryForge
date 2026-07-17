'use client';

import { useState } from 'react';
import { transactions, timeAgo } from '@/lib/mockData';
import { CoinIcon } from '@/components/WaxSealIcon';

export default function TransactionsPage() {
  const [filter, setFilter] = useState<'all' | 'purchase' | 'unlock'>('all');

  const filtered = transactions.filter((t) => {
    if (filter === 'purchase') return t.type === 'coin_purchase';
    if (filter === 'unlock') return t.type === 'chapter_unlock';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">
            Transactions Ledger
          </h1>
          <p className="text-text-secondary font-body text-sm mt-1">
            Review your purchase history and unlocked chapters.
          </p>
        </div>

        {/* Filters */}
        <div className="flex bg-surface-alt border border-border rounded-pill p-0.5 shadow-sm self-start sm:self-auto">
          {['all', 'purchase', 'unlock'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type as any)}
              className={`px-3 py-1 rounded-pill text-xs font-medium font-body capitalize transition-all
                ${filter === type 
                  ? 'bg-primary text-white shadow-sm' 
                  : 'text-text-secondary hover:text-text-primary'}`}
            >
              {type === 'all' ? 'All' : type === 'purchase' ? 'Purchases' : 'Unlocks'}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger list */}
      <div className="bg-surface rounded-card border border-border overflow-hidden shadow-soft">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-text-secondary font-body text-sm">
            No transaction records found matching the filter.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filtered.map((t) => {
              const isPurchase = t.type === 'coin_purchase';
              return (
                <div key={t._id} className="flex items-center justify-between p-4 hover:bg-surface-alt transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0
                      ${isPurchase ? 'bg-success/15 text-success' : 'bg-accent/15 text-accent'}`}
                    >
                      {isPurchase ? '🪙' : '📖'}
                    </div>
                    <div>
                      <p className="text-sm font-body font-medium text-text-primary">
                        {t.description}
                      </p>
                      <p className="text-xs font-mono text-text-secondary mt-0.5">
                        {timeAgo(t.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {isPurchase ? (
                      <span className="font-mono text-sm font-bold text-success tabular-nums">
                        +₹{t.amountInr}
                      </span>
                    ) : (
                      <div className="flex items-center gap-1 text-accent font-mono font-bold text-sm tabular-nums">
                        <CoinIcon size={12} />
                        <span>-{t.coinsSpent}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
