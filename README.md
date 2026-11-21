# WedPlan - Wedding Planning Platform

WedPlan is a role-based wedding planning platform. Customers discover wedding services and request bookings, vendors publish services and manage requests (with a Premium subscription for unlimited listings), and admins moderate users, services and transactions.

## Live Website

- Live site: https://wedplan-client-wine.vercel.app/

## Repositories

- Client: https://github.com/najmuntushi-hue/wedplan-client
- Server: https://github.com/najmuntushi-hue/wedplan-server

## Important Features

**Customer**
- Browse, search, filter (category, location) and sort (price asc/desc) services
- View service details and submit booking requests
- Track and cancel pending bookings
- Customer dashboard with booking stats

**Vendor**
- Add, update, delete services (images uploaded via ImgBB)
- Manage availability and see approval status
- Accept or reject booking requests (pending only)
- Free plan: max 3 active services; Premium: unlimited
- Upgrade to Premium with Stripe Checkout (activated only by verified webhook)

**Admin**
- Manage users (search, role filter, block/unblock)
- Approve, reject and delete services
- View platform transactions (read-only)

**Platform**
- Better Auth (email/password + Google)
- JWT verification and server-side role checks on all protected APIs
- Responsive UI with Framer Motion (Motion) animations, toast notifications, loading/empty/error states

## Technology Stack

Next.js (App Router), TypeScript, Tailwind CSS, ShadCN UI, Motion, Better Auth, MongoDB, Express.js, Stripe Checkout, ImgBB, Zod

## Installation

```bash
git clone https://github.com/najmuntushi-hue/wedplan-client.git
cd wedplan-client
npm install
```

## Run Locally

1. Copy `.env.example` to `.env.local` and fill in the values.
2. Start the server project first (see the server README).
3. Run:

```bash
npm run dev
```

The app runs at http://localhost:3000.

## Environment Variables

Create `.env.local` (never commit it):

```env
MONGODB_URI=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_API_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

## Required Application URLs

| Purpose | Local | Production |
|---|---|---|
| Client | http://localhost:3000 | https://wedplan-client-wine.vercel.app |
| Server API | http://localhost:5000 | https://wedplan-server-4cye.onrender.com |
| Google redirect URI | http://localhost:3000/api/auth/callback/google | https://wedplan-client-wine.vercel.app/api/auth/callback/google |
## Admin Access

Admin accounts cannot be created through public sign up. Create a normal account, then promote it with the server seed script (`npm run seed:admin`).
