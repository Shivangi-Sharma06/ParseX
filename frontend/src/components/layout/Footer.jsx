import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield } from 'lucide-react';

const productLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Upload Resumes', href: '/upload' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/login' },
  { label: 'Terms of Service', href: '/register' },
  { label: 'Security', href: '/#features' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-base pb-6 pt-14">
      <div className="section-wrap grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white/[0.03] px-3 py-2">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold text-ink">ParseX</span>
          </div>
          <h3 className="mt-5 max-w-md text-2xl font-semibold leading-tight text-ink sm:text-3xl">
            Hire smarter, not harder.
          </h3>
          <p className="mt-3 max-w-md text-sm text-muted">
            Parse resumes, define role requirements, and shortlist top candidates with ranked match scores in minutes.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/85">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {productLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="inline-flex items-center gap-1 transition hover:text-ink">
                  {link.label}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-ink/85">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="transition hover:text-ink">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-wrap mt-10 border-t border-line pt-5">
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted md:flex-row">
          <p>© 2026 ParseX. All rights reserved.</p>
          <p>Built for modern recruiting teams.</p>
        </div>
      </div>
    </footer>
  );
}
