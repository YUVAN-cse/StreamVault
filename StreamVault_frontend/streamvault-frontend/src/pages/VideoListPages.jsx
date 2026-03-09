import { useState, useEffect } from 'react';
import { getWatchHistory } from '../api/user.api';
import { getLikedVideos } from '../api/social.api';
import VideoCard from '../components/video/VideoCard';
import { VideoCardSkeleton } from '../components/common/Skeletons';
import { HiClock, HiHeart } from 'react-icons/hi';

function VideoListPage({ fetcher, title, icon: Icon, emptyMsg, mapFn }) {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetcher()
      .then(res => {
        const raw = res.data;
        setVideos(mapFn ? mapFn(raw) : (raw?.videos || raw || []));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: '#FF2D2D' }}>
          <Icon size={18} className="text-white" />
        </div>
        <h1 className="font-display text-3xl tracking-widest">{title}</h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24 text-brand-sub">
          <Icon size={40} className="mx-auto mb-3 opacity-30" />
          <p>{emptyMsg}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((v, i) => <VideoCard key={v._id || i} video={v} />)}
        </div>
      )}
    </div>
  );
}

export function HistoryPage() {
  // getWatchHistory returns full user object — watchHistory is array of populated videos
  return (
    <VideoListPage
      fetcher={getWatchHistory}
      title="WATCH HISTORY"
      icon={HiClock}
      emptyMsg="No watch history yet"
      mapFn={(data) => data?.watchHistory || []}
    />
  );
}

export function LikedVideosPage() {
  // getLikedVideos returns array of Like docs with .video populated
  return (
    <VideoListPage
      fetcher={getLikedVideos}
      title="LIKED VIDEOS"
      icon={HiHeart}
      emptyMsg="No liked videos yet"
      mapFn={(data) => {
        const likes = Array.isArray(data) ? data : [];
        // Each item is a Like doc: { video: {...}, likedBy, ... }
        return likes.map(like => like.video).filter(Boolean);
      }}
    />
  );
}
