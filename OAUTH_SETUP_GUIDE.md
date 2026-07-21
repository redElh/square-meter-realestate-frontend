# OAuth Authentication Setup - Complete Guide

## ✅ What's Implemented

### Backend (src/backend/)
- **JWT in httpOnly Cookies** - Secure token storage
- **Google OAuth** - Full authentication flow
- **Facebook OAuth** - Full authentication flow
- **Auto User Management** - Creates/updates users in PostgreSQL
- **Token Refresh** - Automatic token renewal
- **Auth Check Endpoint** - `/auth/check` for frontend auth state

### Frontend
- **Active OAuth Buttons** - Google & Facebook login
- **Cookie-based Auth** - No manual token management
- **Dynamic Header** - Shows "Connexion" or "Déconnexion" based on auth state
- **Protected Routes** - Automatic authentication checks
- **Seamless Logout** - Clears cookies and redirects

## 🚀 How to Run

### 1. Start Backend (Port 4000)
```bash
npm run backend
```

### 2. Start Frontend (Port 3000) 
```bash
npm start
```

### 3. Or Start Both Together
```bash
npm run dev
```

## 🔄 Authentication Flow

### Login Flow:
1. User clicks "Google" or "Facebook" button on `/auth` page
2. Redirects to `/auth/google` or `/auth/facebook` (proxied to backend)
3. Backend initiates OAuth with provider
4. User authenticates on Google/Facebook
5. Provider redirects to backend callback
6. Backend:
   - Creates/updates user in database
   - Generates JWT tokens
   - Sets tokens in httpOnly cookies
   - Redirects to `/auth/success`
7. Frontend redirects to `/dashboard`
8. Header automatically shows "Déconnexion" button

### Logout Flow:
1. User clicks "Déconnexion" button in menu
2. Frontend calls `/auth/logout`
3. Backend clears cookies and database refresh_token
4. Redirects to `/auth` page
5. Header shows "Connexion" button

## 🔐 Security Features

- **httpOnly Cookies** - JavaScript cannot access tokens
- **SameSite Protection** - CSRF protection
- **Secure in Production** - HTTPS-only cookies in production
- **Token Expiry** - Access token: 15min, Refresh token: 7 days
- **Database Validation** - All requests verify user exists

## 📡 API Endpoints

### Public Endpoints
- `GET /auth/google` - Initiate Google OAuth
- `GET /auth/facebook` - Initiate Facebook OAuth
- `GET /auth/check` - Check authentication status

### Protected Endpoints (Require Cookie)
- `GET /auth/me` - Get current user info
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh access token

## 🍪 Cookies Set

### accessToken
- **Expiry**: 15 minutes
- **HttpOnly**: true
- **SameSite**: lax
- **Secure**: production only

### refreshToken
- **Expiry**: 7 days
- **HttpOnly**: true
- **SameSite**: lax
- **Secure**: production only

## 🔧 Configuration

All OAuth credentials are in `.env.local`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:4000/auth/google/callback

# Facebook OAuth
FACEBOOK_APP_ID=...
FACEBOOK_APP_SECRET=...
FACEBOOK_CALLBACK_URL=http://localhost:4000/auth/facebook/callback

# JWT Secrets
JWT_SECRET=...
JWT_REFRESH_SECRET=...

# Database
DATABASE_URL=postgresql://...

# URLs
FRONTEND_URL=http://localhost:3000
```

## 📝 Database Schema

Users table already exists with required fields:
- `id` (uuid)
- `email` (unique)
- `password_hash` (nullable for OAuth)
- `provider` (google/facebook/local)
- `provider_id`
- `is_verified`
- `refresh_token`
- `role`
- `first_name`
- `last_name`
- `created_at`

## 🎯 Frontend Integration

### Check Authentication
```typescript
// Automatic in Header component
useEffect(() => {
  fetch('/auth/check', { credentials: 'include' })
    .then(res => res.json())
    .then(data => setIsAuthenticated(data.authenticated));
}, [location.pathname]);
```

### Logout
```typescript
const handleLogout = async () => {
  await fetch('/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  navigate('/auth');
};
```

### Protected Fetch
```typescript
// Cookies automatically included
fetch('/auth/me', { credentials: 'include' })
  .then(res => res.json())
  .then(data => console.log(data.user));
```

## ✨ Features

✅ No manual token management
✅ Automatic cookie handling
✅ Secure httpOnly cookies
✅ Dynamic header based on auth state
✅ Seamless OAuth flow
✅ Auto user creation/update
✅ Token refresh mechanism
✅ Protected routes support
✅ Logout clears all cookies

## 🐛 Troubleshooting

### Backend not connecting?
- Ensure backend is running: `npm run backend`
- Check port 4000 is available
- Verify DATABASE_URL in `.env.local`

### OAuth not working?
- Verify OAuth credentials in `.env.local`
- Check callback URLs match your setup
- Ensure frontend proxy is working

### Header shows wrong state?
- Backend must be running
- Check `/auth/check` endpoint returns 200
- Clear browser cookies and retry

## 📚 Testing

1. Start both servers
2. Go to http://localhost:3000/auth
3. Click "Google" or "Facebook"
4. Complete OAuth flow
5. Should redirect to dashboard
6. Open menu - should see "Déconnexion"
7. Click logout - returns to auth page
