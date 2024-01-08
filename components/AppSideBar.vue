<script lang="ts" setup>

const emit = defineEmits(["close"])

</script>

<template>
  <aside class="absolute top-0 left-0 h-full bg-primary-light-900 dark:bg-primary-dark-800 shadow-md transition-colors duration-300 fill-mode-forward">
    <IconButton class="absolute top-0 right-0" icon-name="ci:close-big" @click="() => emit('close')" />
    <slot />
  </aside>
</template>
