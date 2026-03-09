// import { Link } from 'react-router-dom';
// import { formatCount, formatDuration, timeAgo, getInitials } from '../../utils/helpers';
// import { HiDotsVertical } from 'react-icons/hi';

// export default function VideoCard({ video, onDelete, showOwner = true }) {
//   if (!video) return null;

//   const {
//     _id, title, thumbnail, duration, views, createdAt,
//     owner, likesCount
//   } = video;

//   return (
//     <div className="group relative rounded-xl overflow-hidden border border-brand-border hover:border-brand-red/30 transition-all duration-300 bg-brand-card hover:shadow-lg hover:shadow-brand-red/5 animate-fade-up">
//       {/* Thumbnail */}
//       <Link to={`/video/${_id}`} className="block relative aspect-video overflow-hidden bg-brand-muted">
//         {thumbnail ? (
//           <img
//             src={thumbnail}
//             alt={title}
//             className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
//             loading="lazy"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-brand-muted">
//             <svg width="40" height="40" viewBox="0 0 24 24" fill="#2A2A3E">
//               <path d="M8 5v14l11-7z" />
//             </svg>
//           </div>
//         )}

//         {/* Duration badge */}
//         {duration && (
//           <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono text-white"
//             style={{ background: 'rgba(0,0,0,0.85)' }}>
//             {formatDuration(duration)}
//           </span>
//         )}

//         {/* Hover overlay */}
//         <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//           <div className="w-12 h-12 rounded-full bg-brand-red/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
//               <path d="M8 5v14l11-7z" />
//             </svg>
//           </div>
//         </div>
//       </Link>

//       {/* Info */}
//       <div className="p-3 flex gap-3">
//         {showOwner && owner && (
//           <Link to={`/channel/${owner.username}`} className="shrink-0">
//             <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-brand-border">
//               {owner.avatar
//                 ? <img src={owner.avatar} alt={owner.username} className="w-full h-full object-cover" />
//                 : <div className="w-full h-full bg-brand-red flex items-center justify-center text-white text-xs font-bold">
//                     {getInitials(owner.fullName || owner.username)}
//                   </div>
//               }
//             </div>
//           </Link>
//         )}

//         <div className="flex-1 min-w-0">
//           <Link to={`/video/${_id}`}>
//             <h3 className="text-sm font-medium text-brand-text line-clamp-2 hover:text-white transition-colors leading-snug">
//               {title}
//             </h3>
//           </Link>
//           {showOwner && owner && (
//             <Link to={`/channel/${owner.username}`}
//               className="text-xs text-brand-sub hover:text-brand-red transition-colors mt-1 block truncate">
//               @{owner.username}
//             </Link>
//           )}
//           <div className="flex items-center gap-2 mt-1 text-xs text-brand-sub">
//             <span>{formatCount(views)} views</span>
//             <span>•</span>
//             <span>{timeAgo(createdAt)}</span>
//           </div>
//         </div>

//         {onDelete && (
//           <button onClick={(e) => { e.preventDefault(); onDelete(_id); }}
//             className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-brand-muted text-brand-sub hover:text-red-400 transition-all self-start">
//             <HiDotsVertical size={14} />
//           </button>
//         )}
//       </div>
//     </div>
//   );
// }



import { Link } from "react-router-dom";
import {
  formatCount,
  formatDuration,
  timeAgo,
  getInitials,
} from "../../utils/helpers";
import { HiDotsVertical } from "react-icons/hi";

export default function VideoCard({ video, onDelete, showOwner = true }) {
  if (!video) return null;

  const {
    _id,
    title,
    thumbnail,
    duration,
    views,
    createdAt,
    owner,
    likesCount,
  } = video;

  return (
    <div className="group relative rounded-xl overflow-hidden border border-brand-border hover:border-brand-red/30 transition-all duration-300 bg-brand-card hover:shadow-lg hover:shadow-brand-red/5 animate-fade-up">
      
      {/* Thumbnail */}
      <Link
        to={`/video/${_id}`}
        className="block relative aspect-video overflow-hidden bg-brand-muted"
      >
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-brand-muted">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="#2A2A3E">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}

        {/* Duration */}
        {duration && (
          <span
            className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded text-xs font-mono text-white"
            style={{ background: "rgba(0,0,0,0.85)" }}
          >
            {formatDuration(duration)}
          </span>
        )}

        {/* Hover Play Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-red/90 flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-3 flex gap-3">

        {/* Channel Avatar */}
        {showOwner && owner && (
          <Link to={`/channel/${owner._id}`} className="shrink-0">
            <div className="w-8 h-8 rounded-full overflow-hidden ring-1 ring-brand-border">
              {owner.avatar ? (
                <img
                  src={owner.avatar}
                  alt={owner.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-brand-red flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(owner.fullName || owner.username)}
                </div>
              )}
            </div>
          </Link>
        )}

        {/* Video Meta */}
        <div className="flex-1 min-w-0">

          {/* Title */}
          <Link to={`/video/${_id}`}>
            <h3 className="text-sm font-medium text-brand-text line-clamp-2 hover:text-white transition-colors leading-snug">
              {title}
            </h3>
          </Link>

          {/* Channel Name */}
          {showOwner && owner && (
            <Link
              to={`/channel/${owner._id}`}
              className="text-xs text-brand-sub hover:text-brand-red transition-colors mt-1 block truncate"
            >
              @{owner.username}
            </Link>
          )}

          {/* Stats */}
          <div className="flex items-center gap-2 mt-1 text-xs text-brand-sub">
            <span>{formatCount(views)} views</span>
            <span>•</span>
            <span>{timeAgo(createdAt)}</span>
          </div>
        </div>

        {/* Delete Menu */}
        {onDelete && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(_id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-brand-muted text-brand-sub hover:text-red-400 transition-all self-start"
          >
            <HiDotsVertical size={14} />
          </button>
        )}
      </div>
    </div>
  );
}