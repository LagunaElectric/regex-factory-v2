<script lang="ts" setup>
const props = defineProps<{
    id: string;
    title: string;
    rules: {
        id: string;
        order: number;
        match: string;
        substitution: string;
        isRegEx: boolean;
        isCaseSensitive: boolean;
        isWholeWord: boolean;
        isReplaceAll: boolean;
    }[]
  }>()
</script>

<template>
  <div>
    <h3 class="text-primary-light-icon dark:text-primary-dark-icon font-bold transition-colors duration-300 fill-mode-forward">
      {{ props.title }}
    </h3>
  </div>
</template>
