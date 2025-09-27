# Vidiwise

Transform any YouTube video into smart knowledge with AI-powered summaries, interactive transcripts, and intelligent chat.

## Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database

### Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in your environment variables:
   - `DATABASE_URL` - PostgreSQL connection string
   - `GEMINI_API_KEY` - Google Gemini API key for AI features
   - `STRIPE_SECRET_KEY` - Stripe secret key for payments
   - Other required variables as needed

### Installation
```bash
pnpm install
```

### Database Setup
```bash
# Generate database migrations
pnpm db:generate

# Push schema to database
pnpm db:push

# Open database studio (optional)
pnpm db:studio
```

## Running the Application

### Development
```bash
pnpm dev
```
Opens [http://localhost:3000](http://localhost:3000)

### Production
```bash
pnpm build && pnpm start
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm db:generate` - Generate database migrations
- `pnpm db:push` - Push schema changes to database
- `pnpm db:studio` - Open Drizzle Studio

## Features

- 🎥 **Video Processing** - Extract transcripts from YouTube videos
- 🤖 **AI Summaries** - Generate intelligent summaries using Gemini AI
- 💬 **Interactive Chat** - Chat with video content
- 📝 **Enhanced Transcripts** - Timestamped, searchable transcripts
- 💳 **Payment Integration** - Stripe integration for premium features
- 🎨 **Modern UI** - Built with Next.js, Tailwind CSS, and Framer Motion

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Drizzle ORM
- **Database**: PostgreSQL
- **AI**: Google Gemini API
- **Payments**: Stripe
- **UI Components**: Radix UI, Lucide React, Framer Motion

## Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── api/            # API routes
│   ├── generate/       # Video processing pages
│   ├── watch/          # Video viewing pages
│   └── c/              # Creator profiles
├── components/         # React components
│   ├── ui/            # Reusable UI components
│   ├── Hero/          # Landing page components
│   ├── Chat/          # Chat functionality
│   └── Transcript/    # Transcript display
├── lib/               # Utilities and helpers
│   ├── helpers/       # Business logic
│   ├── stripe/        # Payment integration
│   └── db/           # Database utilities
└── server/           # Server-side code
    └── db/           # Database schema
```

## License

Private project - All rights reserved.