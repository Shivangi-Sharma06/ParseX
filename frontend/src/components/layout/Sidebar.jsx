import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';

export function Sidebar() {
  return (
    <aside className="clay-panel hidden h-fit w-64 p-4 lg:block">
      <nav className="space-y-1">
        {NAV_LINKS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-white/10 text-white' : 'text-muted hover:bg-white/5'}`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
