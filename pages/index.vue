<script setup lang="ts">
import { ref } from "vue"
import { FactoryRuleProps } from "components/FactoryRule.vue"

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

useHead({
  htmlAttrs: {
    lang: "en",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
})

// definePageMeta({
//   colorMode: "light",
// })

const input = ref("")
const output = ref("")

const factoryRules = reactive<FactoryRuleProps[]>([])

function applyRules() {
  const regexFactory = new RegExFactory(factoryRules)
  output.value = regexFactory.process(input.value)
}

const genRuleKey = (rule: FactoryRuleProps, i: number) =>
  `${i}-${((rule.match.length * (rule.substitution.length || 1.68)) / 2) * rule.match.charCodeAt(0)}`.replace(".", "")

watch([input, factoryRules], applyRules)
</script>

<template>
  <div
    class="flex flex-col h-screen transition-colors duration-300 fill-mode-forward max-h-screen text-primary-light-icon dark:text-primary-dark-icon border-primary-light-border dark:border-primary-dark-border"
  >
    <HeaderBar />
    <div
      class="grid lg:grid-cols-3 transition-colors duration-300 fill-mode-forward grow max-h-full lg:grid-rows-2 grid-rows-3 gap-1 justify-stretch items-stretch bg-primary-light-900 dark:bg-primary-dark-800 dark:text-neutral-200"
    >
      <div class="relative h-full transition-colors duration-300 fill-mode-forward lg:row-span-2">
        <div
          class="absolute inset-0 transition-colors duration-300 fill-mode-forward flex flex-col overflow-auto gap-1 px-2 lg:pb-2"
        >
          <RuleFactory
            class="justify-between transition-colors duration-300 mt-2 lg:mt-8 fill-mode-forward sticky top-0 z-10 dark:bg-primary-dark-700 rounded-sm p-1 border border-primary-light-border dark:border-primary-dark-border"
            @rule-created="(rule) => factoryRules.push(rule)"
          />
          <div
            class="overflow-auto grow p-1 rounded-sm border transition-colors duration-300 fill-mode-forward border-primary-light-border dark:border-primary-dark-border bg-primary-light-700 dark:bg-primary-dark-700"
          >
            <FactoryRule
              v-for="(rule, i) in factoryRules"
              v-bind="rule"
              :key="genRuleKey(rule, i)"
              class="px-1 mb-1 text-lg bg-primary-light-900 dark:bg-primary-dark-500 rounded-sm border border-primary-light-border dark:border-primary-dark-border"
              @update:is-reg-ex="(val) => (rule.isRegEx = val)"
              @update:is-case-sensitive="(val) => (rule.isCaseSensitive = val)"
              @update:is-whole-word="(val) => (rule.isWholeWord = val)"
              @update:is-replace-all="(val) => (rule.isReplaceAll = val)"
              @delete="() => factoryRules.splice(i, 1)"
            />
          </div>
        </div>
      </div>
      <BigText v-model="input" label="Input:" class="px-2 lg:pl-0 lg:pt-2 lg:col-span-2" />
      <BigText v-model="output" label="Output:" class="pb-2 px-2 lg:pl-0 lg:col-span-2" :readonly="true" />
    </div>
    <Footer class="hidden xs:flex" />
  </div>
</template>

<style>
body {
  height: 100vh;
}

#__nuxt {
  height: 100vh;
}
</style>
