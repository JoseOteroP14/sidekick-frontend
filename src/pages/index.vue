<script setup lang="ts">
import { onMounted, ref, shallowRef } from 'vue'
import { sub } from 'date-fns'
import type { DropdownMenuItem } from '@nuxt/ui'
import { useDashboard } from '../composables/useDashboard'
import { useSileo } from '../composables/useSileo'
import type { SileoOptions } from '../composables/useSileo'
import type { Period, Range } from '../types'

type SileoToastOptions = SileoOptions & { id?: string }

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
const dashboardToastId = 'home-dashboard-load'

const successStyles = {
  title: 'text-[#38ba2f]!',
  badge: 'text-[#38ba2f]! bg-[#38ba2f]/15!',
  button: 'text-[#38ba2f]! bg-[#38ba2f]/15! hover:bg-[#38ba2f]/25!'
}

onMounted(() => {
  sileo.promise(
    new Promise<{ ready: boolean }>((resolve) => {
      setTimeout(() => resolve({ ready: true }), 3800)
    }),
    {
      position: 'top-center',
      loading: {
        id: dashboardToastId,
        title: 'Loading dashboard…'
      } satisfies SileoToastOptions as SileoOptions,
      success: (data) => ({
        title: 'Dashboard ready',
        description: data.ready ? '' : 'Loaded.',
        button: {
          title: 'Refresh',
          onClick: () => {
            sileo.success({
              id: dashboardToastId,
              title: 'Dashboard refreshed',
              styles: {
                title: successStyles.title,
                badge: successStyles.badge
              }
            } satisfies SileoToastOptions as SileoOptions)
          }
        },
        styles: successStyles
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
