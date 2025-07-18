# Vidiwise

Transform any video into intelligent knowledge with AI-powered summaries, interactive transcripts, and intelligent chat assistance. A free platform that turns YouTube videos into smart knowledge bases.

## Features

- **Instant Transcripts**: Get accurate, timestamped transcripts for any YouTube video in seconds
- **AI-Powered Summaries**: Understand key points instantly with intelligent video summarization  
- **Chat with Videos**: Ask questions and get insights from video content using AI chat
- **Free to Use**: All features available at no cost, no payment required
- **Custom Domains**: Create your own video knowledge hub with custom domain support

## TODOS
- [x] Initialize project (w/ t3-stack)
- [x] Upload to github (w/ github)
- [x] Deploy to vercel (w/ vercel)
- [x] Building Mockup UI
  - [x] Create Landing Page
  - [x] Creator Page (for users to see all creator videos)
  - [x] Video Landing Page (for users to see a specific video)
  - [ ] Make the page editable (for creators to edit the video transcript and resources)
- [x] Initialize database
- [x] Add authentication (w/ next-auth)
- [x] Chatbot functionality
- [x] Remove pricing and subscription features - now completely free
- [ ] Multitenancy (Feature for creators)
  - [ ] DB schema profile (new/ table)
  - [ ] Vercel Domain Configuration
    - [ ] Add server actions for vercel domain add
    - [ ] Domain remove
    - [ ] Domain update
  - [ ] Middleware Redirection
    - [x] Initial redirection (without validation of domain) 
    - [ ] Validating custom domains w/ users 
  - [ ] Custom page for custom domains
    - [x] Home page
    - [ ] Creator Page
    - [ ] Vid page

## Getting Started (DEV)

If you don't have pnpm installed, run `npm install -g pnpm`

1. Clone the repo
2. Run `pnpm install`
3. Create a `.env` file in the root directory and add the following variables:
```
DATABASE_URL=<your database url>
NEXTAUTH_SECRET=<your secret>
NEXTAUTH_URL=<your app url>
SUPABASE_URL=<your supabase url>
SUPABASE_ANON_KEY=<your supabase anon key>
GEMINI_API_KEY=<your gemini api key>
```
4. Run `pnpm dev`
5. Open `http://localhost:3000` in your browser

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: NextAuth.js with Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **Deployment**: Vercel

