<script setup lang="ts">
import { feedType } from "~/types";

const route = useRoute();
const postId = route.params.id as string;
const loading = ref<boolean>(false);
</script>
<template>
  <div>
    <Feed :type="feedType.POST" :postId="postId" />
  </div>
</template>
