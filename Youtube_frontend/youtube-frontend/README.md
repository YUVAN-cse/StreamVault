# StreamVault — YouTube Frontend

A full-featured YouTube clone frontend built with React + Vite + Tailwind CSS.

## Tech Stack
- **React 18** + **Vite 5**
- **Tailwind CSS 3** — utility-first styling
- **React Router v6** — client-side routing
- **Axios** — API calls with interceptors
- **React Hot Toast** — notifications
- **React Icons** — icon library
- **React Hook Form** — form handling

## Folder Structure
```
src/
├── api/               # API call functions (mirrors your backend routes)
│   ├── axios.js       # Axios instance + interceptors
│   ├── user.api.js    # /users/* endpoints
│   ├── video.api.js   # /videos/* endpoints
│   └── social.api.js  # comments, likes, subscriptions, playlists
├── components/
│   ├── common/        # UI, Skeletons, ProtectedRoute
│   ├── layout/        # Navbar, Sidebar, Layout
│   └── video/         # VideoCard
├── context/
│   └── AuthContext.jsx  # Global auth state (JWT cookies)
├── pages/             # One file per route
├── utils/
│   └── helpers.js     # formatCount, timeAgo, formatDuration
└── App.jsx            # Router + routes
```

## Setup
```bash
npm install
npm run dev
```

The Vite dev server proxies `/api` → `http://localhost:5000`, so your backend must be running on port 5000.

## Pages
| Route | Page | Auth |
|-------|------|------|
| `/` | Home / Search | Public |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/video/:videoId` | Video Watch | Public |
| `/channel/:username` | Channel | Public |
| `/upload` | Upload Video | 🔒 |
| `/settings` | Edit Profile | 🔒 |
| `/history` | Watch History | 🔒 |
| `/liked` | Liked Videos | 🔒 |
| `/playlists` | Playlists | 🔒 |
| `/subscriptions` | Subscriptions | 🔒 |

## API Alignment
All endpoints match your backend exactly:
- `POST /api/v1/users/register` — multipart/form-data (avatar + coverImage)
- `GET /api/v1/users/channel-info/:username`
- `GET /api/v1/videos?q=&sortBy=&sortType=&limit=`
- `POST /api/v1/subscriptions/:channelId` — toggle
- `POST /api/v1/likes/video/:videoId` — toggle
- etc.

## Auth
Uses **JWT httpOnly cookies** — `withCredentials: true` is set on all Axios requests.
