import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserPlaylists, createPlaylist, deletePlaylist, getPlaylistById } from '../api/social.api';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Textarea } from '../components/common/UI';
import VideoCard from '../components/video/VideoCard';
import toast from 'react-hot-toast';
import { HiCollection, HiPlus, HiTrash, HiFilm } from 'react-icons/hi';

export default function PlaylistsPage() {
  const { userId } = useParams();
  console.log('PlaylistsPage userId param:', userId);
  const { user } = useAuth();
  const targetId = userId || user?._id;

  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [selected, setSelected] = useState(null);
  const [playlistVideos, setPlaylistVideos] = useState([]);
  const [loadingVideos, setLoadingVideos] = useState(false);

  const isOwn = user?._id === targetId;

  useEffect(() => {
    if (!targetId) return;
    getUserPlaylists(targetId)
      .then(res => setPlaylists(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [targetId]);

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error('Name required');
    setCreating(true);
    try {
      const res = await createPlaylist(form);
      setPlaylists(p => [res.data, ...p]);
      setForm({ name: '', description: '' });
      setShowForm(false);
      toast.success('Playlist created!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete playlist?')) return;
    try {
      await deletePlaylist(id);
      setPlaylists(p => p.filter(pl => pl._id !== id));
      if (selected?._id === id) setSelected(null);
      toast.success('Deleted');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openPlaylist = async (pl) => {
    setSelected(pl);
    setLoadingVideos(true);
    try {
      const res = await getPlaylistById(pl._id);
      setPlaylistVideos(res.data?.videos || []);
    } catch {}
    finally { setLoadingVideos(false); }
  };

  if (selected) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setSelected(null)}
            className="text-brand-sub hover:text-brand-text transition-colors text-sm">← Back</button>
          <h1 className="font-display text-2xl tracking-widest">{selected.name}</h1>
        </div>
        {selected.description && <p className="text-brand-sub text-sm">{selected.description}</p>}
        {loadingVideos ? (
          <div className="text-center py-12 text-brand-sub">Loading...</div>
        ) : playlistVideos.length === 0 ? (
          <div className="text-center py-12 text-brand-sub">
            <HiFilm size={32} className="mx-auto mb-2 opacity-30" />
            <p>No videos in this playlist</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {playlistVideos.map(v => <VideoCard key={v._id} video={v} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#FF2D2D' }}>
            <HiCollection size={18} className="text-white" />
          </div>
          <h1 className="font-display text-3xl tracking-widest">PLAYLISTS</h1>
        </div>
        {isOwn && (
          <Button onClick={() => setShowForm(v => !v)} variant="outline" size="sm">
            <HiPlus size={16} />
            New Playlist
          </Button>
        )}
      </div>

      {showForm && (
        <div className="bg-brand-card border border-brand-border rounded-xl p-4 space-y-3 animate-fade-up">
          <Input placeholder="Playlist name" value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Textarea placeholder="Description (optional)" rows={2} value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          <div className="flex gap-2">
            <Button loading={creating} onClick={handleCreate} size="sm">Create</Button>
            <Button variant="ghost" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 skeleton rounded-xl" />
          ))}
        </div>
      ) : playlists.length === 0 ? (
        <div className="text-center py-20 text-brand-sub">
          <HiCollection size={40} className="mx-auto mb-3 opacity-30" />
          <p>No playlists yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {playlists.map(pl => (
            <div key={pl._id}
              className="group relative bg-brand-card border border-brand-border rounded-xl p-4 cursor-pointer hover:border-brand-red/30 transition-all"
              onClick={() => openPlaylist(pl)}>
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-brand-muted flex items-center justify-center mb-3">
                    <HiCollection size={20} className="text-brand-red" />
                  </div>
                  <h3 className="font-medium text-brand-text truncate">{pl.name}</h3>
                  {pl.description && (
                    <p className="text-xs text-brand-sub mt-1 line-clamp-2">{pl.description}</p>
                  )}
                  <p className="text-xs text-brand-sub mt-2">
                    {pl.videos?.length || 0} videos
                  </p>
                </div>
                {isOwn && (
                  <button
                    onClick={e => { e.stopPropagation(); handleDelete(pl._id); }}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-brand-muted text-brand-sub hover:text-red-400 transition-all">
                    <HiTrash size={15} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
