import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth.js';

const links = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/upload', label: 'Upload' },
  { to: '/jobs', label: 'Jobs' },
  { to: '/matching', label: 'Matching' },
];

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="kicker">Resume Parser & Matching Engine</p>
          <h1>ParseX Recruit</h1>
        </div>

        <div className="topbar-right">
          <span className="chip">{user?.email}</span>
          <button className="btn dark" type="button" onClick={onLogout}>
            Logout
          </button>
        </div>
      </header>

      <nav className="nav-strip">
        {links.map((link) => (
          <NavLink key={link.to} to={link.to} className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            {link.label}
          </NavLink>
        ))}
      </nav>

      <main className="content-wrap">
        <Outlet />
      </main>
    </div>
  );
}
