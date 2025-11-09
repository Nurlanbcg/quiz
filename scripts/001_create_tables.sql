-- Create users table (extends auth.users)
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  phone text not null,
  role text not null default 'student',
  created_at timestamp with time zone default now()
);

alter table public.users enable row level security;

-- Drop existing policies if they exist before recreating them
drop policy if exists "users_select_own" on public.users;
drop policy if exists "users_update_own" on public.users;
drop policy if exists "users_insert_own" on public.users;
drop policy if exists "quizzes_select_all" on public.quizzes;
drop policy if exists "quizzes_insert_admin" on public.quizzes;
drop policy if exists "quizzes_update_admin" on public.quizzes;
drop policy if exists "quizzes_delete_admin" on public.quizzes;
drop policy if exists "purchases_select_own" on public.purchases;
drop policy if exists "purchases_insert_own" on public.purchases;
drop policy if exists "purchases_select_admin" on public.purchases;
drop policy if exists "quiz_results_select_own" on public.quiz_results;
drop policy if exists "quiz_results_insert_own" on public.quiz_results;
drop policy if exists "quiz_results_select_admin" on public.quiz_results;

-- Users can view their own data
create policy "users_select_own"
  on public.users for select
  using (auth.uid() = id);

-- Users can update their own data
create policy "users_update_own"
  on public.users for update
  using (auth.uid() = id);

-- Allow users to insert their own data during signup
create policy "users_insert_own"
  on public.users for insert
  with check (auth.uid() = id);

-- Create quizzes table
create table if not exists public.quizzes (
  id text primary key,
  title text not null,
  description text,
  questions jsonb not null,
  duration integer not null,
  price numeric not null,
  is_active boolean default true,
  created_by uuid references public.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);

alter table public.quizzes enable row level security;

-- Everyone can view active quizzes
create policy "quizzes_select_all"
  on public.quizzes for select
  to authenticated
  using (true);

-- Only admins can create quizzes
create policy "quizzes_insert_admin"
  on public.quizzes for insert
  to authenticated
  with check (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Only admins can update quizzes
create policy "quizzes_update_admin"
  on public.quizzes for update
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Only admins can delete quizzes
create policy "quizzes_delete_admin"
  on public.quizzes for delete
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Create purchases table
create table if not exists public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  quiz_id text references public.quizzes(id) on delete cascade,
  purchased_at timestamp with time zone default now(),
  unique(user_id, quiz_id)
);

alter table public.purchases enable row level security;

-- Users can view their own purchases
create policy "purchases_select_own"
  on public.purchases for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can create their own purchases
create policy "purchases_insert_own"
  on public.purchases for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Admins can view all purchases
create policy "purchases_select_admin"
  on public.purchases for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );

-- Create quiz_results table
create table if not exists public.quiz_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  quiz_id text references public.quizzes(id) on delete cascade,
  student_name text not null,
  student_email text not null,
  score integer not null,
  total_questions integer not null,
  answers jsonb not null,
  submitted_at timestamp with time zone default now()
);

alter table public.quiz_results enable row level security;

-- Users can view their own results
create policy "quiz_results_select_own"
  on public.quiz_results for select
  to authenticated
  using (auth.uid() = user_id);

-- Users can insert their own results
create policy "quiz_results_insert_own"
  on public.quiz_results for insert
  to authenticated
  with check (auth.uid() = user_id);

-- Admins can view all results
create policy "quiz_results_select_admin"
  on public.quiz_results for select
  to authenticated
  using (
    exists (
      select 1 from public.users
      where users.id = auth.uid() and users.role = 'admin'
    )
  );
