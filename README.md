# JobFlow

JobFlow is a full-stack Job Tracker and Outreach CRM for managing job applications, professional connections, and outreach history in one place.

## Live Demo

https://job-flow-beta.vercel.app/

## Features

- Authentication: Email/password login with session-based authentication
- Job tracking: Track applications by company, role, status, and notes
- Connections: Store professional contacts and context
- Outreach timeline: Log outreach activity (email, LinkedIn, calls) per connection
- Dashboard: Overview of application statuses and recent outreach
- Filtering and search: Filter jobs by status and search by company

## Tech Stack

- Frontend: Next.js (App Router), React, TypeScript, Tailwind CSS
- Backend: Next.js API Routes
- Database: PostgreSQL (Neon)
- ORM: Prisma
- Authentication: Lucia Auth
- Validation: Zod
- Security: bcryptjs (password hashing)

## Local Development

### Prerequisites

- Node.js 18+

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="your-neon-postgres-connection-string"
AUTH_SECRET="your-secret-minimum-32-characters"
NODE_ENV="development"
```

### Install and Run

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
```

Open http://localhost:3000

## Deployment (Vercel + Neon)

1. Create a Neon Postgres database and copy the connection string.

2. In Vercel, set environment variables:
   - `DATABASE_URL`
   - `AUTH_SECRET`

3. Run migrations for the production database:

```bash
npx prisma migrate deploy
```
