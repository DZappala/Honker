<script setup lang="ts">
const props = defineProps<{
  tooltipMessage: string;
  isShown?: boolean;
}>();
</script>
<template>
  <div
    :class="{ 'tooltip tooltip-open tooltip-bottom': isShown }"
    :data-tip="tooltipMessage"
  >
    <slot />
  </div>
</template>
