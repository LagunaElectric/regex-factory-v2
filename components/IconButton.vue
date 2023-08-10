<script setup lang="ts">
import { VTooltip as vTooltip } from "floating-vue"
import "floating-vue/dist/style.css"

export type IconButtonProps = {
  iconName: string
  tooltip?: string
  color?: string
}

const props = defineProps<IconButtonProps>()
</script>

<template>
  <button
    v-tooltip.bottom="{
      content: props.tooltip,
      triggers: ['hover'],
      delay: { show: 500 },
      distance: 12,
      show: true,
    }"
    class="px-1 py-1 flex focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon justify-center items-center cursor-pointer"
  >
    <Icon :name="props.iconName" :color="props.color || 'currentColor'" />
  </button>
</template>
