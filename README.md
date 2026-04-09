# KSO Chandigarh Portal

Single-stream CMS + portal for the Kuki Students Organisation (Chandigarh). Built on **Next.js 15 App Router** with a Prisma schema ready for Supabase/PostgreSQL and Razorpay webhook stubs.

## Stack
- Next.js 16.2 (App Router)
- TypeScript + ESLint
- Tailwind (v4) styling with custom teal/gold theme
- Prisma schema (Supabase/PostgreSQL ready)
- Mobile-first responsive design
- PWA-ready configuration

## App structure
- `app/(public)` — public landing tied to the (a) pipeline (public → members → admins)
- `app/(auth)` — login, registration, OTP screens (phone-first + JWT-ready)
- `app/(member)` — protected member workspace (dashboard, events, profile, payments, notifications, gallery)
- `app/(admin)` — admin console (dashboard, users, content, events, analytics, approvals, payments)
- `app/api/trpc` — placeholder for tRPC entrypoint
- `app/api/webhooks/razorpay` — webhook stub for Razorpay signature handling
- `components/` — shared layout, UI primitives, and form mocks
- `server/services` — service boundaries to connect Prisma/ORM later
- `server/middleware` — RBAC helpers
- `prisma/schema.prisma` — full schema matching the provided requirements

## Setup
1) Install dependencies
```bash
npm install
```

2) Create environment file
```bash
cp .env.example .env.local
# update DATABASE_URL to your Supabase/PostgreSQL connection string
```

3) Run the dev server
```bash
npm run dev
```
Visit `http://localhost:3000`.

## Linting
```bash
npm run lint
```

## Auth & session (dev-friendly)
- `lib/auth.ts` reads a base64url JSON token from the `Authorization: Bearer <token>` header or `kso-session` cookie with shape `{ "userId": "user-1", "role": "MEMBER" }`.
- Services fall back to mock data if Prisma is unreachable, so pages still render without a live database.

## Database Setup

### Local Development
```bash
# Set your database URL
export DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ksochd"

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with initial data
npm run db:seed
```

### Production Deployment (Supabase)

See detailed guide: [`docs/DATABASE_SEEDING.md`](docs/DATABASE_SEEDING.md)

**Quick setup:**
```bash
# Run migrations and seed database
npm run db:setup
```

**Demo Users Created:**
- Admin: `admin@ksochd.org` (phone: +91-9999999999)
- Moderator: `moderator@ksochd.org` (phone: +91-9876543211)
- Member: `member@ksochd.org` (phone: +91-9876543210)

### Available Database Commands
- `npm run db:generate` — Generate Prisma client
- `npm run db:push` — Push schema changes to database
- `npm run db:migrate` — Run migrations (production)
- `npm run db:seed` — Seed database with initial data
- `npm run db:setup` — Run migrations + seed (one command for deployment)
- `npm run db:studio` — Open Prisma Studio

## Next steps
- Swap `lib/auth.ts` with Supabase/NextAuth JWT + OTP verification.
- Connect `server/services/*` to Prisma client and tRPC routers.
- Implement Razorpay signature validation in `app/api/webhooks/razorpay/route.ts`.
- Replace mock UI data with live queries and add loading/error states.

## Mobile & PWA

This portal is mobile-ready with responsive design and PWA capabilities:

### Current Mobile Features
- ✅ Viewport and mobile meta tags configured
- ✅ Responsive layouts (mobile, tablet, desktop)
- ✅ Touch-optimized navigation with mobile sidebar
- ✅ Mobile-specific CSS optimizations
- ✅ PWA manifest.json configured
- ✅ Theme colors and app metadata

### To Complete PWA Setup
1. Create icon assets (see `docs/PWA_ICONS.md`)
2. Install and configure next-pwa package
3. Test "Add to Home Screen" functionality
4. For Android APK, see `docs/ANDROID_DEPLOYMENT.md`

### Testing
See `docs/MOBILE_TESTING.md` for comprehensive mobile testing checklist.

### Documentation
- `docs/PWA_ICONS.md` - Guide for creating PWA icons
- `docs/ANDROID_DEPLOYMENT.md` - Complete Android APK deployment guide
- `docs/MOBILE_TESTING.md` - Mobile testing checklist and procedures
- `docs/DATABASE_SEEDING.md` - Database seeding and deployment guide

