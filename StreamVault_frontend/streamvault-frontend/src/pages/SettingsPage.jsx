import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateAccount, updateAvatar, updateCoverImage, changePassword } from '../api/user.api';
import { Button, Input } from '../components/common/UI';
import toast from 'react-hot-toast';
import { HiCamera, HiLockClosed, HiUser } from 'react-icons/hi';

export default function SettingsPage() {
  const { user, refetch } = useAuth();
  const avatarRef = useRef(null);
  const coverRef = useRef(null);

  // updateAccount requires username + fullName + email (all 3 required by backend)
  const [profile, setProfile] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    username: user?.username || '',
  });
  const [passwords, setPasswords] = useState({ oldPassword: '', newPassword: '' });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const handleUpdateProfile = async () => {
    if (!profile.username || !profile.fullName || !profile.email) {
      return toast.error('All fields are required');
    }
    setSavingProfile(true);
    try {
      await updateAccount(profile);
      await refetch();
      toast.success('Profile updated!');
    } catch (err) {
      toast.error(err.message || 'Update failed');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword) return toast.error('Fill all fields');
    if (passwords.newPassword.length < 6) return toast.error('Min 6 characters');
    setSavingPass(true);
    try {
      await changePassword(passwords);
      setPasswords({ oldPassword: '', newPassword: '' });
      toast.success('Password changed!');
    } catch (err) {
      toast.error(err.message || 'Failed');
    } finally {
      setSavingPass(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try {
      await updateAvatar(fd);
      await refetch();
      toast.success('Avatar updated!');
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  const handleCoverChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('coverImage', file);
    try {
      await updateCoverImage(fd);
      await refetch();
      toast.success('Cover image updated!');
    } catch (err) {
      toast.error(err.message || 'Failed');
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: HiUser },
    { id: 'security', label: 'Security', icon: HiLockClosed },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="font-display text-3xl tracking-widest">SETTINGS</h1>
        <p className="text-brand-sub text-sm mt-1">Manage your account</p>
      </div>

      <div className="flex gap-1 p-1 bg-brand-card rounded-xl border border-brand-border w-fit">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
              activeTab === id ? 'bg-brand-muted text-brand-text' : 'text-brand-sub hover:text-brand-text'
            }`}>
            <Icon size={15} />{label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-5">
          {/* Cover */}
          <div className="relative h-36 rounded-xl overflow-hidden bg-brand-muted cursor-pointer group"
            onClick={() => coverRef.current?.click()}>
            {user?.coverImage
              ? <img src={user.coverImage} alt="cover" className="w-full h-full object-cover" />
              : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1E1E2E 0%, #2A2A3E 100%)' }} />
            }
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-sm">
              <HiCamera size={18} /> Change Cover
            </div>
            <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          </div>

          {/* Avatar */}
          <div className="flex items-center gap-4 -mt-10 px-4">
            <div className="relative cursor-pointer group" onClick={() => avatarRef.current?.click()}>
              <div className="w-20 h-20 rounded-full overflow-hidden ring-4 ring-brand-dark">
                {user?.avatar
                  ? <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <div className="w-full h-full bg-brand-red flex items-center justify-center text-white text-xl font-display">
                      {user?.username?.[0]?.toUpperCase()}
                    </div>
                }
              </div>
              <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <HiCamera size={16} className="text-white" />
              </div>
              <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div className="mt-10">
              <p className="font-medium text-brand-text">{user?.fullName}</p>
              <p className="text-xs text-brand-sub">@{user?.username} · Click to change</p>
            </div>
          </div>

          <div className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
            <Input label="Username" value={profile.username}
              onChange={e => setProfile(p => ({ ...p, username: e.target.value.toLowerCase() }))} />
            <Input label="Full Name" value={profile.fullName}
              onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))} />
            <Input label="Email" type="email" value={profile.email}
              onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} />
            <Button onClick={handleUpdateProfile} loading={savingProfile}>Save Changes</Button>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="bg-brand-card border border-brand-border rounded-xl p-5 space-y-4">
          <h2 className="font-medium text-brand-text">Change Password</h2>
          <Input label="Current Password" type="password" placeholder="••••••••"
            value={passwords.oldPassword}
            onChange={e => setPasswords(p => ({ ...p, oldPassword: e.target.value }))} />
          <Input label="New Password" type="password" placeholder="Min 6 characters"
            value={passwords.newPassword}
            onChange={e => setPasswords(p => ({ ...p, newPassword: e.target.value }))} />
          <Button onClick={handleChangePassword} loading={savingPass}>Update Password</Button>
        </div>
      )}
    </div>
  );
}
