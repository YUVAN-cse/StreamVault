import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registerUser, getCurrentUser } from '../api/user.api';
import { Button, Input } from '../components/common/UI';
import toast from 'react-hot-toast';
import { HiCamera, HiUser } from 'react-icons/hi';

export default function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  const [form, setForm] = useState({ fullName: '', username: '', email: '', password: '' });
  const [avatar, setAvatar] = useState(null);
  const [cover, setCover] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const pickFile = (setter, previewSetter) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setter(file);
    previewSetter(URL.createObjectURL(file));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = 'Full name required';
    if (!form.username.trim()) e.username = 'Username required';
    if (!form.email.trim()) e.email = 'Email required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (!avatar) e.avatar = 'Profile photo required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('avatar', avatar);
      if (cover) fd.append('coverImage', cover);

      // register returns the saved user doc
      await registerUser(fd);
      // But we need to login separately since register doesn't set cookies
      toast.success('Account created! Please sign in.');
      navigate('/login');
    } catch (err) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#FF2D2D' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <h1 className="font-display text-3xl tracking-widest">JOIN STREAMVAULT</h1>
          <p className="text-brand-sub text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-5">
          {/* Cover image */}
          <div>
            <p className="text-sm text-brand-sub mb-2">Cover Image <span className="text-brand-sub/50">(optional)</span></p>
            <div onClick={() => coverRef.current?.click()}
              className="h-24 rounded-xl border-2 border-dashed border-brand-border hover:border-brand-red/50 transition-colors cursor-pointer overflow-hidden relative flex items-center justify-center"
              style={coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}>
              {!coverPreview && (
                <div className="text-center text-brand-sub">
                  <HiCamera size={24} className="mx-auto mb-1" />
                  <p className="text-xs">Upload cover</p>
                </div>
              )}
              {coverPreview && (
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <HiCamera size={20} className="text-white" />
                </div>
              )}
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={pickFile(setCover, setCoverPreview)} />
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div onClick={() => avatarRef.current?.click()}
              className="w-16 h-16 rounded-full border-2 border-dashed border-brand-border hover:border-brand-red/50 transition-colors cursor-pointer overflow-hidden relative flex items-center justify-center bg-brand-muted shrink-0">
              {avatarPreview
                ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                : <HiUser size={24} className="text-brand-sub" />
              }
            </div>
            <div>
              <p className="text-sm text-brand-text font-medium">Profile Photo</p>
              <p className="text-xs text-brand-sub">Required. Click to upload.</p>
              {errors.avatar && <p className="text-xs text-red-400 mt-0.5">{errors.avatar}</p>}
            </div>
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={pickFile(setAvatar, setAvatarPreview)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input label="Full Name" placeholder="John Doe" value={form.fullName}
              onChange={e => set('fullName', e.target.value)} error={errors.fullName} />
            <Input label="Username" placeholder="johndoe" value={form.username}
              onChange={e => set('username', e.target.value.toLowerCase())} error={errors.username} />
          </div>
          <Input label="Email" type="email" placeholder="you@example.com" value={form.email}
            onChange={e => set('email', e.target.value)} error={errors.email} />
          <Input label="Password" type="password" placeholder="Min 6 characters" value={form.password}
            onChange={e => set('password', e.target.value)} error={errors.password} />

          <Button onClick={handleSubmit} loading={loading} className="w-full" size="lg">
            Create Account
          </Button>
        </div>

        <p className="text-center text-sm text-brand-sub mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-red hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
