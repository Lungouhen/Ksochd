# KSO Chandigarh Portal

Single-stream CMS + portal for the Kuki Students Organisation (Chandigarh). Built on **Next.js 15 App Router** with a Prisma schema ready for Supabase/PostgreSQL and Razorpay webhook stubs.

## Stack
- Next.js 16.2 (App Router)
- TypeScript + ESLint
- Tailwind (v4) styling with custom teal/gold theme
- Prisma schema (Supabase/PostgreSQL ready)

## App structure
- `app/(public)` — public landing tied to the (a) pipeline (public → members → admins)
- `app/(auth)` — login, registration, OTP screens (phone-first + JWT-ready)
- `app/(member)` — protected member workspace (dashboard, events, profile, payments)
- `app/(admin)` — admin console (dashboard, users, content, events, analytics)
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

## Prisma (optional, when wiring data)
```bash
npm install prisma --save-dev
npx prisma generate
npx prisma migrate dev
```

## Next steps
- Swap `lib/auth.ts` with Supabase/NextAuth JWT + OTP verification.
- Connect `server/services/*` to Prisma client and tRPC routers.
- Implement Razorpay signature validation in `app/api/webhooks/razorpay/route.ts`.
- Replace mock UI data with live queries and add loading/error states.
