--//scripts/001_create_products_table.sql
-- Create products table
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price decimal(10, 2) not null,
  description text not null,
  stock integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create product_images table for multiple images per product
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  display_order integer not null default 0,
  created_at timestamp with time zone default now()
);

-- Create index for faster queries
create index if not exists idx_product_images_product_id on public.product_images(product_id);
create index if not exists idx_products_category on public.products(category);

-- Enable Row Level Security
alter table public.products enable row level security;
alter table public.product_images enable row level security;

-- Create policies for public read access
create policy "Allow public read access to products"
  on public.products for select
  using (true);

create policy "Allow public read access to product images"
  on public.product_images for select
  using (true);

-- Create policies for authenticated users (admin) to manage products
create policy "Allow authenticated users to insert products"
  on public.products for insert
  with check (true);

create policy "Allow authenticated users to update products"
  on public.products for update
  using (true);

create policy "Allow authenticated users to delete products"
  on public.products for delete
  using (true);

-- Create policies for authenticated users (admin) to manage product images
create policy "Allow authenticated users to insert product images"
  on public.product_images for insert
  with check (true);

create policy "Allow authenticated users to update product images"
  on public.product_images for update
  using (true);

create policy "Allow authenticated users to delete product images"
  on public.product_images for delete
  using (true);
