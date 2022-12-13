export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  if (to.path == "/auth") {
    return;
  }
  if (!user.value) {
    return "/auth";
  }
});
