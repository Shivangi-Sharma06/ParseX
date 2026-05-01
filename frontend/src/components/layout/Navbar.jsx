import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Bell, Menu, Shield, UserCircle2, X } from 'lucide-react';
import { NAV_LINKS } from '../../utils/constants';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../ui/Toast';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const PUBLIC_SECTIONS = [
  { label: 'Home', id: 'home' },
  { label: 'How It Works', id: 'how-it-works' },
  { label: 'Features', id: 'features' },
  { label: 'Testimonials', id: 'testimonials' },
  { label: 'Contact', id: 'cta' },
];

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { push } = useToast();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isPublicLanding = !isAuthenticated && location.pathname === '/';

  const onLogout = () => {
    logout();
    push("You've been logged out.", 'info');
    navigate('/login');
  };

  const scrollToSection = (id) => {
    const target = document.getElementById(id);
    if (!target) {
      navigate(`/#${id}`);
      return;
    }
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-line bg-base/70 backdrop-blur-xl">
      <div className="section-wrap flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-[#cfb38a]" />
          <span className="text-lg font-bold text-ink">ResumeIQ</span>
        </Link>

        {isAuthenticated ? (
          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  cn(
                    'border-b-2 border-transparent pb-1 text-sm text-muted transition-colors hover:text-ink',
                    isActive && 'border-primary text-ink',
                  )
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        ) : null}

        {isPublicLanding ? (
          <nav className="hidden items-center gap-6 md:flex">
            {PUBLIC_SECTIONS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </button>
            ))}
          </nav>
        ) : null}

        <div className="hidden items-center gap-2 md:flex">
          {!isAuthenticated ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="border-lineStrong bg-white/[0.03] hover:bg-white/[0.08]">
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="gradient" className="border-0 hover:shadow-none">
                  Get Started
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" aria-label="notifications">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="relative">
                <Button variant="ghost" size="sm" onClick={() => setMenuOpen((prev) => !prev)}>
                  <UserCircle2 className="h-4 w-4" />
                  <span>{user?.username || 'Account'}</span>
                </Button>
                {menuOpen ? (
                  <div className="absolute right-0 mt-2 w-40 rounded-xl border border-line bg-surface p-2 shadow-clay-sm">
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-white/5"
                    >
                      Profile
                    </Link>
                    <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-danger hover:bg-danger/10" onClick={onLogout}>
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMobileOpen((prev) => !prev)} aria-label="toggle menu">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen ? (
        <div className="border-t border-line bg-base/95 md:hidden">
          <div className="section-wrap flex flex-col gap-2 py-3">
            {isAuthenticated
              ? NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-white/5 hover:text-ink"
                  >
                    {link.label}
                  </NavLink>
                ))
              : isPublicLanding
                ? PUBLIC_SECTIONS.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        scrollToSection(item.id);
                        setMobileOpen(false);
                      }}
                      className="rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-white/5 hover:text-ink"
                    >
                      {item.label}
                    </button>
                  ))
                : null}
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full border-lineStrong bg-white/[0.03]" variant="ghost">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full border-0" variant="gradient">
                    Get Started
                  </Button>
                </Link>
              </>
            ) : (
              <Button variant="danger" onClick={onLogout}>
                Logout
              </Button>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}
