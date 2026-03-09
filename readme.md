<div align="center">

<img src="https://img.shields.io/badge/StreamVault-FF2D2D?style=for-the-badge&logo=youtube&logoColor=white" alt="StreamVault" />

# StreamVault 🎬

### A full-stack YouTube clone built with Node.js + React

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

---

## 📸 Preview

> A cinematic dark-themed video platform where creators upload, share and engage with their audience.

![StreamVault Home](https://placehold.co/1200x600/0A0A0F/FF2D2D?text=StreamVault+Preview)

---

## ✨ Features

- 🔐 **Authentication** — Register, Login, Logout with JWT httpOnly cookies
- 🎥 **Video Upload** — Upload videos + thumbnails directly to Cloudinary
- 📺 **Video Playback** — Native HTML5 video player with view tracking
- 👍 **Likes** — Toggle likes on videos and comments
- 💬 **Comments** — Add, edit, delete comments with like support
- 🔔 **Subscriptions** — Subscribe/unsubscribe to channels
- 📋 **Playlists** — Create, manage and view playlists
- 🕒 **Watch History** — Auto-tracked per user
- 👤 **Channel Pages** — Public channel with subscriber count, videos tab
- ⚙️ **Settings** — Update profile, avatar, cover image, password
- 🔍 **Search** — Full-text search with sort by Latest / Popular / Trending
- 📱 **Responsive** — Works on mobile, tablet and desktop

---

## 🗂️ Project Structure

```
StreamVault/
├── backend/                        # Express + MongoDB API
│   ├── controllers/
│   │   ├── user.controller.js
│   │   ├── video.controller.js
│   │   ├── comment.controller.js
│   │   ├── like.controller.js
│   │   ├── subscription.controller.js
│   │   └── playlist.controller.js
│   ├── models/
│   │   ├── user.models.js
│   │   ├── video.models.js
│   │   ├── comment.models.js
│   │   ├── like.models.js
│   │   ├── subscription.models.js
│   │   └── playlist.models.js
│   ├── routes/
│   │   ├── user.routes.js
│   │   ├── video.routes.js
│   │   ├── comment.routes.js
│   │   ├── like.routes.js
│   │   ├── subscription.routes.js
│   │   └── playlist.routes.js
│   ├── middleware/
│   │   ├── auth.middleware.js      # JWT verify + Joi schema validation
│   │   └── multer.config.js        # File upload config
│   ├── utils/
│   │   ├── ApiResponse.js          # Standardized API response class
│   │   ├── ErrorClass.js           # Custom AppError class
│   │   ├── cloudinary.js           # Cloudinary upload + local cleanup
│   │   └── wrapAsync.js            # Async error handler wrapper
│   └── app.js
│
└── youtube-frontend/               # React + Vite + Tailwind frontend
    ├── src/
    │   ├── api/
    │   │   ├── axios.js            # Axios instance with interceptors
    │   │   ├── user.api.js
    │   │   ├── video.api.js
    │   │   └── social.api.js       # comments, likes, subs, playlists
    │   ├── components/
    │   │   ├── common/             # UI, Skeletons, ProtectedRoute
    │   │   ├── layout/             # Navbar, Sidebar, Layout
    │   │   └── video/              # VideoCard
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── VideoPage.jsx
    │   │   ├── ChannelPage.jsx
    │   │   ├── UploadPage.jsx
    │   │   ├── SettingsPage.jsx
    │   │   ├── PlaylistsPage.jsx
    │   │   ├── SubscriptionsPage.jsx
    │   │   └── VideoListPages.jsx  # History + Liked videos
    │   └── utils/
    │       └── helpers.js          # formatCount, timeAgo, formatDuration
    └── vite.config.js
```

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JWT | Authentication (httpOnly cookies) |
| Cloudinary | Video + image storage |
| Multer | File upload handling |
| Joi | Request validation |
| bcrypt | Password hashing |

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | UI library |
| Vite | Build tool + dev server |
| Tailwind CSS | Utility-first styling |
| React Router v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| React Hot Toast | Toast notifications |
| React Icons | Icon library |

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/YUVAN-cse/streamvault.git
cd streamvault
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/streamvault
JWT_ACCESS_SECRET=your_access_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_EXPIRY=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Setup Frontend
```bash
cd youtube-frontend
npm install
npm run dev
# App runs on http://localhost:5173
```

> ⚠️ Make sure your backend has CORS configured:
> ```js
> app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
> ```

---

## 📡 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/users/register` | ❌ | Register with avatar + cover |
| POST | `/api/v1/users/login` | ❌ | Login, sets httpOnly cookies |
| POST | `/api/v1/users/logout` | ✅ | Clear cookies |
| POST | `/api/v1/users/refresh-token` | ❌ | Refresh access token |
| GET | `/api/v1/users/current-user` | ✅ | Get JWT payload |
| PUT | `/api/v1/users/update-account` | ✅ | Update username, fullName, email |
| PUT | `/api/v1/users/update-avatar` | ✅ | Update avatar image |
| PUT | `/api/v1/users/update-cover-image` | ✅ | Update cover image |
| POST | `/api/v1/users/change-password` | ✅ | Change password |
| GET | `/api/v1/users/channel-info/:username` | ✅ | Channel stats via aggregation |
| GET | `/api/v1/users/watch-history` | ✅ | Populated watch history |

### Videos
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/videos` | ❌ | Get all videos (query, sortBy, sortType, userId, page, limit) |
| POST | `/api/v1/videos` | ✅ | Upload video + thumbnail |
| GET | `/api/v1/videos/:videoId` | ✅ | Get video + increment views |
| PUT | `/api/v1/videos/:videoId` | ✅ | Update video |
| DELETE | `/api/v1/videos/:videoId` | ✅ | Delete video + Cloudinary assets |

### Comments
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/comments/:videoId` | ❌ | Get paginated comments |
| POST | `/api/v1/comments/:videoId` | ✅ | Add comment |
| PUT | `/api/v1/comments/:commentId` | ✅ | Update comment |
| DELETE | `/api/v1/comments/:commentId` | ✅ | Delete comment |

### Likes
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/likes/video/:videoId` | ✅ | Toggle video like |
| POST | `/api/v1/likes/comment/:commentId` | ✅ | Toggle comment like |
| GET | `/api/v1/likes/videos` | ✅ | Get liked videos |

### Subscriptions
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/subscriptions/:channelId` | ✅ | Toggle subscription |
| GET | `/api/v1/subscriptions/subscribers/:channelId` | ❌ | Get channel subscribers |
| GET | `/api/v1/subscriptions/channels/:subscriberId` | ❌ | Get subscribed channels |

### Playlists
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/playlists` | ✅ | Create playlist |
| GET | `/api/v1/playlists/:userId` | ✅ | Get user playlists |
| GET | `/api/v1/playlists/get/:playlistId` | ✅ | Get playlist by ID |
| POST | `/api/v1/playlists/:playlistId/videos/:videoId` | ✅ | Add video to playlist |
| DELETE | `/api/v1/playlists/:playlistId/videos/:videoId` | ✅ | Remove video from playlist |
| DELETE | `/api/v1/playlists/:playlistId` | ✅ | Delete playlist |
| PUT | `/api/v1/playlists/:playlistId` | ✅ | Update playlist |

---

## 📦 API Response Format

All responses follow a consistent format:

```json
{
  "success": true,
  "status": 200,
  "message": "Videos fetched",
  "data": { ... },
  "timestamp": "2025-08-31T12:00:00.000Z"
}
```

Error responses:
```json
{
  "status": 404,
  "message": "Video not found",
  "code": "NOT_FOUND",
  "details": {},
  "timestamp": "2025-08-31T12:00:00.000Z"
}
```

---

## 🔒 Authentication Flow

```
1. User logs in → Backend sets httpOnly cookies (accessToken + refreshToken)
2. All protected requests automatically send cookies (withCredentials: true)
3. Backend middleware verifies JWT → attaches req.user (JWT payload)
4. On token expiry → call /refresh-token to get new access token
```

---

## 🎨 Frontend Pages

| Route | Page | Protected |
|-------|------|-----------|
| `/` | Home / Search / Sort | ❌ |
| `/login` | Login | ❌ |
| `/register` | Register | ❌ |
| `/video/:videoId` | Video Watch + Comments | ❌ |
| `/channel/:username` | Channel Profile | ❌ |
| `/upload` | Upload Video | ✅ |
| `/settings` | Edit Profile | ✅ |
| `/history` | Watch History | ✅ |
| `/liked` | Liked Videos | ✅ |
| `/playlists` | Playlists | ✅ |
| `/subscriptions` | Subscriptions | ✅ |

---

## 👨‍💻 Author

Built with ❤️ by **[Yuvan R](https://github.com/YUVAN-cse)**

---

<div align="center">

⭐ **Star this repo if you found it helpful!** ⭐

</div>
