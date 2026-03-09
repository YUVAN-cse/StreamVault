import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getSubscribedChannels, toggleSubscription } from '../api/social.api';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/common/UI';
import { formatCount } from '../utils/helpers';
import toast from 'react-hot-toast';
import { HiUserGroup } from 'react-icons/hi';

export default function SubscriptionsPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.userId) return;
    // getSubscribedChannels returns array of Subscription docs with .channel populated
    getSubscribedChannels(user.userId)
      .then(res => {
        const subs = res.data || [];
        // Each item: { channel: { username, email, fullName }, subscriber, ... }
        setChannels(subs.map(s => s.channel).filter(Boolean));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const handleUnsubscribe = async (channelId) => {
    try {
      await toggleSubscription(channelId);
      setChannels(c => c.filter(ch => ch._id !== channelId));
      toast.success('Unsubscribed');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#FF2D2D' }}>
          <HiUserGroup size={18} className="text-white" />
        </div>
        <h1 className="font-display text-3xl tracking-widest">SUBSCRIPTIONS</h1>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 skeleton rounded-xl" />
          ))}
        </div>
      ) : channels.length === 0 ? (
        <div className="text-center py-20 text-brand-sub">
          <HiUserGroup size={40} className="mx-auto mb-3 opacity-30" />
          <p>Not subscribed to any channels</p>
          <Link to="/" className="text-brand-red hover:underline text-sm mt-2 block">Discover channels</Link>
        </div>
      ) : (
        <div className="space-y-2">
          {channels.map(ch => (
            <div key={ch._id}
              className="flex items-center justify-between p-4 bg-brand-card border border-brand-border rounded-xl hover:border-brand-red/20 transition-all">
              <Link to={`/channel/${ch.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                <Avatar src={ch.avatar} name={ch.fullName || ch.username} size="md" />
                <div className="min-w-0">
                  <p className="font-medium text-brand-text truncate">{ch.fullName}</p>
                  <p className="text-xs text-brand-sub">@{ch.username}</p>
                </div>
              </Link>
              <button onClick={() => handleUnsubscribe(ch._id)}
                className="ml-4 px-3 py-1.5 rounded-full text-xs font-medium bg-brand-muted text-brand-sub hover:bg-red-900/30 hover:text-red-400 transition-all border border-brand-border">
                Unsubscribe
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
