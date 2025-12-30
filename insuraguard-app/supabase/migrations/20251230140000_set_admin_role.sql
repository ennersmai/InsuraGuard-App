-- Set admin role for the user ennersmai@gmail.com
UPDATE auth.users 
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}',
    app_metadata = app_metadata || '{"role": "admin"}'
WHERE email = 'ennersmai@gmail.com';
