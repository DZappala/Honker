<script setup lang="ts">
const props = defineProps<{
  tooltipMessage: string;
  isShown?: boolean;
  type?: "success" | "error" | "warning" | "info";
  direction?: "top" | "bottom" | "left" | "right";
}>();
</script>
<template>
  <div
    class="tooltip"
    :class="{
      'tooltip-open': isShown,
      'tooltip-success': type == 'success',
      'tooltip-error': type == 'error',
      'tooltip-warning': type == 'warning',
      'tooltip-info': type == 'info',
      'tooltip-top': direction == 'top',
      'tooltip-bottom': direction == 'bottom',
      'tooltip-left': direction == 'left',
      'tooltip-right': direction == 'right',
    }"
    :data-tip="tooltipMessage"
  >
    <slot />
  </div>
</template>