<script setup lang="ts">
interface ModalProps {
  title: string
  message: string
  onSubmit: () => void
  onClose: () => void
}

const props = defineProps<ModalProps>()

function onConfirm() {
  props.onSubmit()
  props.onClose()
}
</script>

<template>
  <div class="flex flex-col p-5 text-lg font-bold bg-primary-light-900 dark:bg-primary-dark-800">
    <h1 class="text-xl">
      {{ props.title }}
    </h1>
    <p>{{ props.message }}</p>
    <button
      class="px-4 py-2 mt-4 text-white bg-primary-light-500 rounded-md hover:bg-primary-light-600 dark:bg-primary-dark-500 dark:hover:bg-primary-dark-600"
      @click="onConfirm"
    >
      Test
    </button>
  </div>
</template>
