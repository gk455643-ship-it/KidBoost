# KidBoost 🚀

A distraction-free, gamified learning application designed for children aged 2-10. KidBoost focuses on right-brain development, memory training, and creativity through structured daily sessions.

## Features

*   **Age-Adapted UI**: Custom interfaces for Toddlers (2-3), Preschoolers (4-6), and School-age kids (7-10).
*   **Structured Sessions**: Automatically generated daily plans focusing on Memory, Speed, and Creativity.
*   **Offline First**: Built with Dexie.js for full offline capability, syncing when online.
*   **Parent Dashboard**: Analytics, safety controls, and progress reports.
*   **Safety**: Bedtime locks, usage limits, and co-play requirements for toddlers.

## Tech Stack

*   **Framework**: React 19
*   **State Management**: Zustand (with Persistence)
*   **Database**: Supabase (Cloud) + Dexie.js (Local IndexedDB)
*   **Styling**: Tailwind CSS
*   **Animation**: CSS Animations + Canvas Confetti
*   **Icons**: Lucide React

## Setup & Deployment

### 1. Environment Variables

To enable the backend, configure the following environment variables in your deployment settings (Vercel/Netlify) or `.env` file. If these are missing, the app will run in **Mock/Demo Mode**.

```bash
VITE_SUPABASE_URL=your_project_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

### 2. Supabase Setup

Run the following SQL in your Supabase SQL Editor to set up the required tables for progress tracking:

```sql
-- Table: item_progress
create table item_progress (
  "childId" text not null,
  "itemId" text not null,
  "box" int default 0,
  "ease" float default 2.5,
  "reps" int default 0,
  "dueDate" date,
  "lastReviewDate" date,
  "streak" int default 0,
  "masteryLevel" text,
  "history" jsonb default '[]',
  "updatedAt" bigint,
  primary key ("childId", "itemId")
);

-- Storage Bucket
insert into storage.buckets (id, name, public) values ('kidboost-photos', 'kidboost-photos', true);
```

### 3. Deploy to Vercel

1.  Connect your GitHub repository to Vercel.
2.  Add the Environment Variables listed above.
3.  Deploy! The build settings are standard for a Vite/React app.

## Development

The app uses `esm.sh` for dependencies to allow for a no-build environment during prototyping, but is structured to work with standard bundlers like Vite.

*   **Mock Mode**: You can test the full flow without Supabase keys. Use email `mom@example.com` and OTP `123456` to login.
*   **Parent Pin**: The default parent gate PIN is `1234`.
