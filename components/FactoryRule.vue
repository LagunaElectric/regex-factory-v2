<script setup lang="ts">
const props = defineProps<{
  id: string | undefined
  match: string
  substitution: string
  isRegEx: boolean
  isCaseSensitive: boolean
  isWholeWord: boolean
  isReplaceAll: boolean
  noEdit?: boolean
}>()
const emit = defineEmits([
  "update:isRegEx",
  "update:isCaseSensitive",
  "update:isWholeWord",
  "update:isReplaceAll",
  "delete",
])

const dummyLetter = ref<HTMLSpanElement | null>(null)
const { width: letterWidth } = useElementSize(dummyLetter)

const toggleRegEx = () => {
  emit("update:isRegEx", !props.isRegEx)
}

const toggleCaseSensitive = () => {
  emit("update:isCaseSensitive", !props.isCaseSensitive)
}

const toggleWholeWord = () => {
  emit("update:isWholeWord", !props.isWholeWord)
}

const toggleReplaceAll = () => {
  emit("update:isReplaceAll", !props.isReplaceAll)
}

const requestDelete = () => {
  emit("delete")
}
</script>

<template>
  <div
    class="relative flex items-center justify-between max-w-full min-w-0 py-1 break-all transition-colors duration-300 fill-mode-forward"
  >
    <span ref="dummyLetter" class="absolute z-0 font-mono text-sm text-transparent">a</span>
    <div class="flex items-center gap-2 transition-colors duration-300 fill-mode-forward grow">
      <TruncText
        :text="props.match"
        :letter-width="letterWidth"
        class="font-mono text-sm transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon grow basis-1"
      />
      <span
        class="transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon grow-0 shrink-0"
      >
        →
      </span>
      <TruncText
        :text="props.substitution"
        :letter-width="letterWidth"
        class="font-mono text-sm transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon grow basis-1"
      />
    </div>
    <div v-if="!props.noEdit" class="flex items-center gap-1 h-fit shrink-0 dark:text-primary-dark-icon">
      <IconButton
        icon-name="mdi:regex"
        tooltip="Use RegEx"
        class="transition-colors duration-300 rounded-sm fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        :class="{
          'bg-primary-light-active dark:bg-primary-dark-active': props.isRegEx,
        }"
        @click="toggleRegEx"
      />
      <IconButton
        icon-name="mdi:format-letter-case"
        tooltip="Match Case"
        class="transition-colors duration-300 rounded-sm fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        :class="{
          'bg-primary-light-active dark:bg-primary-dark-active': props.isCaseSensitive,
        }"
        @click="toggleCaseSensitive"
      />
      <IconButton
        icon-name="material-symbols:match-word-rounded"
        tooltip="Match Whole Word"
        class="transition-colors duration-300 rounded-sm fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        :class="{
          'bg-primary-light-active dark:bg-primary-dark-active ': props.isWholeWord,
        }"
        @click="toggleWholeWord"
      />
      <IconButton
        icon-name="codicon:replace-all"
        tooltip="Replace All"
        class="transition-colors duration-300 rounded-sm fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        :class="{
          'bg-primary-light-active dark:bg-primary-dark-active ': props.isReplaceAll,
        }"
        @click="toggleReplaceAll"
      />
      <IconButton
        icon-name="mdi:delete-outline"
        tooltip="Delete"
        class="text-red-400 transition-colors duration-300 rounded-sm fill-mode-forward hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        @click="requestDelete"
      />
    </div>
  </div>
</template>
