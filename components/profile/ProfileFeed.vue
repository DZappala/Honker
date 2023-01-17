<script setup lang="ts">
import { feedType } from "~/types";
</script>

<template>
  <div class="flex flex-col gap-6 p-4 items-center">
    <Feed :type="feedType.PROFILE" />
  </div>
</template>
