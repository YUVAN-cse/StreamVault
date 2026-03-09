import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getInitials } from '../../utils/helpers';
import { HiSearch, HiUpload, HiMenu, HiUser, HiLogout, HiCog, HiCollection, HiClock, HiHeart } from 'react-icons/hi';

export default function Navbar({ onMenuToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [dropOpen, setDropOpen] = useState(false);
  const dropRef = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center px-4 gap-3"
      style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1E1E2E' }}>

      <div className="flex items-center gap-3 min-w-0">
        <button onClick={onMenuToggle} className="p-2 rounded-lg text-brand-sub hover:text-brand-text hover:bg-brand-card transition-colors">
          <HiMenu size={20} />
        </button>
        <Link to="/" className="flex items-center gap-1.5 shrink-0">
          <div className="w-7 h-7 rounded flex items-center justify-center" style={{ background: '#FF2D2D' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <span className="font-display text-xl tracking-wider text-brand-text hidden sm:block">STREAMVAULT</span>
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto">
        <div className="flex items-center rounded-full overflow-hidden border border-brand-border focus-within:border-brand-red/60 transition-colors">
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search videos..."
            className="flex-1 bg-brand-card px-4 py-2 text-sm border-none text-brand-text placeholder:text-brand-sub"
            style={{ outline: 'none', border: 'none' }} />
          <button type="submit" className="px-4 py-2 bg-brand-muted hover:bg-brand-red/80 text-brand-sub hover:text-white transition-colors">
            <HiSearch size={18} />
          </button>
        </div>
      </form>

      <div className="flex items-center gap-2 shrink-0">
        {user ? (
          <>
            <Link to="/upload" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-brand-border hover:border-brand-red/50 hover:text-brand-red transition-colors">
              <HiUpload size={16} /><span>Upload</span>
            </Link>

            <div className="relative" ref={dropRef}>
              <button onClick={() => setDropOpen(v => !v)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden ring-2 ring-brand-border hover:ring-brand-red transition-all"
                style={{ background: user.avatar ? 'transparent' : '#FF2D2D' }}>
                {user.avatar
                  ? <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                  : <span className="text-white text-xs">{getInitials(user.fullName || user.username)}</span>
                }
              </button>

              {dropOpen && (
                <div className="absolute right-0 top-11 w-52 rounded-xl border border-brand-border overflow-hidden shadow-2xl animate-fade-in z-50"
                  style={{ background: '#111118' }}>
                  <div className="px-4 py-3 border-b border-brand-border">
                    <p className="text-sm font-medium text-brand-text truncate">{user.fullName || user.username}</p>
                    <p className="text-xs text-brand-sub truncate">@{user.username}</p>
                  </div>
                  <div className="py-1">
                    {[
                      { icon: HiUser, label: 'Your Channel', to: `/channel/${user.userId || user._id}` },
                      { icon: HiClock, label: 'Watch History', to: '/history' },
                      { icon: HiHeart, label: 'Liked Videos', to: '/liked' },
                      // use userId since that's what JWT payload has
                      { icon: HiCollection, label: 'Playlists', to: `/playlists/${user.userId || user._id}` },
                      { icon: HiCog, label: 'Settings', to: '/settings' },
                    ].map(({ icon: Icon, label, to }) => (
                      <Link key={label} to={to} onClick={() => setDropOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-sub hover:text-brand-text hover:bg-brand-muted/50 transition-colors">
                        <Icon size={16} />{label}
                      </Link>
                    ))}
                    <button onClick={() => { logout(); setDropOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-brand-muted/50 transition-colors border-t border-brand-border mt-1">
                      <HiLogout size={16} />Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login" className="px-3 py-1.5 text-sm text-brand-sub hover:text-brand-text transition-colors">Sign in</Link>
            <Link to="/register" className="px-3 py-1.5 text-sm font-medium rounded-full text-white transition-colors" style={{ background: '#FF2D2D' }}>Join</Link>
          </div>
        )}
      </div>
    </header>
  );
}
