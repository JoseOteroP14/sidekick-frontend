<script setup lang="ts">
import { computed } from 'vue'
import { useHead } from '@unhead/vue'
import { useColorMode } from '@vueuse/core'
import { Toaster } from 'vue-sileo'
import type { SileoOptions } from 'vue-sileo'

const colorMode = useColorMode()
const themeColor = computed(() => colorMode.value === 'dark' ? '#18181b' : '#ffffff')
const sileoTheme = computed(() => {
  if (colorMode.value === 'dark') return 'dark'
  if (colorMode.value === 'light') return 'light'
  return 'system'
})

const sileoOptions = computed<Partial<SileoOptions>>(() => {
  if (colorMode.value === 'dark') {
    // Dark page: white toast with dark text
    return {
      closable: false,
      fill: '#FFFFFF',
      styles: {
        title: 'text-zinc-900!',
        description: 'text-zinc-600!',
        badge: 'bg-zinc-900/5!',
        button: 'bg-zinc-900/5! hover:bg-zinc-900/10!'
      }
    }
  }

  // Light page: black toast with light text
  return {
    closable: false,
    fill: '#171717',
    styles: {
      title: 'text-white!',
      description: 'text-white/75!',
      badge: 'bg-white/10!',
      button: 'bg-white/10! hover:bg-white/15!'
    }
  }
})

useHead({
  meta: [
    { name: 'theme-color', content: themeColor }
  ]
})
</script>

<template>
  <Suspense>
    <UApp>
      <Toaster
        :theme="sileoTheme"
        position="top-right"
        :offset="16"
        :options="sileoOptions"
      />
      <RouterView />
    </UApp>
  </Suspense>
</template>
