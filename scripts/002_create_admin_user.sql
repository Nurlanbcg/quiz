-- Create admin user in Supabase
-- Note: This creates the user in the users table only
-- You need to manually create the auth user at admin@quiz.com with password admin123
-- in the Supabase dashboard under Authentication > Users

-- First, we'll insert the admin user
-- The ID should match the auth user ID that you'll create in Supabase dashboard
INSERT INTO users (id, full_name, email, phone, role, created_at)
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@quiz.com',
  '+994501234567',
  'admin',
  NOW()
)
ON CONFLICT (email) DO NOTHING;
