<script setup>
const colorMode = useColorMode()
const isDark = ref(colorMode.preference === "dark")
const themeIcon = computedEager(() =>
  isDark.value ? "material-symbols:dark-mode-outline-rounded" : "material-symbols:light-mode-outline",
)

watch(
  () => colorMode.preference,
  (preference) => {
    isDark.value = preference === "dark"
  },
)

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? "light" : "dark"
}
</script>

<template>
  <div
    class="dark:bg-primary-dark-900 transition-all duration-300 fill-mode-forward bg-primary-light-900 border-primary-light-border border-b dark:border-black dark:text-primary-dark-icon text-primary-light-icon max-h-16 items-center font-brand flex justify-center lg:justify-between p-4 relative"
  >
    <span
      class="text-4xl transition-colors duration-300 fill-mode-forward font-bold self-center text-primary-light-icon dark:text-primary-dark-icon"
    >
      <span class="bg-gradient-to-br bg-clip-text text-transparent from-red-500 to-orange-300">RegEx</span>Factory
    </span>
    <div class="hidden xxs:flex gap-1 absolute lg:static right-2 sm:right-4 top-4">
      <NuxtLink
        to="https://www.github.com/LagunaElectric/regex-factory"
        class="focus-visible:outline-offset-0 focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon rounded-sm"
        target="_blank"
      >
        <IconButton
          class="w-8 h-8 transition-colors duration-300 fill-mode-forward rounded-sm grow text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active dark:hover:bg-primary-dark-active hidden sm:flex"
          name="brandico:github"
          tabindex="-1"
        />
      </NuxtLink>
      <NuxtLink
        to="https://paypal.me/LagunaStudios"
        class="focus-visible:outline-offset-0 focus-visible:outline-2 focus-visible:outline-double focus-visible:outline-primary-light-icon dark:focus-visible:outline-primary-dark-icon rounded-sm"
        target="_blank"
      >
        <IconButton
          class="w-8 h-8 transition-colors duration-300 fill-mode-forward rounded-sm grow text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active dark:hover:bg-primary-dark-active hidden xs:flex"
          name="simple-icons:paypal"
          tabindex="-1"
        />
      </NuxtLink>
      <IconButton
        class="w-8 h-8 transition-colors duration-300 fill-mode-forward rounded-sm grow text-primary-light-icon dark:text-primary-dark-icon hover:bg-primary-light-active dark:hover:bg-primary-dark-active"
        :name="themeIcon"
        @click="toggleColorMode"
      />
    </div>
  </div>
</template>
