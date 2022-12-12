<script setup lang="ts">
//FIXME CRITICAL: If the user clicks the 'logOut' button the user gets logged out and that is fine, but if they refresh the page, they are still logged in. If a user logs out, the user state should be null and the Auth component should always be rendered.
const user = useSupabaseUser();
const activeBlock = useActiveBlock();

//TODO: IMPORTANT: Implement error handling. Give the user feedback if something goes wrong.
</script>

<template>
  <div class="container h-screen">
    <!-- 50 is the highest z-index -->
    <Navbar class="sticky top-0 z-50" />
    <div class="flex flex-col items-center">
      <Auth v-if="!user" />
      <Feed v-else-if="activeBlock == 'Feed'" />
    </div>
  </div>
</template>

<style>
/* Force the app to always center */
body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
