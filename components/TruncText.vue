<script lang="ts" setup>
import { VTooltip as vTooltip } from "floating-vue"
import "floating-vue/dist/style.css"

export type TruncTextProps = {
  text: string
  letterWidth: number
}

const props = defineProps<TruncTextProps>()

const spanRef = ref<HTMLSpanElement | null>(null)
const { width: spanWidth } = useElementSize(spanRef)
const spanWidthInChars = computed(() => {
  if (!props.letterWidth) { return 0 }
  return Math.floor(spanWidth.value / props.letterWidth)
})
const isOverflown = computed(() => spanWidthInChars.value < props.text.length)
const truncated = computed(() => {
  if (isOverflown.value) { return props.text.slice(0, spanWidthInChars.value - 3).trim() + "..." }
  return props.text
})

</script>

<template>
  <div
    ref="spanRef"
    v-tooltip.top-start="{
      content: props.text,
      triggers: isOverflown ? ['hover'] : [],
      delay: { show: 500, hide: 0 },
      distance: 12,
    }"
  >
    <span class="cursor-text">{{ truncated }}</span>
  </div>
</template>
