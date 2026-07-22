<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import { useDashboard } from '../composables/useDashboard'
import { useSileo } from '../composables/useSileo'
import type { Period, Range } from '../types'

const { isNotificationsSlideoverOpen } = useDashboard()
const sileo = useSileo()

const items = [[{
  label: 'New mail',
  icon: 'i-lucide-send',
  to: '/orders'
}, {
  label: 'New customer',
  icon: 'i-lucide-user-plus',
  to: '/customers'
}]] satisfies DropdownMenuItem[][]

const range = shallowRef<Range>({
  start: sub(new Date(), { days: 14 }),
  end: new Date()
})
const period = ref<Period>('daily')

onMounted(() => {
  sileo.promise(
    new Promise<{ ready: boolean }>((resolve) => {
      setTimeout(() => resolve({ ready: true }), 1800)
    }),
    {
      position: 'top-center',
      loading: {
        title: 'Loading dashboard…',
        description: 'Fetching your latest metrics.'
      },
      success: (data) => ({
        title: 'Dashboard ready',
        description: data.ready ? 'Your data is up to date.' : 'Loaded.'
      }),
      error: {
        title: 'Failed to load',
        description: 'Could not refresh dashboard data.'
      }
    }
  )
})
</script>

<template>
  <UDashboardPanel id="home">
    <template #header>
      <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
        <template #right>
          <UTooltip text="Notifications" :shortcuts="['N']">
            <UButton
              color="neutral"
              variant="ghost"
              square
              @click="isNotificationsSlideoverOpen = true"
            >
              <UChip color="error" inset>
                <UIcon name="i-lucide-bell" class="size-5 shrink-0" />
              </UChip>
            </UButton>
          </UTooltip>

          <UDropdownMenu :items="items">
            <UButton icon="i-lucide-plus" size="md" class="rounded-full" />
          </UDropdownMenu>
        </template>
      </UDashboardNavbar>

      <UDashboardToolbar>
        <template #left>
          <HomeDateRangePicker v-model="range" class="-ms-1" />

          <HomePeriodSelect v-model="period" :range="range" />
        </template>
      </UDashboardToolbar>
    </template>

    <template #body>
      <HomeStats :period="period" :range="range" />
      <HomeChart :period="period" :range="range" />
      <HomeSales :period="period" :range="range" />
    </template>
  </UDashboardPanel>
</template>
