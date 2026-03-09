import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getAllVideos } from '../api/video.api';
import VideoCard from '../components/video/VideoCard';
import { VideoCardSkeleton } from '../components/common/Skeletons';
import { HiFire, HiClock, HiEye, HiSearch } from 'react-icons/hi';

const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Latest', icon: HiClock },
  { value: 'views', label: 'Popular', icon: HiEye },
  { value: 'likesCount', label: 'Trending', icon: HiFire },
];

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const q = searchParams.get('q') || '';  // kept as q in URL, mapped to query in api call
  const sort = searchParams.get('sort') || 'createdAt';

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAllVideos({ q, sortBy: sort, sortType: 'desc', limit: 24 });
      setVideos(res.data?.videos || res.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load videos');
    } finally {
      setLoading(false);
    }
  }, [q, sort]);

  useEffect(() => { fetchVideos(); }, [fetchVideos]);

  const setSort = (value) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          {q ? (
            <div className="flex items-center gap-2">
              <HiSearch className="text-brand-red" size={20} />
              <h1 className="text-lg font-semibold text-brand-text">
                Results for <span className="text-brand-red">"{q}"</span>
              </h1>
            </div>
          ) : (
            <h1 className="font-display text-3xl tracking-widest text-brand-text">DISCOVER</h1>
          )}
        </div>

        {/* Sort tabs */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-brand-border bg-brand-card">
          {SORT_OPTIONS.map(({ value, label, icon: Icon }) => (
            <button key={value} onClick={() => setSort(value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-all ${
                sort === value
                  ? 'bg-brand-red text-white'
                  : 'text-brand-sub hover:text-brand-text'
              }`}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {error ? (
        <div className="text-center py-20 text-brand-sub">
          <p className="text-red-400 mb-2">{error}</p>
          <button onClick={fetchVideos} className="text-sm text-brand-red hover:underline">Try again</button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => <VideoCardSkeleton key={i} />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-full bg-brand-card border border-brand-border flex items-center justify-center mx-auto mb-4">
            <HiSearch size={28} className="text-brand-sub" />
          </div>
          <p className="text-brand-sub text-lg">No videos found</p>
          {q && <p className="text-brand-sub/60 text-sm mt-1">Try a different search term</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {videos.map((video, i) => (
            <div key={video._id} style={{ animationDelay: `${i * 40}ms` }}>
              <VideoCard video={video} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
