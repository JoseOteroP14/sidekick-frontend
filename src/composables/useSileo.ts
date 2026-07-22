import { sileo } from 'vue-sileo'
import type {
  SileoButton,
  SileoOptions,
  SileoPosition,
  SileoState,
  SileoStyles
} from 'vue-sileo'

export type {
  SileoButton,
  SileoOptions,
  SileoPosition,
  SileoState,
  SileoStyles
}

/**
 * Vue-friendly access to the Sileo toast API.
 * Mount `<Toaster />` once in App.vue (already done).
 *
 * @example
 * const { success, error, promise } = useSileo()
 * success({ title: 'Saved', description: 'Changes stored.' })
 */
export function useSileo() {
  return sileo
}

export { sileo }
