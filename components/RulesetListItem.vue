<script lang="ts" setup>
import FactoryRule from "./FactoryRule.vue";
import IconButton from "./IconButton.vue"
import { useTemplateRef } from "vue";

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
const dummyLetter = useTemplateRef<HTMLSpanElement | null>("dummyLetter")
const { width: letterWidth } = useElementSize(dummyLetter)

</script>

<template>
    <div class="z-10 flex items-center justify-between h-8 transition-colors duration-300 border rounded-sm fill-mode-forwards hover:cursor-pointer bg-primary-dark-800 hover:bg-primary-light-active hover:dark:bg-primary-dark-active border-primary-dark-border dark:border-primary-light-border">
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
    <span ref="dummyLetter" class="absolute z-0 font-mono text-sm text-transparent">a</span>
    <div v-if="isExpanded" class="p-1 border rounded-sm border-primary-dark-border">
      <FactoryRule
        v-for="(rule, index) in props.rules"
        :key="rule.id"
        v-bind="rule"
        :order="index"
        no-edit
      />
    </div>
</template>
