'use client';

import Link from 'next/link';

const demoAccounts = [
  {
    role: 'Reader',
    desc: 'Browse, unlock chapters, manage library',
    href: '/reader/dashboard',
    icon: '📖',
    id: 'demo-reader',
  },
  {
    role: 'Author',
    desc: 'Create books, write chapters, view earnings',
    href: '/author/dashboard',
    icon: '✍️',
    id: 'demo-author',
  },
  {
    role: 'Admin',
    desc: 'Platform overview, users, content moderation',
    href: '/admin/dashboard',
    icon: '🛡️',
    id: 'demo-admin',
  },
];

export function DemoLoginPanel() {
  return (
    <div className="mt-6">
      {/* Gold divider label */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 h-px bg-border" />
        <span className="flex items-center gap-1.5 px-3 py-1 rounded-pill border border-[#C9952A]/40 bg-[#C9952A]/8 text-[10px] font-bold font-body text-[#C9952A] uppercase tracking-widest shrink-0">
          ✦ Demo Login
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      <p className="text-center text-xs font-body text-text-secondary mb-4 leading-relaxed">
        Skip sign-in — jump straight into a prototype role
      </p>

      <div className="flex flex-col gap-2.5">
        {demoAccounts.map((account) => (
          <Link
            key={account.id}
            href={account.href}
            id={account.id}
            className="group flex items-center gap-4 px-4 py-3 rounded-xl border border-[#C9952A]/30 bg-gradient-to-r from-[#C9952A]/6 to-transparent hover:border-[#C9952A]/60 hover:from-[#C9952A]/12 hover:shadow-md transition-all duration-200"
          >
            <span className="text-xl shrink-0">{account.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold font-body text-text-primary group-hover:text-[#C9952A] transition-colors">
                {account.role}
              </p>
              <p className="text-[11px] font-body text-text-secondary truncate">{account.desc}</p>
            </div>
            <svg
              className="w-4 h-4 text-[#C9952A]/50 group-hover:text-[#C9952A] group-hover:translate-x-0.5 transition-all shrink-0"
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  );
}
