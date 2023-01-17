<script setup lang="ts">
import { feedType, postActions } from "~/types";
</script>

<template>
  <div class="flex flex-col gap-6 p-4 items-center mx-4">
    <div class="indicator w-full">
      <FeedHonk :action="postActions.POST" />
    </div>
    <Feed :type="feedType.MAIN" />
  </div>
</template>
