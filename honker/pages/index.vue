<script setup lang="ts">
//FIXME CRITICAL: If the user clicks the 'logOut' button the user gets logged out and that is fine, but if they refresh the page, they are still logged in. If a user logs out, the user state should be null and the Auth component should always be rendered.
const user = useSupabaseUser();
const router = useRouter();

//TODO: IMPORTANT: Implement error handling. Give the user feedback if something goes wrong.

router.isReady().then(() => {
  if (user.value == null) {
    router.push("/auth");
  } else {
    router.push("/feed");
  }
});
</script>

<template>
  <NuxtLayout>
    <slot />
  </NuxtLayout>
</template>
