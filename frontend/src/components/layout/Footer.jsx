import { Link } from 'react-router-dom';
import { ArrowUpRight, Shield } from 'lucide-react';

const productLinks = [
  { label: 'Features', href: '/#features' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'Analytics', href: '/analytics' },
  { label: 'Dashboard', href: '/dashboard' },
];

const legalLinks = [
  { label: 'Privacy Policy', href: '/' },
  { label: 'Terms of Service', href: '/' },
  { label: 'Compliance', href: '/' },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black pb-6 pt-14">
      <div className="section-wrap grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-2">
            <Shield className="h-4 w-4 text-[#cfb38a]" />
            <span className="text-sm font-semibold text-white">ResumeIQ</span>
          </div>
          <h3 className="mt-5 max-w-md text-2xl font-semibold leading-tight text-white sm:text-3xl">
            Hire smarter with AI and ship faster recruiting decisions.
          </h3>
          <p className="mt-3 max-w-md text-sm text-muted">
            Keep your existing flow, elevate your experience, and move from manual filtering to confident shortlists.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Product</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {productLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="inline-flex items-center gap-1 transition hover:text-white">
                  {link.label}
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/85">Legal</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {legalLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.href} className="transition hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="section-wrap mt-10 border-t border-white/10 pt-5">
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted md:flex-row">
          <p>© 2026 ResumeIQ. All rights reserved.</p>
          <p>Built with React + Node.js</p>
        </div>
      </div>
    </footer>
  );
}
