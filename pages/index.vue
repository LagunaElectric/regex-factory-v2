<script setup lang="ts">
// @ts-expect-error - Ignore missing types
import { Container, Draggable } from "vue3-smooth-dnd"
import { ref, useTemplateRef } from "vue"
import { onClickOutside } from "@vueuse/core"
import Rule from "utils/Rule"

const appTitle = "RegEx Factory"
const appDescription =
  "RegEx Factory is a tool for transforming text with RegEx. It allows you to easily create rules and apply them to input text, providing you with the output text that matches your rules. With RegEx Factory, you can save time and effort in creating complex regular expressions, and focus on what really matters - your project."

useSeoMeta({
  title: appTitle,
  description: appDescription,
  ogTitle: appTitle,
  ogDescription: appDescription,
  ogImage: "[og:image]",
  ogUrl: "[og:url]",
  twitterTitle: appTitle,
  twitterDescription: appDescription,
  twitterImage: "[twitter:image]",
  twitterCard: "summary",
})

type DragResult = {
  removedIndex: number | null
  addedIndex: number | null
  payload: Rule
  droppedElement: any
}

const { $client } = useNuxtApp()
// console.log(await $client.getRuleSets.useQuery())
const { status: sessionStatus } = useSession()
const user = await $client.getUser.useQuery()
const input = ref("")
const output = ref("")
const showOverwritePrompt = ref(false)
const sidebarRef = useTemplateRef<HTMLElement>("sidebar")
onClickOutside(sidebarRef, () => {
  showSidebar.value = false
})
const showSidebar = ref(true)
const factoryRules = ref(new RuleSet())
const saveIcon = computed(() => factoryRules.value.isSaved ? "mdi:content-save" : "mdi:content-save-alert")
const getRuleSets = $client.getRuleSets.useQuery()
const ruleSetList = computed(() => {
  const { data, status } = getRuleSets
  if (!data.value || status.value === "error") { return [] }
  const ruleSets = data.value.map((ruleSet) => {
    const { id, title, rules } = ruleSet
    return {
      id,
      title,
      rules: rules.map((rule) => {
        const { id, match, substitution, isRegEx, isCaseSensitive, isWholeWord, isReplaceAll } = rule.rule
        return {
          id,
          order: rule.order,
          match,
          substitution,
          isRegEx,
          isCaseSensitive,
          isWholeWord,
          isReplaceAll,
        }
      }).sort((a, b) => a.order - b.order),
    }
  })
  return ruleSets
})

// const refreshRulesets = async() => {
//   await getRuleSets.refresh()
// }

if (sessionStatus.value === "authenticated") {
  if (!Object.keys(user.data.value).length) {
    await $client.createUser.mutate()
    await user.refresh()
  }
}

const applyRules = () => {
  output.value = factoryRules.value.apply(input.value)
}

const saveRules = async(overwrite?: boolean) => {
  if (!overwrite) {
    if (factoryRules.value.isStored && !factoryRules.value.isSaved) {
      showOverwritePrompt.value = true
    }
  }
  await factoryRules.value.save(overwrite)
}

const genRuleKey = (rule: Rule, i: number) =>
  `${i}-${((rule.match.length * (rule.substitution.length || 1.68)) / 2) * rule.match.charCodeAt(0)}`.replace(".", "")

const applyDrag = (dragResult: DragResult) => {
  const { removedIndex, addedIndex, payload } = dragResult

  if (removedIndex === null && addedIndex === null) { return factoryRules.value.rules }
  let itemToAdd = payload

  if (removedIndex !== null) {
    itemToAdd = factoryRules.value.removeRuleAt(removedIndex)
  }
  if (addedIndex !== null) {
    factoryRules.value.insertRule(itemToAdd, addedIndex)
  }
}

const onDrop = (e: DragResult) => {
  applyDrag(e)
}

watch([input, factoryRules.value.rules], applyRules)
</script>

