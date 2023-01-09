//TODO: refactor [id] and index, they are almost identical
<script setup lang="ts">
const route = useRoute();
const userId = route.params.id as string;
</script>
<template>
  <div class="flex flex-col items-center p-6">
    <ProfileCard :forUser="userId" />
    <ProfileFeed :forUser="userId" />
  </div>
</template>
