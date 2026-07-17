'use client';

import { CoinIcon } from '@/components/WaxSealIcon';
import { wallet, transactions, timeAgo } from '@/lib/mockData';

export default function WalletPage() {
  const purchases = transactions.filter((t) => t.type === 'coin_purchase');
  const unlocks = transactions.filter((t) => t.type === 'chapter_unlock');

  return (
    <div className='mt-4'>
      <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary mb-8">Wallet</h1>

      {/* Balance card */}
      <div className="mb-8 p-8 rounded-card bg-gradient-to-br from-primary/15 via-surface to-accent/10 border border-primary/20 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
        <div>
          <p className="text-sm font-body text-text-secondary mb-2">Current balance</p>
          <div className="flex items-center gap-3">
            <CoinIcon size={44} />
            <span className="font-mono text-5xl font-bold text-accent tabular-nums">{wallet.coinBalance}</span>
          </div>
          <p className="text-xs font-body text-text-secondary mt-2">Coins never expire</p>
        </div>
        <a
          href="/reader/coins"
          className="px-6 py-3 rounded-pill bg-primary text-white text-sm font-medium font-body hover:bg-primary-pop transition-colors"
        >
          + Buy more coins
        </a>
      </div>

      {/* History grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Purchases */}
        <div>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Coin purchases</h2>
          {purchases.length === 0 ? (
            <p className="text-text-secondary font-body text-sm">No purchases yet.</p>
          ) : (
            <div className="space-y-3">
              {purchases.map((t) => (
                <div key={t._id} className="flex items-center justify-between p-4 bg-surface rounded-card border border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                      <CoinIcon size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-body font-medium text-text-primary">{t.description}</p>
                      <p className="text-xs font-mono text-text-secondary tabular-nums">{timeAgo(t.createdAt)}</p>
                    </div>
                  </div>
                  <span className="font-mono text-sm font-bold text-success">₹{t.amountInr}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Unlocks */}
        <div>
          <h2 className="font-display text-lg font-semibold text-text-primary mb-4">Chapter unlocks</h2>
          {unlocks.length === 0 ? (
            <p className="text-text-secondary font-body text-sm">No unlocks yet.</p>
          ) : (
            <div className="space-y-3">
              {unlocks.map((t) => (
                <div key={t._id} className="flex items-center justify-between p-4 bg-surface rounded-card border border-border">
                  <div>
                    <p className="text-sm font-body font-medium text-text-primary line-clamp-1">{t.description}</p>
                    <p className="text-xs font-mono text-text-secondary tabular-nums">{timeAgo(t.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-3">
                    <CoinIcon size={14} />
                    <span className="font-mono text-sm font-bold text-accent tabular-nums">-{t.coinsSpent}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
