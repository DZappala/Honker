//TODO: refactor [id] and index, they are almost identical
<script setup lang="ts">
const user = useSupabaseUser();
</script>
<template>
  <div class="flex flex-col items-center">
    <ProfileCard :forUser="user?.id" />
    <ProfileFeed :forUser="user?.id" />
  </div>
</template>
