import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="noise-overlay min-h-screen bg-brand-dark">
      <Navbar onMenuToggle={() => setSidebarOpen(v => !v)} />
      <Sidebar open={sidebarOpen} />

      <main className={`pt-14 transition-all duration-300 ${sidebarOpen ? 'md:ml-56' : 'md:ml-16'}`}>
        <div className="min-h-[calc(100vh-3.5rem)] p-4 md:p-6 page-enter">
          <Outlet />
        </div>
      </main>

      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#111118',
            color: '#E8E8F0',
            border: '1px solid #1E1E2E',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#FF2D2D', secondary: '#fff' } },
        }}
      />
    </div>
  );
}
