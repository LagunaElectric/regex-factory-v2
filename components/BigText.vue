<script setup lang="ts">
import { computed } from "vue"

export type BigTextProps = {
  label?: string
  modelValue?: string
  readonly?: boolean
}

const props = defineProps<BigTextProps>()
const emit = defineEmits(["update:modelValue"])

const value = computed({
  get() {
    return props.modelValue ?? ""
  },
  set(value) {
    emit("update:modelValue", value)
  },
})
</script>

<template>
  <div class="flex flex-col transition-colors duration-300 fill-mode-forward">
    <label
      v-if="props.label"
      for="textInput"
      class="text-primary-light-icon dark:text-primary-dark-icon transition-colors duration-300 fill-mode-forward"
    >
      {{ props.label }}
    </label>
    <textarea
      id="textInput"
      v-model="value"
      class="resize-none min-w-32 focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon w-full h-full transition-colors duration-300 fill-mode-forward text-primary-light-icon bg-primary-light-700 dark:bg-primary-dark-700 dark:text-primary-dark-icon border-primary-light-border dark:border-primary-dark-border border tracking-wide rounded-sm p-2"
      name="input"
      cols="30"
      rows="10"
      autocomplete="off"
      spellcheck="false"
      :readonly="props.readonly"
    />
  </div>
</template>
