import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { publishVideo } from '../api/video.api';
import { Button, Input, Textarea } from '../components/common/UI';
import toast from 'react-hot-toast';
import { HiUpload, HiFilm, HiPhotograph, HiX } from 'react-icons/hi';

export default function UploadPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const thumbRef = useRef(null);

  const [form, setForm] = useState({ title: '', description: '' });
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbPreview, setThumbPreview] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!videoFile) e.video = 'Video file is required';
    if (!thumbnail) e.thumbnail = 'Thumbnail is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setUploading(true);
    setProgress(0);

    try {
      const fd = new FormData();
      fd.append('title', form.title);
      fd.append('description', form.description);
      fd.append('video', videoFile);
      fd.append('thumbnail', thumbnail);

      const res = await publishVideo(fd);
      toast.success('Video published!');
      navigate(`/video/${res.data?._id || ''}`);
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-widest">UPLOAD VIDEO</h1>
        <p className="text-brand-sub text-sm mt-1">Share your content with the world</p>
      </div>

      <div className="space-y-5">
        {/* Video file drop zone */}
        <div>
          <p className="text-sm text-brand-sub mb-2">Video File *</p>
          <div
            onClick={() => videoRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
              videoFile
                ? 'border-brand-red/50 bg-brand-red/5'
                : errors.video
                  ? 'border-red-500/50'
                  : 'border-brand-border hover:border-brand-red/40 hover:bg-brand-card'
            }`}>
            {videoFile ? (
              <div className="flex items-center justify-center gap-3">
                <HiFilm size={24} className="text-brand-red" />
                <div className="text-left">
                  <p className="text-sm font-medium text-brand-text truncate max-w-xs">{videoFile.name}</p>
                  <p className="text-xs text-brand-sub">{(videoFile.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={e => { e.stopPropagation(); setVideoFile(null); }}
                  className="ml-2 p-1 rounded-full hover:bg-brand-muted text-brand-sub hover:text-red-400">
                  <HiX size={14} />
                </button>
              </div>
            ) : (
              <>
                <HiUpload size={32} className="mx-auto mb-2 text-brand-sub" />
                <p className="text-sm text-brand-sub">Click to select video</p>
                <p className="text-xs text-brand-sub/50 mt-1">MP4, WebM, MOV up to 2GB</p>
              </>
            )}
          </div>
          {errors.video && <p className="text-xs text-red-400 mt-1">{errors.video}</p>}
          <input ref={videoRef} type="file" accept="video/*" className="hidden"
            onChange={e => { const f = e.target.files[0]; if (f) setVideoFile(f); }} />
        </div>

        {/* Thumbnail */}
        <div>
          <p className="text-sm text-brand-sub mb-2">Thumbnail *</p>
          <div
            onClick={() => thumbRef.current?.click()}
            className={`relative h-40 rounded-xl border-2 border-dashed cursor-pointer overflow-hidden transition-all flex items-center justify-center ${
              thumbnail ? 'border-brand-red/50' : errors.thumbnail ? 'border-red-500/50' : 'border-brand-border hover:border-brand-red/40 bg-brand-card hover:bg-brand-muted/30'
            }`}>
            {thumbPreview ? (
              <>
                <img src={thumbPreview} alt="thumbnail" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <HiPhotograph size={24} className="text-white" />
                </div>
                <button onClick={e => { e.stopPropagation(); setThumbnail(null); setThumbPreview(null); }}
                  className="absolute top-2 right-2 p-1 rounded-full bg-black/60 text-white hover:text-red-400">
                  <HiX size={14} />
                </button>
              </>
            ) : (
              <div className="text-center text-brand-sub">
                <HiPhotograph size={28} className="mx-auto mb-1" />
                <p className="text-sm">Upload thumbnail</p>
                <p className="text-xs text-brand-sub/50 mt-0.5">JPG, PNG — 16:9 recommended</p>
              </div>
            )}
          </div>
          {errors.thumbnail && <p className="text-xs text-red-400 mt-1">{errors.thumbnail}</p>}
          <input ref={thumbRef} type="file" accept="image/*" className="hidden"
            onChange={e => {
              const f = e.target.files[0];
              if (f) { setThumbnail(f); setThumbPreview(URL.createObjectURL(f)); }
            }} />
        </div>

        <Input label="Title *" placeholder="An awesome video title"
          value={form.title} onChange={e => set('title', e.target.value)} error={errors.title} />

        <Textarea label="Description" placeholder="Tell viewers about your video..."
          value={form.description} onChange={e => set('description', e.target.value)}
          rows={4} />

        {uploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-brand-sub">
              <span>Uploading to Cloudinary...</span>
              <span>Please wait</span>
            </div>
            <div className="h-1.5 bg-brand-muted rounded-full overflow-hidden">
              <div className="h-full bg-brand-red rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSubmit} loading={uploading} size="lg" className="flex-1">
            <HiUpload size={18} />
            {uploading ? 'Publishing...' : 'Publish Video'}
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate(-1)}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
