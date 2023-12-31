<script setup lang="ts">
import Rule from "utils/Rule"

const props = defineProps<Rule>()
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
    class="flex max-w-full transition-colors duration-300 fill-mode-forward justify-between items-center py-1 min-w-0 break-all relative"
  >
    <span ref="dummyLetter" class="text-sm font-mono text-transparent absolute z-0">a</span>
    <div class="flex gap-2 items-center transition-colors duration-300 fill-mode-forward grow">
      <TruncText
        :text="props.match"
        :letter-width="letterWidth"
        class="font-mono transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon grow text-sm basis-1"
      />
      <span
        class="transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon grow-0 shrink-0"
      >
        →
      </span>
      <TruncText
        :text="props.substitution"
        :letter-width="letterWidth"
        class="font-mono transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon grow text-sm basis-1"
      />
    </div>
    <div class="flex gap-1 h-fit items-center shrink-0 dark:text-primary-dark-icon">
      <IconButton
        icon-name="mdi:regex"
        tooltip="Use RegEx"
        class="rounded-sm transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        :class="{
          'bg-primary-light-active dark:bg-primary-dark-active': props.isRegEx,
        }"
        @click="toggleRegEx"
      />
      <IconButton
        icon-name="mdi:format-letter-case"
        tooltip="Match Case"
        class="rounded-sm transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        :class="{
          'bg-primary-light-active dark:bg-primary-dark-active': props.isCaseSensitive,
        }"
        @click="toggleCaseSensitive"
      />
      <IconButton
        icon-name="material-symbols:match-word-rounded"
        tooltip="Match Whole Word"
        class="rounded-sm transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        :class="{
          'bg-primary-light-active dark:bg-primary-dark-active ': props.isWholeWord,
        }"
        @click="toggleWholeWord"
      />
      <IconButton
        icon-name="codicon:replace-all"
        tooltip="Replace All"
        class="rounded-sm transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        :class="{
          'bg-primary-light-active dark:bg-primary-dark-active ': props.isReplaceAll,
        }"
        @click="toggleReplaceAll"
      />
      <IconButton
        icon-name="mdi:delete-outline"
        tooltip="Delete"
        class="rounded-sm text-red-400 transition-colors duration-300 fill-mode-forward hover:bg-primary-light-active hover:dark:bg-primary-dark-active"
        @click="requestDelete"
      />
    </div>
  </div>
</template>
