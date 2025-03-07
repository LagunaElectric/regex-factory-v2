<script lang="ts" setup>
import IconButton from "./IconButton.vue"

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
const emit = defineEmits(["itemSelected"])

const isExpanded = ref(false)

</script>

<template>
  <div class="flex items-center justify-between h-8 transition-colors duration-300 border rounded-sm fill-mode-forwards hover:cursor-pointer hover:bg-primary-light-active hover:dark:bg-primary-dark-active border-primary-dark-border dark:border-primary-light-border">
    <h3 class="pl-1 font-bold transition-colors text-primary-light-icon dark:text-primary-dark-icon fill-mode-forward">
      {{ props.title }}
    </h3>
    <div class="flex items-center h-6 gap-1 shrink-0 dark:text-primary-dark-icon">
      <IconButton
        :icon-name="isExpanded ? 'line-md:chevron-down' : 'line-md:chevron-left'"
        :tooltip="isExpanded ? 'Collapse' : 'Expand'"
        class="transition-colors duration-300 rounded-sm fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-900 hover:dark:bg-primary-dark-icon/30"
        @click="isExpanded = !isExpanded"
      />
      <IconButton
        icon-name="line-md:confirm-circle"
        tooltip="Load"
        color="green"
        class="transition-colors duration-300 rounded-sm fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-900 hover:dark:bg-primary-dark-icon/30"
        @click="() => emit('itemSelected')"
      />
    </div>
  </div>
  <div v-if="isExpanded" class="p-1">
    <div v-for="rule in props.rules" :key="rule.id" class="flex gap-1">
      <!-- I want to show the match, an arrow, and the substitution for each rule -->
      <div class="flex gap-1">
        <span class="text-primary-light-icon dark:text-primary-dark-icon">{{ rule.match }}</span>
        <span class="text-primary-light-icon dark:text-primary-dark-icon">→</span>
        <span class="text-primary-light-icon dark:text-primary-dark-icon">{{ rule.substitution }}</span>
      </div>
    </div>
  </div>
</template>
