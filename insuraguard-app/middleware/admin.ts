export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo('/login');
  }

  // Check user_metadata for admin role (Supabase maps raw_user_meta_data to user_metadata)
  const isAdmin = (user.value.user_metadata as any)?.role === 'admin';

  if (!isAdmin) {
    return abortNavigation('Unauthorized - Admin access required');
  }
});
