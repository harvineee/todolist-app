# To-do

A small internal to-do list: one shared list, no sign-in.

- **Framework:** Next.js 16 (App Router, Server Actions)
- **Database:** Supabase, table `public.todos`
- **Hosting:** Vercel project `todolist-app` (team OCTOBEES)

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

alter table public.todos enable row level security;
create policy "anon can read todos" on public.todos for select to anon using (true);
create policy "anon can add todos" on public.todos for insert to anon with check (true);
create policy "anon can update todos" on public.todos for update to anon using (true) with check (true);
create policy "anon can delete todos" on public.todos for delete to anon using (true);

grant select, insert, update, delete on table public.todos to anon;
grant usage, select on sequence public.todos_id_seq to anon;
```

Row Level Security is on, with policies that let the `anon` role read and change rows, since the app has no sign-in.
