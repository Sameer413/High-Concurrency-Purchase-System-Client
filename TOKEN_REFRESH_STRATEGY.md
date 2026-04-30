# Token Refresh Strategy - On-Demand Only

## Overview

The authentication system now uses an **on-demand token refresh strategy**. Tokens are only refreshed when an API request returns a 401 Unauthorized error, not on a timer.

## How It Works

### 1. Normal API Requests
- All authenticated API requests include the access token in the `Authorization: Bearer` header
- Cookies (including refresh token) are automatically sent with every request (`credentials: "include"`)

### 2. When Access Token Expires
1. API request returns **401 Unauthorized**
2. `baseQueryWithReauth` intercepts the 401 error
3. Automatically calls `/auth/refresh` endpoint
4. Server reads refresh token from httpOnly cookie
5. Server returns new access token
6. New access token is stored in Redux
7. Original API request is **automatically retried** with new token
8. User never notices the refresh happened

### 3. Mutex Prevents Race Conditions
- If multiple requests fail with 401 simultaneously
- Only ONE refresh request is made
- Other requests wait for the refresh to complete
- All requests retry with the new token

### 4. When Refresh Fails
- If refresh returns 401 (refresh token expired/invalid)
- Auth state is cleared
- User is logged out
- Redirect to login page (handled by `CheckAuth`)

## Benefits

✅ **No unnecessary refresh calls** - Only refresh when needed
✅ **Seamless user experience** - Failed requests are automatically retried
✅ **No race conditions** - Mutex ensures single refresh at a time
✅ **Cookie-based security** - Refresh token in httpOnly cookie (XSS protection)
✅ **Automatic retry** - Original request succeeds after token refresh

## Token Lifetimes

- **Access Token**: 15 minutes
- **Refresh Token**: 7 days (in httpOnly cookie)

## Code Flow

```
User makes API request
    ↓
Access token expired?
    ↓ YES
401 Unauthorized
    ↓
baseQueryWithReauth intercepts
    ↓
Acquire mutex lock
    ↓
Call /auth/refresh
    ↓
Success? → Store new token → Retry original request
    ↓ NO
Clear auth → Logout user
```

## Files Modified

1. **client/lib/baseQuery.ts**
   - Added automatic refresh on 401
   - Added mutex to prevent race conditions
   - Added credentials: "include" for cookies

2. **client/components/AuthProvider.tsx**
   - Removed timer-based refresh
   - Simplified to only hydrate auth state

3. **client/features/auth/authApi.ts**
   - Added credentials: "include"
   - Removed aggressive auth clearing on refresh failure

## Testing

To test the refresh flow:

1. Login to the application
2. Wait 15+ minutes (or manually expire the token in Redux DevTools)
3. Make any authenticated API request (e.g., fetch products)
4. Check Network tab - you should see:
   - Original request → 401
   - /auth/refresh → 200
   - Original request retried → 200
5. User stays logged in seamlessly

## Security Features

- ✅ Refresh token in httpOnly cookie (can't be accessed by JavaScript)
- ✅ Access token in memory (Redux) and localStorage for persistence
- ✅ CORS with credentials enabled
- ✅ Automatic logout on refresh failure
- ✅ Protected routes redirect to login
