<script setup lang="ts">
import { ref } from "vue"
import Rule from "utils/Rule"
const emit = defineEmits(["ruleCreated"])

const match = ref("")
const substitution = ref("")

const isRegEx = ref(false)
const isCaseSensitive = ref(false)
const isWholeWord = ref(false)
const isReplaceAll = ref(false)
const matchInputRef = ref<HTMLInputElement | null>(null)

function toggleRegEx() {
  isRegEx.value = !isRegEx.value
}

function toggleCaseSensitive() {
  isCaseSensitive.value = !isCaseSensitive.value
}

function toggleWholeWord() {
  isWholeWord.value = !isWholeWord.value
}

function toggleReplaceAll() {
  isReplaceAll.value = !isReplaceAll.value
}

function reset() {
  match.value = ""
  substitution.value = ""
  isRegEx.value = false
  isCaseSensitive.value = false
  isWholeWord.value = false
  isReplaceAll.value = false
}

function createRule() {
  if (!match.value) { return }
  emit("ruleCreated", {
    match: match.value,
    substitution: substitution.value,
    isRegEx: isRegEx.value,
    isCaseSensitive: isCaseSensitive.value,
    isWholeWord: isWholeWord.value,
    isReplaceAll: isReplaceAll.value,
  } as Rule)
  reset()
  matchInputRef.value?.focus()
}
</script>

<template>
  <div class="flex flex-col 2xl:flex-row transition-colors duration-300 fill-mode-forward items-center h-fit gap-1 p-1">
    <div class="flex grow flex-col w-full transition-colors duration-300 fill-mode-forward 2xl:w-auto gap-1">
      <input
        id="find-text"
        ref="matchInputRef"
        v-model="match"
        placeholder="Find"
        type="text"
        name="findText"
        class="bg-primary-light-700 focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon transition-colors duration-300 text-primary-light-icon dark:text-primary-dark-icon fill-mode-forward dark:bg-primary-dark-700 border-primary-light-border dark:border-primary-dark-border rounded-sm border grow"
        @keyup.enter="createRule"
      >
      <input
        id="find-text"
        v-model="substitution"
        placeholder="Replace"
        type="text"
        name="findText"
        class="bg-primary-light-700 focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon dark:bg-primary-dark-700 text-primary-light-icon dark:text-primary-dark-icon transition-colors duration-300 fill-mode-forward border-primary-light-border dark:border-primary-dark-border rounded-sm border grow"
        @keyup.enter="createRule"
      >
    </div>
    <div
      class="flex w-full 2xl:w-auto justify-between transition-colors duration-300 fill-mode-forward 2xl:justify-normal"
    >
      <div
        class="2xl:grid 2xl:grid-cols-2 flex justify-center shrink-0 transition-colors duration-300 fill-mode-forward items-center h-fit gap-1 text-primary-light-icon dark:text-primary-dark-icon"
      >
        <IconButton
          icon-name="mdi:regex"
          tooltip="Use RegEx"
          class="rounded-sm hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:active:bg-neutral-200/30"
          :is-toggled="isRegEx"
          :class="{
            'bg-primary-light-active dark:bg-primary-dark-active': isRegEx,
          }"
          @click="toggleRegEx()"
        />
        <IconButton
          icon-name="mdi:format-letter-case"
          tooltip="Match Case"
          class="rounded-sm hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:active:bg-neutral-200/30"
          :is-toggled="isCaseSensitive"
          :class="{
            'bg-primary-light-active dark:bg-primary-dark-active': isCaseSensitive,
          }"
          @click="toggleCaseSensitive()"
        />
        <IconButton
          icon-name="material-symbols:match-word-rounded"
          tooltip="Match Whole Word"
          class="rounded-sm hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:active:bg-neutral-200/30"
          :is-toggled="isWholeWord"
          :class="{
            'bg-primary-light-active dark:bg-primary-dark-active': isWholeWord,
          }"
          @click="toggleWholeWord()"
        />
        <IconButton
          icon-name="codicon:replace-all"
          tooltip="Replace All"
          class="rounded-sm hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:active:bg-neutral-200/30"
          :is-toggled="isReplaceAll"
          :class="{
            'bg-primary-light-active dark:bg-primary-dark-active': isReplaceAll,
          }"
          @click="toggleReplaceAll()"
        />
      </div>
      <IconButton
        icon-name="mdi:plus-circle-outline"
        tooltip="Add Rule"
        class="rounded-sm h-full self-center transition-colors duration-300 fill-mode-forward text-primary-light-icon hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:text-primary-dark-icon"
        @click="createRule()"
      />
    </div>
  </div>
</template>
