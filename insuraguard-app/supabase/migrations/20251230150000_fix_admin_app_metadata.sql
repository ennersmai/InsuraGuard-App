-- Fix admin role by setting raw_app_meta_data for the user ennersmai@gmail.com
UPDATE auth.users 
SET raw_app_meta_data = raw_app_meta_data || '{"role": "admin"}'
WHERE email = 'ennersmai@gmail.com';
