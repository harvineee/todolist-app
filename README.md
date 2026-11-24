# To-do

A small internal to-do list: one shared list, no sign-in.

- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database:** Supabase, table `public.todos`
- **Hosting:** Vercel, deploys automatically on every push to `main`

## Run locally

```bash
cp .env.example .env.local   # then fill in SUPABASE_PUBLISHABLE_KEY
npm install
npm run dev
```

The Supabase key is read only on the server (Server Components and Server Actions), so it never reaches the browser.

## Database

```sql
create table public.todos (
  id bigint generated always as identity primary key,
  title text not null check (char_length(title) between 1 and 500),
  done boolean not null default false,
  created_at timestamptz not null default now()
);
```

Row Level Security is on, with policies that let the `anon` role read and change rows, since the app has no sign-in.
