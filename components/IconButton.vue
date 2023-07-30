<script setup lang="ts">
export type IconButtonProps = {
  name: string
  color?: string
}

const props = defineProps<IconButtonProps>()
</script>

<template>
  <button
    class="px-1 py-1 flex focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon justify-center items-center cursor-pointer"
  >
    <Icon :name="props.name" :color="props.color || 'currentColor'" />
  </button>
</template>
