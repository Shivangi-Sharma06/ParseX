import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-line bg-[#070C1A]">
      <div className="section-wrap grid gap-8 py-10 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold gradient-text">ResumeIQ</h3>
          <p className="mt-2 text-sm text-muted">Hire smarter with AI</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Links</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/">Features</Link></li>
            <li><Link to="/">Pricing</Link></li>
            <li><Link to="/">Docs</Link></li>
            <li><Link to="/">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-white">Legal</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li><Link to="/">Privacy Policy</Link></li>
            <li><Link to="/">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line py-4">
        <div className="section-wrap flex flex-col items-center justify-between gap-2 text-xs text-muted md:flex-row">
          <p>© 2025 ResumeIQ. All rights reserved.</p>
          <p>Built with React + Node.js</p>
        </div>
      </div>
    </footer>
  );
}
