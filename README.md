# JobFlow - Job Tracker & Outreach CRM

JobFlow is a full-stack application for tracking job applications and managing professional connections. Built with Next.js, TypeScript, Prisma, and PostgreSQL.

## Features

- **Authentication**: Secure email/password authentication with session management
- **Job Tracking**: Track job applications with status, company, role, and notes
- **Connections Management**: Manage professional connections with contact information
- **Outreach Timeline**: Track all outreach activities (emails, LinkedIn, calls) per connection
- **Dashboard**: Overview of job application statuses and recent outreach activities
- **Filtering & Search**: Filter jobs by status and search by company name

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (via Docker)
- **ORM**: Prisma
- **Authentication**: Lucia Auth
- **Password Hashing**: bcryptjs

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd JobFlow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env` (if not already present):

```bash
cp .env.example .env
```

The `.env` file should contain:

```env
DATABASE_URL="postgresql://jobflow:jobflow_dev_password@localhost:5432/jobflow?schema=public"
AUTH_SECRET="dev-secret-key-change-in-production-minimum-32-characters-long"
NODE_ENV="development"
```

### 4. Start the database

```bash
npm run db:up
```

This will start PostgreSQL and pgAdmin in Docker containers.

### 5. Run Prisma migrations

```bash
npm run prisma:generate
npm run prisma:migrate
```

This will generate the Prisma client and create the database schema.

### 6. (Optional) Seed the database

```bash
npm run seed
```

This will create a demo user (email: `demo@jobflow.com`, password: `demo123`) with sample data.

### 7. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start the Next.js development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run db:up` - Start Docker containers (PostgreSQL + pgAdmin)
- `npm run db:down` - Stop Docker containers
- `npm run seed` - Seed the database with demo data

## Database Access

- **PostgreSQL**: `localhost:5432`
  - Username: `jobflow`
  - Password: `jobflow_dev_password`
  - Database: `jobflow`

- **pgAdmin**: [http://localhost:5050](http://localhost:5050)
  - Email: `admin@jobflow.local`
  - Password: `admin`

## Project Structure

```
JobFlow/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── jobs/          # Job CRUD endpoints
│   │   ├── connections/   # Connection CRUD endpoints
│   │   └── outreach/      # Outreach entry endpoints
│   ├── jobs/              # Jobs pages
│   ├── connections/       # Connections pages
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── page.tsx           # Dashboard (home)
├── components/            # React components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication helpers
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/                # Prisma schema and migrations
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── public/               # Static assets
```

## Data Model

### User
- Email/password authentication
- Owns all job applications, connections, and outreach entries

### JobApplication
- Company, role, status (WISHLIST, APPLIED, SCREEN, INTERVIEW, OFFER, REJECTED)
- Optional: URL, location, salary range, notes, applied date

### Connection
- Name, company, title, email, LinkedIn URL, notes
- Can have multiple outreach entries

### OutreachEntry
- Type: EMAIL, LINKEDIN, CALL, OTHER
- Timestamp and notes
- Linked to a connection

## Security Features

- Password hashing with bcryptjs
- Session-based authentication with secure cookies
- User-scoped data access (users can only access their own data)
- HTTP-only, Secure (in production), SameSite=Lax cookies
- Input validation with Zod
- Proper HTTP status codes

## Development Notes

- All API routes validate user authentication
- All data operations verify user ownership
- Empty states are provided for better UX
- Error handling with proper user feedback
- Loading states for async operations

## Production Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy

### Database (Render)
1. Create a PostgreSQL database on Render
2. Update `DATABASE_URL` in Vercel environment variables
3. Run migrations: `npx prisma migrate deploy`
4. Update `AUTH_SECRET` to a secure random string (min 32 chars)

## License

MIT

