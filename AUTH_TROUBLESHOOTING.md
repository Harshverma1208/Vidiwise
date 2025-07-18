# Authentication Troubleshooting Guide

## 🔧 Issues Fixed

The authentication system had several critical issues that were causing the 500 Internal Server Error after sign-out. Here's what was fixed:

### 1. Missing Import in API Route
**Problem**: The `/api/profile/route.ts` was missing the import for the `auth` function.
```typescript
// ❌ Before (MISSING IMPORT)
export async function POST(request: Request) {
    const session = await auth() // This would fail!
    
// ✅ After (FIXED)
import { auth } from "~/auth";
export async function POST(request: Request) {
    const session = await auth()
```

### 2. Logical Error in Profile Helper
**Problem**: The `getOrCreateProfile` function had a logic error where it tried to access `session?.user?.id` when session was null.
```typescript
// ❌ Before (LOGIC ERROR)
if (!session) {
  return redirect("/api/auth/signin?callbackUrl=/c/" + session?.user?.id); // session is null!
}

// ✅ After (FIXED)
if (!session?.user?.id) {
  return redirect("/api/auth/signin");
}
```

### 3. NextAuth Configuration Issues
**Problem**: The NextAuth configuration was incomplete and missing the database adapter.
```typescript
// ❌ Before (INCOMPLETE CONFIG)
export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [...],
  callbacks: {
    session({ session, user }) {
      // session.user.id = user.id  // Commented out!
      return session
    },
  },
  // adapter: DrizzleAdapter(db), // Commented out!
})

// ✅ After (COMPLETE CONFIG)
export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers: [...],
  callbacks: {
    session({ session, token }) {
      if (token?.sub && session?.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/api/auth/signin",
    error: "/api/auth/error",
  },
})
```

### 4. TypeScript Type Issues
**Problem**: Incorrect TypeScript types for NextAuth were causing type errors.
```typescript
// ❌ Before (WRONG TYPES)
declare module "next-auth" {
  interface User {
    id: number; // Should be string!
  }
  interface Session {
    id: string; // Wrong structure!
  }
}

// ✅ After (CORRECT TYPES)
declare module "next-auth" {
  interface User {
    id: string;
  }
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}
```

### 5. Enhanced Error Handling
**Problem**: Sign-out failures didn't have proper error handling.
```typescript
// ❌ Before (NO ERROR HANDLING)
const handleSignOut = async () => {
  setIsProfileDropdownOpen(false);
  await signOut({ callbackUrl: '/' });
};

// ✅ After (WITH ERROR HANDLING)
const handleSignOut = async () => {
  try {
    setIsProfileDropdownOpen(false);
    console.log('🔄 Signing out user...');
    await signOut({ 
      callbackUrl: '/',
      redirect: true 
    });
    console.log('✅ Sign out successful');
  } catch (error) {
    console.error('❌ Sign out error:', error);
    // Force redirect to home page even if signOut fails
    window.location.href = '/';
  }
};
```

## 🧪 Testing the Fix

### 1. Test Authentication Flow
Visit: `http://localhost:3000/test-auth`
- This page allows you to test sign-in and sign-out functionality
- Shows detailed session information and any errors
- Provides console logging for debugging

### 2. Main Application Flow
1. Go to the homepage
2. Sign in with Google
3. Use the application features
4. Sign out using the profile dropdown
5. Try to sign in again - should work without errors

### 3. Check Console Logs
The enhanced error handling now provides detailed logging:
```
🔄 Signing out user...
✅ Sign out successful
```

Or if there's an error:
```
❌ Sign out error: [error details]
```

## 🔍 Debugging Tools

### Console Logging
The application now includes comprehensive logging for authentication events:
- Sign-in attempts
- Sign-out attempts  
- Session state changes
- Error conditions

### Error Page
A dedicated error page at `/api/auth/error` provides:
- User-friendly error messages
- Technical details for debugging
- Options to retry or go home

### Test Page
The `/test-auth` page provides:
- Real-time session status
- Detailed session information
- Manual sign-in/sign-out controls
- Error display

## 🚀 Production Checklist

Before deploying to production, ensure:

1. **Environment Variables**: All required environment variables are set:
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`  
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `DATABASE_URL`

2. **Database**: Ensure the database is properly set up with the correct schema for NextAuth tables.

3. **Google OAuth**: Verify Google OAuth configuration includes the correct redirect URLs.

4. **Testing**: Test the complete authentication flow including:
   - Sign in
   - Sign out
   - Re-sign in after sign out
   - Error scenarios

## ✅ Summary

The authentication system is now properly configured with:
- ✅ Complete NextAuth setup with database adapter
- ✅ Proper error handling throughout the sign-in/sign-out flow
- ✅ Correct TypeScript types
- ✅ Comprehensive logging and debugging tools
- ✅ Graceful error recovery
- ✅ Test pages for verification

The 500 Internal Server Error should no longer occur when signing out and attempting to sign in again. 