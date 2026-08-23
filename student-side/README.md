# 🎓 Saylani Bootcamp LMS — Student Portal Frontend

Welcome to the **Saylani Bootcamp LMS Student Portal** repository! This codebase is architected following software-house production standards with clean code separation, modular component hierarchy, design token centralization, and scalable state management.

---

## 📁 Software House Architecture & Directory Layout

```
student-side/
├── public/                     # Static public assets (favicons, icons)
├── src/
│   ├── api/                    # HTTP & Axios Network Layer
│   │   ├── axiosClient.js      # Axios instance with JWT interceptors & 401 handlers
│   │   ├── endpoints.js        # Centralized REST API endpoints
│   │   └── index.js            # Barrel exports
│   │
│   ├── assets/                 # SVGs, images, static media
│   │
│   ├── components/             # Reusable UI & Layout Components
│   │   ├── common/             # Atomic Design System (Button, Card, Modal, Input, Badge, etc.)
│   │   ├── layout/             # Shells (StudentSidebar, StudentHeader, StudentFooter, StudentLayout)
│   │   ├── dashboard/          # Dashboard widgets (KPIs, AttendanceWidget, TasksWidget, etc.)
│   │   ├── attendance/         # Attendance tables, filters, metric cards
│   │   ├── tasks/              # Task cards, submission modals, filters
│   │   ├── team/               # Team members list, project detail cards
│   │   └── profile/            # Profile card, change password modal
│   │
│   ├── constants/              # Immutable configs, enums & navigation
│   │   ├── apiEndpoints.js     # API Route Constants
│   │   ├── navigation.js       # Sidebar navigation items
│   │   └── statusTypes.js      # Enums for statuses & badge color mappings
│   │
│   ├── context/                # React Context State Providers
│   │   ├── AuthContext.jsx     # Student auth state, token storage, login/logout
│   │   ├── ThemeContext.jsx    # Dark/Light theme switching with persistent storage
│   │   └── index.js
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useAuth.js          # Authentication hook
│   │   ├── useTheme.js         # Theme toggle hook
│   │   ├── useFetch.js         # Generic data fetching hook with loading/error states
│   │   └── index.js
│   │
│   ├── pages/                  # Page Route Views
│   │   ├── auth/               # Student Login (`/login`)
│   │   ├── dashboard/          # Student Overview (`/dashboard`)
│   │   ├── attendance/         # Class Attendance Records (`/attendance`)
│   │   ├── tasks/              # Assignments & Submissions (`/tasks`)
│   │   ├── team/               # Team & Capstone Workspace (`/team`)
│   │   ├── profile/            # Account & Security Settings (`/profile`)
│   │   └── not-found/          # 404 Fallback View
│   │
│   ├── routes/                 # Routing Engine
│   │   ├── AppRoutes.jsx       # Route definitions
│   │   ├── ProtectedRoute.jsx  # Guards authenticated student routes
│   │   └── PublicRoute.jsx     # Redirects authenticated students away from login
│   │
│   ├── services/               # Data Access & Backend Service Layer
│   │   ├── auth.service.js
│   │   ├── dashboard.service.js
│   │   ├── attendance.service.js
│   │   ├── task.service.js
│   │   ├── team.service.js
│   │   └── profile.service.js
│   │
│   ├── styles/                 # Design System & Styling
│   │   ├── variables.css       # Design tokens (Colors, Typography, Spacing, Shadows, Dark Mode)
│   │   └── index.css           # Global resets, ambient gradients & panel styles
│   │
│   ├── utils/                  # Helper Utilities
│   │   ├── formatters.js       # Date, percentage, initials formatters
│   │   ├── storage.js          # Safe localStorage wrappers
│   │   └── validators.js       # Form and URL validation
│   │
│   ├── App.jsx                 # Root Application Shell
│   └── main.jsx                # DOM Entry Point
│
├── .gitignore
├── DEVELOPMENT_GUIDE.md        # Step-by-step implementation guide for developers
├── package.json
└── vite.config.js
```

---

## 🎨 Design System & CSS Variables Rules

All styling tokens are centralized in `src/styles/variables.css`.

### 🚨 Golden Rule:
- ❌ **Never** write raw hex colors or arbitrary px values:
  ```css
  /* BAD */
  color: #00639b;
  padding: 16px;
  ```
- ✅ **Always** use design system CSS variables:
  ```css
  /* GOOD */
  color: var(--color-primary);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--radius-xl);
  ```

### Quick Token Reference:
| Category | Variables |
|---|---|
| **Primary Brand** | `var(--color-primary)`, `var(--color-on-primary)`, `var(--color-primary-container)` |
| **Surfaces** | `var(--color-background)`, `var(--color-surface)`, `var(--color-surface-container)` |
| **Text** | `var(--color-text)`, `var(--color-text-muted)`, `var(--color-text-subtle)` |
| **Status** | `var(--color-success)`, `var(--color-warning)`, `var(--color-error)`, `var(--color-info)` |
| **Spacing** | `var(--spacing-xs)` (4px), `var(--spacing-sm)` (8px), `var(--spacing-md)` (16px), `var(--spacing-lg)` (24px) |
| **Radius** | `var(--radius-sm)` (4px), `var(--radius-md)` (6px), `var(--radius-lg)` (8px), `var(--radius-xl)` (12px) |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The server will run on `http://localhost:5174`.

### 3. Build for Production
```bash
npm run build
```

---

## 🔌 Connecting to Backend API

Update the backend URL in `.env` or `src/constants/apiEndpoints.js`:
```env
VITE_API_URL=http://localhost:5000/api
```
All API calls in `src/services/` automatically handle authentication tokens through `src/api/axiosClient.js`.
