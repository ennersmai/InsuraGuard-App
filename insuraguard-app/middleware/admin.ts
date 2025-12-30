export default defineNuxtRouteMiddleware((to, from) => {
  const user = useSupabaseUser();

  if (!user.value) {
    return navigateTo('/login');
  }

  if (user.value.user_metadata?.role !== 'admin') {
    return abortNavigation('Unauthorized - Admin access required');
  }
});
