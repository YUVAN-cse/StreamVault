import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, getCurrentUser } from '../api/user.api';
import { Button, Input } from '../components/common/UI';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      // Backend sets httpOnly cookies, returns { accessToken, refreshToken }
      await loginUser(form);
      // Fetch actual user data from JWT via getCurrentUser
      const userRes = await getCurrentUser();
      const userData = userRes.data;
      if (userData?.userId && !userData._id) userData._id = userData.userId;
      login(userData);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #FF2D2D, transparent)' }} />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: '#FF2D2D' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><path d="M8 5v14l11-7z" /></svg>
          </div>
          <h1 className="font-display text-3xl tracking-widest">STREAMVAULT</h1>
          <p className="text-brand-sub text-sm mt-1">Sign in to continue</p>
        </div>

        <div className="bg-brand-card border border-brand-border rounded-2xl p-6 space-y-4">
          <Input label="Email" type="email" placeholder="you@example.com"
            value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            error={errors.email} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          <Input label="Password" type="password" placeholder="••••••••"
            value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            error={errors.password} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
          <Button onClick={handleSubmit} loading={loading} className="w-full mt-2" size="lg">Sign In</Button>
        </div>

        <p className="text-center text-sm text-brand-sub mt-4">
          New to StreamVault?{' '}
          <Link to="/register" className="text-brand-red hover:underline">Create account</Link>
        </p>
      </div>
    </div>
  );
}
