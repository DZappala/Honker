//TODO: Pages should be more generic, split existing codeblocks into more
generic components.

<script setup lang="ts">
const user = useSupabaseUser();
const router = useRouter();

//TODO: IMPORTANT: Implement error handling. Give the user feedback if something goes wrong.

router.isReady().then(() => {
  if (!user.value) {
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