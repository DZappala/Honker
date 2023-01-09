<script setup lang="ts">
const props = defineProps<{
  of: string;
}>();
</script>
<template>
  <img :src="props.of" />
</template>
