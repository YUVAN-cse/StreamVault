import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getChannelInfo  , getChannelVideos} from '../api/user.api';
import { getAllVideos } from '../api/video.api';
import { toggleSubscription } from '../api/social.api';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/video/VideoCard';
import { VideoCardSkeleton, ChannelSkeleton } from '../components/common/Skeletons';
import { formatCount } from '../utils/helpers';
import toast from 'react-hot-toast';

export default function ChannelPage() {

  const { userId } = useParams();
  console.log('ChannelPage userId param1:', userId);
  const { user } = useAuth();
  console.log('ChannelPage user:', user);

  const targetId = userId || user?._id;  // use userId from URL if present, otherwise fallback to logged in user's channel
console.log('ChannelPage targetId:', targetId);
  const [channel, setChannel] = useState(null);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videosLoading, setVideosLoading] = useState(true);
  const [subscribed, setSubscribed] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    if (targetId) {
      fetchChannel();
    }
  }, [targetId]);
  
const fetchChannel = async () => {
  if (!targetId) return;

  setLoading(true);
  setVideosLoading(true);

  try {
    const res = await getChannelInfo(targetId);

    const ch = res.data;   // ✅ FIX

    setChannel(ch);
    console.log("Channel info response:", ch);
    setSubscribed(ch.isSubscribed || false);

    const videosRes = await getChannelVideos(ch._id);

    console.log("Channel videos response:", videosRes);

    setVideos(videosRes.data?.videos || []);

  } catch (err) {
    toast.error(err.message || "Channel not found");
  } finally {
    setLoading(false);
    setVideosLoading(false);
  }
};
  // const fetchVideos = async (ownerId) => {
  //   setVideosLoading(true);
  //   try {
  //     const res = await getAllVideos({ userId: ownerId });
  //     setVideos(res.data?.videos || []);
  //   } catch {}
  //   finally {
  //     setVideosLoading(false);
  //   }
  // };

  const handleSubscribe = async () => {
    if (!user) return toast.error('Sign in to subscribe');

    const prev = subscribed;

    setSubscribed(!prev);

    setChannel(c => ({
      ...c,
      subscribers: prev
        ? (c.subscribers || 1) - 1
        : (c.subscribers || 0) + 1
    }));

    try {
      await toggleSubscription(channel._id);
      toast.success(prev ? 'Unsubscribed' : 'Subscribed!');
    } catch {
      setSubscribed(prev);
    }
  };

  const isOwn = user?._id === targetId;

  if (loading) return (
    <div className="max-w-5xl mx-auto">
      <ChannelSkeleton />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
        {Array.from({ length: 6 }).map((_, i) =>
          <VideoCardSkeleton key={i} />
        )}
      </div>
    </div>
  );

  if (!channel)
    return (
      <div className="text-center py-20 text-brand-sub">
        Channel not found
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto space-y-0">

      {/* Cover */}
      <div className="h-40 md:h-52 rounded-2xl overflow-hidden bg-brand-muted relative mb-[60px]">
        {channel.coverImage
          ? <img src={channel.coverImage} alt="cover" className="w-full h-full object-cover" />
          : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg,#1E1E2E,#2A2A3E)' }} />
        }
      </div>

      {/* Header */}
      <div className="px-4 md:px-6 pb-4 border-b border-brand-border">

        <div className="flex items-end justify-between flex-wrap gap-4 -mt-10">

          <div className="flex items-end gap-4">

            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden ring-4 ring-brand-dark shrink-0">
              {channel.avatar
                ? <img src={channel.avatar} alt={channel.username} className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-brand-red flex items-center justify-center text-white text-2xl font-display">
                    {channel.username?.[0]?.toUpperCase()}
                  </div>
              }
            </div>

            <div className="pb-1">
              <h1 className="text-xl font-semibold text-brand-text">
                {channel.fullName}
              </h1>

              <p className="text-brand-sub text-sm">
                @{channel.username}
              </p>

              <div className="flex items-center gap-4 mt-1 text-xs text-brand-sub">
                <span>{formatCount(channel.subscribers || 0)} subscribers</span>
                <span>{formatCount(channel.subscribed || 0)} subscriptions</span>
                <span>{videos.length} videos</span>
              </div>
            </div>

          </div>

          {!isOwn && (
            <button
              onClick={handleSubscribe}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                subscribed
                  ? 'bg-brand-muted text-brand-sub hover:bg-brand-border'
                  : 'bg-brand-red text-white hover:bg-red-600'
              }`}
            >
              {subscribed ? '✓ Subscribed' : 'Subscribe'}
            </button>
          )}

          {isOwn && (
            <a
              href="/settings"
              className="px-5 py-2 rounded-full text-sm font-medium border border-brand-border text-brand-sub hover:text-brand-text"
            >
              Edit Channel
            </a>
          )}

        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-4 md:px-6 py-3 border-b border-brand-border">

        {['videos', 'about'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
              activeTab === tab
                ? 'bg-brand-card text-brand-text border border-brand-border'
                : 'text-brand-sub hover:text-brand-text'
            }`}
          >
            {tab}
          </button>
        ))}

      </div>

      <div className="py-6">

        {activeTab === 'videos' && (

          videosLoading
            ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) =>
                  <VideoCardSkeleton key={i} />
                )}
              </div>
            )

            : videos.length === 0
              ? (
                <div className="text-center py-16 text-brand-sub">
                  No videos yet
                </div>
              )

              : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {videos.map(v =>
                    <VideoCard key={v._id} video={v} showOwner={false} />
                  )}
                </div>
              )

        )}

      </div>

    </div>
  );
}