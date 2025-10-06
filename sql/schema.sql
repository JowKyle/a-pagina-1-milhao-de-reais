-- users
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text,
  name text,
  created_at timestamptz default now()
);

-- payments
create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  mp_payment_id text,
  status text,
  amount numeric,
  currency text,
  metadata jsonb,
  created_at timestamptz default now()
);

-- pixels (armazenamos blocos vendidos)
create table if not exists pixels (
  id uuid primary key default gen_random_uuid(),
  x int,
  y int,
  width int,
  height int,
  owner_id uuid references users(id),
  image_url text,
  link_url text,
  status text,
  tx_id text,
  created_at timestamptz default now()
);
