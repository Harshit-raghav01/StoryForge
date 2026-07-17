'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { coinPacks, wallet, formatINR } from '@/lib/mockData';
import { CoinIcon } from '@/components/WaxSealIcon';
import { Button } from '@/components/Button';
import { Modal } from '@/components/Modal';

export default function CoinsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const selectedPack = coinPacks.find((p) => p._id === selected);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-2xl md:text-3xl font-semibold text-text-primary">Buy coins</h1>
        <p className="text-text-secondary font-body text-sm mt-1">
          Current balance: <span className="font-mono font-bold text-accent">{wallet.coinBalance}</span> coins
        </p>
      </div>

      {/* Packs grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {coinPacks.map((pack, i) => {
          const isPopular = pack.name === 'Popular';
          const isSelected = selected === pack._id;
          return (
            <motion.button
              key={pack._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => setSelected(pack._id)}
              className={`relative flex flex-col items-center text-center p-6 rounded-card border-2 transition-all duration-200 cursor-pointer
                ${isSelected ? 'border-primary shadow-card bg-primary/5' : 'border-border bg-surface hover:border-primary/40 hover:shadow-soft'}`}
              id={`pack-${pack._id}`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-pill bg-accent text-white text-[10px] font-bold font-body whitespace-nowrap">
                  Most popular
                </span>
              )}
              {pack.bonusPercent > 0 && (
                <span className="absolute top-3 right-3 px-2 py-0.5 rounded-pill bg-success/20 text-success text-[10px] font-bold font-body">
                  +{pack.bonusPercent}% bonus
                </span>
              )}

              <div className="flex items-center gap-2 mb-3">
                <CoinIcon size={28} />
                <span className="font-mono text-3xl font-bold text-accent tabular-nums">{pack.coinsGranted}</span>
              </div>

              <p className="font-display font-semibold text-text-primary text-base mb-1">{pack.name} Pack</p>

              {pack.bonusPercent > 0 && (
                <p className="text-xs font-body text-success mb-3">
                  +{Math.round(pack.coinsGranted * pack.bonusPercent / 100)} bonus coins included
                </p>
              )}

              <div className="mt-auto pt-3 border-t border-border w-full">
                <p className="font-mono font-bold text-xl text-text-primary tabular-nums">{formatINR(pack.priceInr)}</p>
                <p className="text-[10px] font-body text-text-secondary mt-0.5">
                  ≈ {(pack.priceInr / pack.coinsGranted).toFixed(2)} ₹/coin
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button
          variant="primary"
          size="lg"
          disabled={!selected}
          onClick={() => selected && setConfirmOpen(true)}
        >
          {selected ? `Buy ${selectedPack?.name} Pack` : 'Select a pack'}
        </Button>
        {selected && (
          <p className="text-sm font-body text-text-secondary">
            You&#39;ll be charged {formatINR(selectedPack!.priceInr)} via Razorpay
          </p>
        )}
      </div>

      {/* Confirm modal */}
      <Modal isOpen={confirmOpen} onClose={() => setConfirmOpen(false)} title="Confirm purchase">
        {selectedPack && (
          <div className="space-y-5">
            <div className="bg-surface-alt rounded-card p-5 border border-border text-center">
              <CoinIcon size={40} />
              <p className="font-mono text-4xl font-bold text-accent mt-3 tabular-nums">{selectedPack.coinsGranted}</p>
              <p className="text-text-secondary font-body text-sm mt-1">{selectedPack.name} Pack</p>
              {selectedPack.bonusPercent > 0 && <p className="text-success text-xs font-body mt-1">+{selectedPack.bonusPercent}% bonus coins</p>}
            </div>
            <div className="flex items-center justify-between text-sm font-body">
              <span className="text-text-secondary">Total charge</span>
              <span className="font-mono font-bold text-text-primary">{formatINR(selectedPack.priceInr)}</span>
            </div>
            <p className="text-xs font-body text-text-secondary">
              In the live app, this will open Razorpay checkout. This is a demo — no real payment is processed.
            </p>
            <Button fullWidth size="lg" variant="accent" onClick={() => { setConfirmOpen(false); }}>
              Proceed to payment (Demo)
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}
