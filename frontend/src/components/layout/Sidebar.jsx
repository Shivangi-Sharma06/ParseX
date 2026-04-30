import { NavLink } from 'react-router-dom';
import { NAV_LINKS } from '../../utils/constants';

export function Sidebar() {
  return (
    <aside className="glass-panel hidden h-fit w-64 p-4 lg:block">
      <nav className="space-y-1">
        {NAV_LINKS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm transition-colors duration-200 ${
                isActive ? 'bg-white/[0.12] text-ink shadow-[0_0_0_1px_rgba(255,255,255,0.08)]' : 'text-muted hover:bg-white/5 hover:text-ink'
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
