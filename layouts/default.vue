<template>
  <div class="container h-screen flex flex-col items-center align-item ">
    <DefaultNavbar class="sticky top-0 z-50" />
    <slot />
  </div>
</template>

<style>
/* Force the app to always center */
body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
