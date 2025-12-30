export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo('/login');
  }

  // Check multiple possible metadata fields where admin role could be stored
  const isAdmin = 
    (user.value.user_metadata as any)?.role === 'admin' ||
    (user.value.app_metadata as any)?.role === 'admin';

  if (!isAdmin) {
    return abortNavigation('Unauthorized - Admin access required');
  }
});
