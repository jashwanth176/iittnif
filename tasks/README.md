# Task Management Application

Built with Next.js, Firebase Authentication, and Supabase database.

Check it out at : iittnif.vercel.app

## Features

- User authentication (Email/Password and Google Sign-in)
- Create, read, update, and delete tasks
- Mark tasks as complete/incomplete
- Dark mode support
- Responsive design
- Real-time validation
- Error handling

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account
- Supabase account

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

Firebase:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Firebase Admin: 

- `FIREBASE_PROJECT_ID`
- `FIREBASE_CLIENT_EMAIL`
- `FIREBASE_PRIVATE_KEY`

Supabase:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Feel Free to use the following : 

- `NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbWhpZHpwZmNsa2xwcXpjbHBkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk1NjY0MzAsImV4cCI6MjA1NTE0MjQzMH0.c2xqqDKwHqw2zXL7pf7-WgIe_GUhODFgQZjFIlZjOGU`
- `NEXT_PUBLIC_SUPABASE_URL=https://dsmhidzpfclklpqzclpd.supabase.co`



## Installation

1. Clone the repository:

```bash
git clone add link here
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

sql 

create table tasks (
id uuid default uuid_generate_v4() primary key,
title text not null,
description text,
status text default 'pending',
user_id text not null,
created_at timestamp with time zone default timezone('utc'::text, now()),
updated_at timestamp with time zone default timezone('utc'::text, now())
);


## API Tests

The application includes comprehensive API tests using Jest. Run tests with:

```bash
npm test
```


### Test Coverage

1. GET /api/tasks
- Returns tasks sorted by creation date
- Handles database errors appropriately

2. POST /api/tasks
- Creates new tasks with validation
- Handles duplicate tasks
- Validates required fields

3. PATCH /api/tasks/[id]/complete
- Marks tasks as completed
- Handles non-existent tasks
- Handles database errors

4. PUT /api/tasks/[id]
- Updates task details
- Validates input data
- Handles non-existent tasks

Test files location:

- `src/api/tasks.test.ts`
- `src/components/TaskForm.test.tsx`
- `src/components/TaskList.test.tsx`


## Available Scripts

- `npm run dev`: Starts development server
- `npm run build`: Builds the application
- `npm start`: Starts production server
- `npm test`: Runs tests
- `npm run test:watch`: Runs tests in watch mode
- `npm run test:coverage`: Generates test coverage report