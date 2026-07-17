import Link from 'next/link';
import { WaxSealIcon } from './WaxSealIcon';

const genreLinks = ['Werewolf', 'Romance', 'Fantasy', 'Mafia', 'Billionaire', 'Thriller', 'Historical', 'Dark Romance'];
const companyLinks = [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Blog', href: '#' }, { label: 'Press', href: '#' }];
const resourceLinks = [{ label: 'Help Centre', href: '#' }, { label: 'Community Guidelines', href: '#' }, { label: 'Privacy Policy', href: '#' }, { label: 'Terms of Service', href: '#' }];
const communityLinks = [{ label: 'Discord', href: '#' }, { label: 'Twitter / X', href: '#' }, { label: 'Instagram', href: '#' }, { label: 'Author Forum', href: '#' }];

export function Footer() {
  return (
    <footer className="border-t border-border py-6 bg-surface-alt mt-auto">
      <div className="container-page py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <WaxSealIcon size={28} />
              <span className="font-display font-semibold text-lg text-text-primary">StoryForge</span>
            </Link>
            <p className="text-sm text-text-secondary leading-relaxed font-body">
              Stories worth staying up for.
            </p>
            <p className="text-xs text-text-secondary mt-4 font-body">
              Web-only · No app · No spam
            </p>
          </div>

          {/* Genres */}
          <div>
            <h3 className="text-xs font-semibold font-body uppercase tracking-widest text-text-secondary mb-4">Genres</h3>
            <ul className="space-y-2.5">
              {genreLinks.map((g) => (
                <li key={g}>
                  <Link href={`/browse?genre=${g.toLowerCase()}`} className="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">
                    {g}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold font-body uppercase tracking-widest text-text-secondary mb-4">Company</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold font-body uppercase tracking-widest text-text-secondary mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {resourceLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-xs font-semibold font-body uppercase tracking-widest text-text-secondary mb-4">Community</h3>
            <ul className="space-y-2.5">
              {communityLinks.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm font-body text-text-secondary hover:text-text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs font-body text-text-secondary">
            © 2026 StoryForge. All rights reserved.
          </p>
          <p className="text-xs font-body text-text-secondary">
            A web-first digital fiction platform. No app downloads required.
          </p>
        </div>
      </div>
    </footer>
  );
}
