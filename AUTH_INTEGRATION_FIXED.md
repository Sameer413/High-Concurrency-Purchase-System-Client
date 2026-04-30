# Authentication Integration - Fixed

## Summary of Changes

The authentication system has been updated to work properly with the NestJS backend that uses **httpOnly cookies** for refresh tokens.

## Key Changes

### 1. **authApi.ts** - Updated API Integration
- Added `credentials: "include"` to send cookies with requests
- Updated response types to match server responses:
  - Login returns: `{ accessToken, expiresIn, tokenType }`
  - Register returns: `{ success, message, data: { user } }`
  - Refresh returns: `{ accessToken, expiresIn, tokenType }`
- Added `onQueryStarted` hooks to automatically update Redux state after successful API calls
- Refresh token is now stored in httpOnly cookie (server-side), not in Redux

### 2. **hooks.ts** - Simplified Auth Hooks
- Removed `useRefreshToken` selector (refresh token is in httpOnly cookie)
- Updated `useAuth` hook to work with new API responses
- Simplified token refresh - no need to pass refresh token (it's in cookie)
- Added proper error handling for all auth operations

### 3. **AuthProvider.tsx** - Cookie-Based Token Refresh
- Removed dependency on `tokenRefreshManager`
- Simplified to use cookie-based refresh tokens
- Automatic token refresh every minute
- Refresh on tab visibility change
- Refresh when connection is restored

### 4. **CheckAuth.tsx** - Authentication Guard
- Checks if user is authenticated on app load
- Fetches current user data if authenticated
- Redirects unauthenticated users from protected routes
- Protected routes: `/cart`, `/checkout`, `/favorites`, `/profile`

### 5. **auth/page.tsx** - Login/Register Page
- Added error message display
- Added password confirmation validation for signup
- Proper error handling with user-friendly messages
- Redirects to home page after successful auth

## How It Works

### On App Load:
1. `authSlice` loads saved auth state from `localStorage` (access token, user data)
2. `CheckAuth` component checks if user is authenticated
3. If authenticated, fetches current user data from `/auth/me`
4. If not authenticated and on protected route, redirects to `/auth`

### Login Flow:
1. User submits email/password
2. API calls `/auth/login`
3. Server returns access token in response body
4. Server sets refresh token in httpOnly cookie
5. Redux stores access token and user data
6. User is redirected to home page

### Token Refresh Flow:
1. `AuthProvider` checks token expiration every minute
2. When token needs refresh, calls `/auth/refresh`
3. Server reads refresh token from httpOnly cookie
4. Server returns new access token
5. Redux updates access token
6. Server sets new refresh token in httpOnly cookie

### Logout Flow:
1. User clicks logout
2. API calls `/auth/logout`
3. Server clears httpOnly cookies
4. Redux clears auth state
5. localStorage is cleared

## Protected Routes

Routes that require authentication:
- `/cart` - Shopping cart
- `/checkout` - Checkout process
- `/favorites` - Favorite products
- `/profile` - User profile

Unauthenticated users are redirected to `/auth` with a redirect parameter to return after login.

## Security Features

1. **httpOnly Cookies**: Refresh tokens are stored in httpOnly cookies, preventing XSS attacks
2. **Automatic Token Refresh**: Tokens are refreshed automatically before expiration
3. **Secure Storage**: Access tokens are stored in Redux (memory) and localStorage for persistence
4. **CORS with Credentials**: API requests include credentials for cookie handling
5. **Protected Routes**: Automatic redirection for unauthenticated access

## Testing

To test the authentication:

1. **Register**: Go to `/auth`, click "Create Account", fill form, submit
2. **Login**: Go to `/auth`, enter credentials, submit
3. **Protected Route**: Try accessing `/cart` without login (should redirect)
4. **Token Refresh**: Wait 1 minute, check network tab for automatic refresh
5. **Logout**: Click logout button, verify cookies are cleared
6. **Persistence**: Login, refresh page, verify you're still logged in

## Environment Variables

Make sure these are set in `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5455/api/v1
```

## Server Requirements

The server must:
1. Set httpOnly cookies for refresh tokens
2. Accept credentials in CORS configuration
3. Return proper response formats as documented above
4. Handle `/auth/me` endpoint for fetching current user
