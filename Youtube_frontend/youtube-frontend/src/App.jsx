import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VideoPage from './pages/VideoPage';
import ChannelPage from './pages/ChannelPage';
import UploadPage from './pages/UploadPage';
import SettingsPage from './pages/SettingsPage';
import { HistoryPage, LikedVideosPage } from './pages/VideoListPages';
import PlaylistsPage from './pages/PlaylistsPage';
import SubscriptionsPage from './pages/SubscriptionsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/channel/:userId" element={<ChannelPage />} />
            <Route path="/video/:videoId" element={<VideoPage />} />

            {/* Protected */}
            <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
            <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
            <Route path="/liked" element={<ProtectedRoute><LikedVideosPage /></ProtectedRoute>} />
            <Route path="/playlists" element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>} />
            <Route path="/playlists/:userId" element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>} />
            <Route path="/subscriptions" element={<ProtectedRoute><SubscriptionsPage /></ProtectedRoute>} />

            {/* 404 */}
            <Route path="*" element={
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <p className="font-display text-8xl text-brand-red/20">404</p>
                <p className="text-brand-sub">Page not found</p>
                <a href="/" className="text-brand-red hover:underline text-sm">Go home</a>
              </div>
            } />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
