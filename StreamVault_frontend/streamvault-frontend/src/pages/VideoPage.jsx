import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getVideoById } from '../api/video.api';
import { toggleVideoLike, toggleCommentLike } from '../api/social.api';
import { getVideoComments, addComment, updateComment, deleteComment } from '../api/social.api';
import { toggleSubscription } from '../api/social.api';
import { useAuth } from '../context/AuthContext';
import { Avatar, Button, Textarea } from '../components/common/UI';
import { VideoCardSkeleton, CommentSkeleton } from '../components/common/Skeletons';
import { formatCount, timeAgo } from '../utils/helpers';
import toast from 'react-hot-toast';
import { HiThumbUp, HiOutlineThumbUp, HiShare, HiPencil, HiTrash, HiCheck, HiX } from 'react-icons/hi';

export default function VideoPage() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchVideo(); fetchComments(); }, [videoId]);

  const fetchVideo = async () => {
    setLoading(true);
    try {
      const res = await getVideoById(videoId);
      const v = res.data;
      setVideo(v);
      setLiked(v.isLiked || false);
      setLikesCount(v.likesCount || 0);
      setSubscribed(v.owner?.isSubscribed || false);
    } catch (err) {
      toast.error(err.message || 'Failed to load video');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    setCommentsLoading(true);
    try {
      const res = await getVideoComments(videoId);
      // returns { totalDocs, totalPages, currentPage, pageSize, comments }
      setComments(res.data?.comments || []);
    } catch {}
    finally { setCommentsLoading(false); }
  };

  const handleLike = async () => {
    if (!user) return toast.error('Sign in to like');
    const prev = liked;
    setLiked(!prev);
    setLikesCount(c => prev ? c - 1 : c + 1);
    try { await toggleVideoLike(videoId); }
    catch { setLiked(prev); setLikesCount(c => prev ? c + 1 : c - 1); }
  };

  const handleSubscribe = async () => {
    if (!user) return toast.error('Sign in to subscribe');
    const prev = subscribed;
    setSubscribed(!prev);
    try {
      await toggleSubscription(video.owner._id);
      toast.success(prev ? 'Unsubscribed' : 'Subscribed!');
    } catch { setSubscribed(prev); }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      const res = await addComment(videoId, { content: newComment });
      // comment has author field (not owner)
      const comment = res.data;
      setComments(c => [{ ...comment, author: { ...user, _id: user?.userId } }, ...c]);
      setNewComment('');
    } catch (err) {
      toast.error(err.message || 'Failed to add comment');
    } finally { setSubmitting(false); }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('Link copied!');
  };

  if (loading) return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="aspect-video skeleton rounded-xl" />
        <VideoCardSkeleton />
      </div>
    </div>
  );

  if (!video) return <div className="text-center py-20 text-brand-sub">Video not found</div>;

  return (
    <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {/* Player — video.url from your model */}
        <div className="aspect-video rounded-xl overflow-hidden bg-black red-glow">
          <video ref={videoRef} src={video.url} poster={video.thumbnail}
            controls className="w-full h-full" autoPlay />
        </div>

        <div className="space-y-3">
          <h1 className="text-xl font-semibold text-brand-text leading-snug">{video.title}</h1>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 text-sm text-brand-sub">
              <span>{formatCount(video.views)} views</span>
              <span>•</span>
              <span>{timeAgo(video.createdAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleLike}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all text-sm font-medium ${
                  liked ? 'border-brand-red bg-brand-red/10 text-brand-red' : 'border-brand-border text-brand-sub hover:border-brand-red/50 hover:text-brand-text'
                }`}>
                {liked ? <HiThumbUp size={16} /> : <HiOutlineThumbUp size={16} />}
                {formatCount(likesCount)}
              </button>
              <button onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-brand-border text-sm text-brand-sub hover:text-brand-text transition-colors">
                <HiShare size={16} /> Share
              </button>
            </div>
          </div>
        </div>

        {/* Channel — populated owner has: username, email, fullName (no avatar from populate) */}
        {video.owner && (
          <div className="flex items-center justify-between p-4 bg-brand-card rounded-xl border border-brand-border">
            <Link to={`/channel/${video.owner.username}`} className="flex items-center gap-3">
              <Avatar src={video.owner.avatar} name={video.owner.fullName || video.owner.username} size="lg" />
              <div>
                <p className="font-medium text-brand-text">{video.owner.fullName}</p>
                <p className="text-sm text-brand-sub">@{video.owner.username}</p>
              </div>
            </Link>
            {user?.userId !== video.owner._id?.toString() && (
              <button onClick={handleSubscribe}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  subscribed ? 'bg-brand-muted text-brand-sub hover:bg-brand-border' : 'bg-brand-red text-white hover:bg-red-600'
                }`}>
                {subscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            )}
          </div>
        )}

        {video.description && (
          <div className="p-4 bg-brand-card rounded-xl border border-brand-border">
            <p className="text-sm text-brand-sub whitespace-pre-wrap leading-relaxed">{video.description}</p>
          </div>
        )}

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="font-semibold text-brand-text">
            Comments {comments.length > 0 && <span className="text-brand-sub font-normal">({comments.length})</span>}
          </h2>

          {user && (
            <div className="flex gap-3">
              <Avatar src={user.avatar} name={user.fullName || user.username} />
              <div className="flex-1 space-y-2">
                <Textarea placeholder="Write a comment..." value={newComment}
                  onChange={e => setNewComment(e.target.value)} rows={2} />
                {newComment.trim() && (
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => setNewComment('')}>Cancel</Button>
                    <Button size="sm" loading={submitting} onClick={handleComment}>Comment</Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {commentsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => <CommentSkeleton key={i} />)}
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map(comment => (
                <CommentItem key={comment._id} comment={comment} currentUser={user}
                  onUpdate={(id, content) => setComments(cs => cs.map(c => c._id === id ? { ...c, content } : c))}
                  onDelete={(id) => setComments(cs => cs.filter(c => c._id !== id))}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="hidden lg:block">
        <p className="text-sm text-brand-sub mb-3">Up Next</p>
        <div className="text-xs text-brand-sub/50 text-center py-8">More videos coming soon</div>
      </div>
    </div>
  );
}

function CommentItem({ comment, currentUser, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const [liked, setLiked] = useState(comment.isLiked || false);
  const [likes, setLikes] = useState(comment.likesCount || 0);
  const [loading, setLoading] = useState(false);

  // comment uses 'author' field (not owner)
  const author = comment.author || comment.owner;
  const isOwner = currentUser?.userId === author?._id?.toString() ||
                  currentUser?._id === author?._id?.toString();

  const handleLike = async () => {
    if (!currentUser) return toast.error('Sign in to like');
    const prev = liked;
    setLiked(!prev);
    setLikes(l => prev ? l - 1 : l + 1);
    try { await toggleCommentLike(comment._id); }
    catch { setLiked(prev); setLikes(l => prev ? l + 1 : l - 1); }
  };

  const handleUpdate = async () => {
    if (!editText.trim()) return;
    setLoading(true);
    try {
      await updateComment(comment._id, { content: editText });
      onUpdate(comment._id, editText);
      setEditing(false);
      toast.success('Comment updated');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(comment._id);
      onDelete(comment._id);
    } catch (err) { toast.error(err.message); }
  };

  return (
    <div className="flex gap-3 group">
      <Avatar src={author?.avatar} name={author?.fullName || author?.username} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-brand-text">@{author?.username}</span>
          <span className="text-xs text-brand-sub">{timeAgo(comment.createdAt)}</span>
        </div>

        {editing ? (
          <div className="space-y-2">
            <Textarea value={editText} onChange={e => setEditText(e.target.value)} rows={2} />
            <div className="flex gap-2">
              <Button size="sm" loading={loading} onClick={handleUpdate}><HiCheck size={14} /> Save</Button>
              <Button size="sm" variant="ghost" onClick={() => setEditing(false)}><HiX size={14} /> Cancel</Button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-brand-sub leading-relaxed">{comment.content}</p>
        )}

        <div className="flex items-center gap-3 mt-2">
          <button onClick={handleLike}
            className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-brand-red' : 'text-brand-sub hover:text-brand-text'}`}>
            <HiThumbUp size={13} />{likes > 0 && formatCount(likes)}
          </button>
          {isOwner && !editing && (
            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2 transition-opacity">
              <button onClick={() => setEditing(true)} className="text-xs text-brand-sub hover:text-brand-text flex items-center gap-1">
                <HiPencil size={12} /> Edit
              </button>
              <button onClick={handleDelete} className="text-xs text-red-400/70 hover:text-red-400 flex items-center gap-1">
                <HiTrash size={12} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
