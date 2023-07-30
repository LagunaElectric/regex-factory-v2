<script setup lang="ts">
import { ref } from "vue"
import { FactoryRuleProps } from "./FactoryRule.vue"
import { create } from "domain"
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
  if (!match.value) return
  emit("ruleCreated", {
    match: match.value,
    substitution: substitution.value,
    isRegEx: isRegEx.value,
    isCaseSensitive: isCaseSensitive.value,
    isWholeWord: isWholeWord.value,
    isReplaceAll: isReplaceAll.value,
  } as FactoryRuleProps)
  reset()
  matchInputRef.value?.focus()
}
</script>

<template>
  <div class="flex flex-col 2xl:flex-row transition-colors duration-300 fill-mode-forward items-center h-fit gap-1 p-1">
    <div class="flex grow flex-col w-full transition-colors duration-300 fill-mode-forward 2xl:w-auto gap-1">
      <input
        v-model="match"
        placeholder="Find"
        type="text"
        name="findText"
        id="find-text"
        ref="matchInputRef"
        @keyup.enter="createRule"
        class="bg-primary-light-700 focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon transition-colors duration-300 text-primary-light-icon dark:text-primary-dark-icon fill-mode-forward dark:bg-primary-dark-700 border-primary-light-border dark:border-primary-dark-border rounded-sm border grow"
      />
      <input
        v-model="substitution"
        placeholder="Replace"
        type="text"
        name="findText"
        id="find-text"
        @keyup.enter="createRule"
        class="bg-primary-light-700 focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon dark:bg-primary-dark-700 text-primary-light-icon dark:text-primary-dark-icon transition-colors duration-300 fill-mode-forward border-primary-light-border dark:border-primary-dark-border rounded-sm border grow"
      />
    </div>
    <div
      class="flex w-full 2xl:w-auto justify-between transition-colors duration-300 fill-mode-forward 2xl:justify-normal"
    >
      <div
        class="2xl:grid 2xl:grid-cols-2 flex justify-center shrink-0 transition-colors duration-300 fill-mode-forward items-center h-fit gap-1 text-primary-light-icon dark:text-primary-dark-icon"
      >
        <IconButton
          name="mdi:regex"
          class="rounded-sm hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:active:bg-neutral-200/30"
          @click="toggleRegEx()"
          :is-toggled="isRegEx"
          :class="{
            'bg-primary-light-active dark:bg-primary-dark-active': isRegEx,
          }"
        />
        <IconButton
          name="mdi:format-letter-case"
          class="rounded-sm hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:active:bg-neutral-200/30"
          @click="toggleCaseSensitive()"
          :is-toggled="isCaseSensitive"
          :class="{
            'bg-primary-light-active dark:bg-primary-dark-active': isCaseSensitive,
          }"
        />
        <IconButton
          name="material-symbols:match-word-rounded"
          class="rounded-sm hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:active:bg-neutral-200/30"
          @click="toggleWholeWord()"
          :is-toggled="isWholeWord"
          :class="{
            'bg-primary-light-active dark:bg-primary-dark-active': isWholeWord,
          }"
        />
        <IconButton
          name="codicon:replace-all"
          class="rounded-sm hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:active:bg-neutral-200/30"
          @click="toggleReplaceAll()"
          :is-toggled="isReplaceAll"
          :class="{
            'bg-primary-light-active dark:bg-primary-dark-active': isReplaceAll,
          }"
        />
      </div>
      <IconButton
        name="mdi:plus-circle-outline"
        class="rounded-sm h-full self-center transition-colors duration-300 fill-mode-forward text-primary-light-icon hover:bg-primary-light-active dark:hover:bg-primary-dark-active dark:text-primary-dark-icon"
        @click="createRule()"
      />
    </div>
  </div>
</template>
