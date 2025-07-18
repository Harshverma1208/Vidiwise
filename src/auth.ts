import NextAuth from "next-auth"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import { DrizzleAdapter } from "@auth/drizzle-adapter"
import { env } from "~/env"
import { db } from "~/server/db"

// Create providers array - start empty and add providers conditionally
const providers = [];

// Only add Google provider if credentials are available
if (env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    })
  );
  console.log("✅ Google provider configured");
  console.log("🔑 Google Client ID:", env.GOOGLE_CLIENT_ID?.substring(0, 20) + "...");
} else {
  console.warn("⚠️ Google OAuth credentials not configured. Google sign-in will not be available.");
}

console.log(`📋 Total providers configured: ${providers.length}`);

if (providers.length === 0) {
  console.error("❌ No OAuth providers configured! Check your environment variables.");
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: DrizzleAdapter(db),
  providers,
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
  debug: process.env.NODE_ENV === "development",
})