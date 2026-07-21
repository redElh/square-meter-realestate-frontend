# Backend Authentication System

Clean backend implementation for OAuth authentication with Google and Facebook using **httpOnly cookies**.

## Structure

```
src/backend/
├── config/
│   ├── database.js      # PostgreSQL connection
│   └── passport.js      # OAuth strategies
├── controllers/
│   └── authController.js # Auth logic
├── middleware/
│   └── auth.js          # JWT authentication
├── routes/
│   └── authRoutes.js    # Auth endpoints
├── utils/
│   └── jwt.js           # JWT utilities
└── index.js             # Server entry point
```

## Features

- Google OAuth authentication
- Facebook OAuth authentication
- **JWT tokens in httpOnly cookies** (secure, no manual management)
- JWT access tokens (15min expiry)
- Refresh tokens (7 days expiry)
- Automatic user creation/update
- Session management
- Auth check endpoint

## API Endpoints

### OAuth Login
- `GET /auth/google` - Initiate Google login
- `GET /auth/google/callback` - Google callback
- `GET /auth/facebook` - Initiate Facebook login
- `GET /auth/facebook/callback` - Facebook callback

### Token Management
- `POST /auth/refresh` - Refresh access token (uses cookie)
- `GET /auth/check` - Check authentication status (no auth required)

### User Management
- `GET /auth/me` - Get current user (requires auth cookie)
- `POST /auth/logout` - Logout user (requires auth cookie)

## Running the Backend

```bash
# Start backend only
npm run backend

# Start both frontend and backend
npm run dev
```

Server runs on: http://localhost:4000

## Environment Variables

All required variables are in `.env.local`:
- `DATABASE_URL` - PostgreSQL connection
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL` - http://localhost:4000/auth/google/callback
- `FACEBOOK_APP_ID` / `FACEBOOK_APP_SECRET`
- `FACEBOOK_CALLBACK_URL` - http://localhost:4000/auth/facebook/callback
- `JWT_SECRET` / `JWT_REFRESH_SECRET`
- `FRONTEND_URL` - For CORS and redirects (http://localhost:3000)

## OAuth Flow

1. User clicks "Login with Google/Facebook"
2. Frontend redirects to `/auth/google` or `/auth/facebook`
3. User authenticates with provider
4. Backend receives user data, creates/updates user
5. Backend generates JWT tokens and sets them in httpOnly cookies:
   - `accessToken` cookie (15min expiry)
   - `refreshToken` cookie (7 days expiry)
6. Redirects to `${FRONTEND_URL}/auth/success`
7. Frontend redirects to dashboard
8. All subsequent requests automatically include cookies

## Cookie Security

### Access Token Cookie
- **Name**: `accessToken`
- **HttpOnly**: true (JavaScript cannot access)
- **Secure**: true in production (HTTPS only)
- **SameSite**: lax (CSRF protection)
- **Max-Age**: 15 minutes

### Refresh Token Cookie
- **Name**: `refreshToken`
- **HttpOnly**: true
- **Secure**: true in production
- **SameSite**: lax
- **Max-Age**: 7 days

## Authentication Check

The `/auth/check` endpoint allows the frontend to verify authentication status:

```javascript
GET /auth/check

Response:
{
  "authenticated": true,
  "user": {
    "id": "...",
    "email": "...",
    "role": "user",
    "first_name": "...",
    "last_name": "..."
  }
}
// or
{
  "authenticated": false
}
```

## Logout

Logout clears both cookies and removes refresh_token from database:

```javascript
POST /auth/logout

Response:
{
  "message": "Logged out successfully"
}
```

## No Manual Token Management

✅ Cookies are automatically included in requests
✅ No need to add Authorization headers
✅ More secure than localStorage/sessionStorage
✅ Protected from XSS attacks
✅ Automatic CSRF protection with SameSite
