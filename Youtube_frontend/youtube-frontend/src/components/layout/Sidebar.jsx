import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  HiHome, HiClock, HiHeart, HiCollection,
  HiTrendingUp, HiUserGroup, HiUpload, HiCog, HiFire
} from 'react-icons/hi';

const navItems = [
  { icon: HiHome, label: 'Home', to: '/' },
  { icon: HiFire, label: 'Trending', to: '/?sort=views' },
  { icon: HiTrendingUp, label: 'New', to: '/?sort=createdAt' },
];

const authItems = [
  { icon: HiClock, label: 'History', to: '/history' },
  { icon: HiHeart, label: 'Liked', to: '/liked' },
  { icon: HiCollection, label: 'Playlists', to: '/playlists' },
  { icon: HiUserGroup, label: 'Subscriptions', to: '/subscriptions' },
  { icon: HiUpload, label: 'Upload', to: '/upload' },
  { icon: HiCog, label: 'Settings', to: '/settings' },
];

export default function Sidebar({ open }) {
  const { user } = useAuth();

  return (
    <>
      {/* Overlay on mobile */}
      {open && <div className="fixed inset-0 z-30 bg-black/60 md:hidden" />}

      <aside className={`fixed left-0 top-14 bottom-0 z-40 flex flex-col border-r border-brand-border transition-all duration-300 overflow-y-auto
        ${open ? 'w-56' : 'w-0 md:w-16'}`}
        style={{ background: '#0A0A0F' }}>

        <nav className="py-4 flex-1">
          <Section items={navItems} collapsed={!open} />

          {user && (
            <>
              <div className={`my-2 border-t border-brand-border ${!open && 'md:mx-2'}`} />
              <Section items={authItems} collapsed={!open} />
            </>
          )}
        </nav>

        {open && (
          <div className="px-4 py-4 border-t border-brand-border">
            <p className="text-xs text-brand-sub">© 2025 StreamVault</p>
          </div>
        )}
      </aside>
    </>
  );
}

function Section({ items, collapsed }) {
  return (
    <div className="px-2 space-y-0.5">
      {items.map(({ icon: Icon, label, to }) => (
        <NavLink key={to} to={to}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all group
            ${isActive
              ? 'text-white bg-brand-red/15 border border-brand-red/20'
              : 'text-brand-sub hover:text-brand-text hover:bg-brand-card'
            }
            ${collapsed ? 'md:justify-center md:px-2' : ''}`
          }
          title={collapsed ? label : ''}>
          <Icon size={18} className="shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">{label}</span>}
        </NavLink>
      ))}
    </div>
  );
}
