<template lang="pug">
div
  nav
    div(class='flex border-2 py-4')
      div(class="w-24 text-center font-bold ")
        NuxtLink(to="/") Home
  main(class='relative flex-1 h-svh bg-gray-200')
    NuxtPage
</template>