//TODO: refactor [id] and index, they are almost identical
<script setup lang="ts">
import { feedType } from "~/types";
const route = useRoute();
const userId = route.params.id as string;
</script>
<template>
  <div class="flex flex-col items-center p-6">
    <ProfileCard :forUser="userId" />
    <Feed :type="feedType.PROFILE" :forUser="userId" />
  </div>
</template>
