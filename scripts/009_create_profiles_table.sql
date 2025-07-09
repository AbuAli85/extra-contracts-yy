<<<<<<< HEAD
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now())
=======
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  role text default 'user',
  created_at timestamp with time zone default timezone('utc'::text, now())
>>>>>>> 2ca6fc48d74debda61bb0a128c96bc1d81dbb86a
); 