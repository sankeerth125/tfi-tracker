# TFI Tracker

A full-stack web application for tracking Tollywood Film Industry (TFI) movie box office data, collections, and analytics. Built with modern web technologies for real-time data management and visualization.

## Features

- **Movie Database**: Track movies, actors, and box office collections
- **Real-time Analytics**: Monitor daily collections, trends, and verdicts
- **User Management**: Authentication with user roles (admin/user) and Pro subscriptions
- **Admin Dashboard**: Manage movies, collections, and regional data
- **Responsive UI**: Modern React-based interface with Tailwind CSS
- **API-Driven**: RESTful API with TypeScript and validation

## Tech Stack

### Backend

- **Node.js** with **Express.js**
- **TypeScript** for type safety
- **Drizzle ORM** with **PostgreSQL**
- **Passport.js** for authentication
- **Zod** for schema validation
- **Session management** with express-session

### Frontend

- **React** with **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** components
- **TanStack Query** for data fetching
- **React Router** for navigation

### Database

- **PostgreSQL** with Drizzle migrations
- Tables: users, movies, actors, collections, regional_collections

## Prerequisites

- Node.js 18+ (recommended: 18.20.8 or later)
- Docker (for local PostgreSQL)
- npm or yarn

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tfi-tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

#### Option A: Using Docker (Recommended for Local Development)

```bash
# Start PostgreSQL container
docker run --name tfi-postgres \
  -e POSTGRES_PASSWORD=mysecretpassword \
  -e POSTGRES_DB=tfi_tracker \
  -p 5432:5432 \
  -d postgres:15

# Update .env file
echo "DATABASE_URL=postgresql://postgres:mysecretpassword@localhost:5432/tfi_tracker" > .env
```

#### Option B: Local PostgreSQL Installation

Install PostgreSQL locally and create a database named `tfi_tracker`.

Update `.env`:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/tfi_tracker
```

### 4. Run Database Migrations

```bash
npm run db:push
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173 (Vite dev server)
- Backend API: http://localhost:5000

### 6. Build for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Project Structure

```
tfi-tracker/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utilities and configurations
├── server/                 # Backend Express server
│   ├── index.ts            # Server entry point
│   ├── routes.ts           # API routes
│   ├── db.ts               # Database connection
│   └── storage.ts          # Data access layer
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Database schemas and types
├── script/                 # Build and utility scripts
├── dist/                   # Built application (generated)
└── package.json            # Dependencies and scripts
```

## API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Movies

- `GET /api/movies` - List all movies
- `GET /api/movies/:id` - Get movie details
- `GET /api/movies/:id/collections` - Get movie collections
- `GET /api/movies/:id/regional` - Get regional collections

### Actors

- `GET /api/actors` - List all actors
- `GET /api/actors/:id` - Get actor details

### Admin (Requires admin role)

- `POST /api/admin/movies` - Create new movie
- `POST /api/admin/collections` - Add collection data

### Subscription

- `POST /api/subscription/upgrade` - Upgrade to Pro

## Environment Variables

Create a `.env` file in the root directory:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/tfi_tracker
NODE_ENV=development  # or production
PORT=5000             # Optional, defaults to 5000
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run check` - Run TypeScript checks
- `npm run db:push` - Push database schema changes

### Code Quality

- TypeScript for type checking
- ESLint for code linting (if configured)
- Prettier for code formatting (if configured)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.</content>
<parameter name="filePath">/Users/sankeerthpatnaikuni/Documents/Coding/Self-Projects/tfi-tracker/README.md
