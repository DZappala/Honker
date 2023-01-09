<template>
  <div class="h-screen flex flex-col overflow-x-hidden items-center mx-auto">
    <DefaultNavbar
      class="navbar bg-base-100 p-4 sticky top-0 z-50 mx-2 flex flex-row justify-between"
    />
    <div class="w-full md:w-5/12">
      <slot />
    </div>
  </div>
</template>
