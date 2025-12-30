export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useSupabaseUser();
  
  // Wait for user to be loaded
  if (process.client) {
    // On client side, wait a bit for session to load
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  if (!user.value) {
    return navigateTo('/login');
  }

  // Check user_metadata for admin role (Supabase maps raw_user_meta_data to user_metadata)
  const isAdmin = (user.value.user_metadata as any)?.role === 'admin';

  if (!isAdmin) {
    return navigateTo('/dashboard');
  }
});
