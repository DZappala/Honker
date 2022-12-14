export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser();
  if (to.path == "/auth") {
    if (user.value) {
      return navigateTo("/feed"); //this is duplicated on the auth page [auth.vue]
    }
    return;
  } else if (!user.value) {
    return navigateTo("/auth");
  }
});