<template>
  <div
    class="relative flex flex-col h-screen max-h-screen transition-colors duration-300 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon border-primary-light-border dark:border-primary-dark-border"
  >
    <AppHeader />
    <div
      class="grid items-stretch max-h-full grid-rows-3 gap-1 transition-colors duration-300 lg:grid-cols-3 fill-mode-forward grow lg:grid-rows-2 justify-stretch bg-primary-light-900 dark:bg-primary-dark-800 dark:text-neutral-200"
    >
      <AppSideBar
        ref="sidebar"
        class="z-20 flex flex-col h-full gap-1 p-4 transition-transform duration-300 w-96 fill-mode-forward"
        :class="{
          'translate-x-0': showSidebar,
          '-translate-x-full': !showSidebar,
        }"
        @close="() => showSidebar = false"
      >
        <h2 class="text-lg font-bold transition-colors duration-300 text-primary-light-icon dark:text-primary-dark-icon fill-mode-forward">
          Load Ruleset
        </h2>
        <div class="flex flex-col gap-1 overflow-x-hidden overflow-y-auto">
          <RulesetListItem
            v-for="ruleSet in ruleSetList"
            :key="ruleSet.id"
            v-bind="ruleSet"
            @item-selected="() => {
              showSidebar = false
              console.log('Trying to load ruleset:', ruleSet)
              factoryRules = new RuleSet(ruleSet.id, ruleSet.title, ruleSet.rules, true)
            }"
          />
        </div>
      </AppSideBar>
      <div class="relative h-full transition-colors duration-300 fill-mode-forward lg:row-span-2">
        <div
          class="absolute inset-0 flex flex-col gap-1 px-2 overflow-auto transition-colors duration-300 fill-mode-forward lg:pb-2"
        >
          <RuleFactory
            class="sticky top-0 z-10 justify-between p-1 mt-2 transition-colors duration-300 border rounded-sm fill-mode-forward dark:bg-primary-dark-700 border-primary-light-border dark:border-primary-dark-border"
            @rule-created="(rule: Rule) => factoryRules.addRule(rule)"
          />
          <div class="flex gap-1">
            <EditableText :text="factoryRules.title" class="shrink-0 grow" @on-finish-editing="(val: string) => factoryRules.title = val" />

            <IconButton
              class="h-full transition-colors duration-300 rounded-sm grow-0 text-primary-light-icon fill-mode-forward hover:bg-primary-light-active dark:hover:bg-primary-dark-active"
              :class="{
                'dark:text-primary-dark-icon': factoryRules.isSaved,
                'dark:text-orange-300': !factoryRules.isSaved,
              }"
              tooltip="Save Ruleset"
              :icon-name="saveIcon"
              @click="() => saveRules()"
            />
            <IconButton
              class="h-full transition-colors duration-300 rounded-sm grow-0 text-primary-light-icon dark:text-primary-dark-icon fill-mode-forward hover:bg-primary-light-active dark:hover:bg-primary-dark-active"
              tooltip="Load Ruleset"
              icon-name="material-symbols:list-alt-add"
              @click="() => showSidebar = !showSidebar"
            />
          </div>

          <Container
            drag-class="z-50 text-white transition duration-100 ease-in transform scale-110 border-2 bg-primary dark:bg-primary border-primary-hover rotate-6 cursor-grabbing"
            drop-class="z-50 transition duration-100 ease-in transform scale-90 -rotate-2"
            class="p-1 space-y-1 overflow-x-hidden overflow-y-auto transition-colors duration-300 border rounded-sm grow fill-mode-forward border-primary-light-border dark:border-primary-dark-border bg-primary-light-700 dark:bg-primary-dark-700"
            @drop="(e: DragResult) => onDrop(e)"
          >
            <Draggable
              v-for="(rule, i) in factoryRules.rules"
              :key="genRuleKey(rule, i)"
            >
              <FactoryRule
                v-bind="rule"
                :id="genRuleKey(rule, i) + '00'"
                class="px-1 text-lg border rounded-sm cursor-grab bg-primary-light-900 dark:bg-primary-dark-500 border-primary-light-border dark:border-primary-dark-border"
                @update:is-reg-ex="(val: boolean) => (rule.isRegEx = val)"
                @update:is-case-sensitive="(val: boolean) => (rule.isCaseSensitive = val)"
                @update:is-whole-word="(val: boolean) => (rule.isWholeWord = val)"
                @update:is-replace-all="(val: boolean) => (rule.isReplaceAll = val)"
                @delete="() => factoryRules.removeRuleAt(i)"
              />
            </Draggable>
          </Container>
        </div>
      </div>
      <BigText v-model="input" label="Input:" class="px-2 lg:pl-0 lg:pt-2 lg:col-span-2" />
      <BigText v-model="output" label="Output:" class="px-2 pb-2 lg:pl-0 lg:col-span-2" :readonly="true" />
    </div>
    <AppFooter class="hidden xs:flex" />
    <Teleport to="body">
      <div class="relative z-20">
        <div
          class="absolute flex flex-col items-center justify-center max-w-lg transition-colors duration-300 top-12 right-12 fill-mode-forward text-primary-light-icon dark:text-primary-dark-icon"
        >
          <AppModal
            v-if="showOverwritePrompt"
            title="This RuleSet already exists."
            message="Do you want to overwrite it?"
            :on-submit="() => saveRules(true)"
            :on-close="() => showOverwritePrompt = false"
          />
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style>
body {
  height: 100vh;
}

#__nuxt {
  height: 100vh;
}

/*.smooth-dnd-drop-preview-constant-class {
  background-color: red !important;
}*/
</style>
