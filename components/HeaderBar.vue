<script setup>
const { signIn, signOut, data: sessionData, status: sessionStatus } = useSession()

const colorMode = useColorMode()
const isDark = ref(colorMode.preference === "dark")
const themeIcon = computedEager(() =>
  isDark.value ? "material-symbols:dark-mode-outline-rounded" : "material-symbols:light-mode-outline",
)

const profilePicLink = computed(() => sessionStatus.value === "authenticated"
  ? sessionData.value.user.image
  : "https://www.gravatar.com/avatar/9cc912f33c522b971c205647a9ba91c8?d=https://replit.com/public/images/evalbot/evalbot_29.png&s=256",
)

const commonProps = {
  class: "hover:bg-primary-light-active hover:dark:bg-primary-dark-active mx-1 rounded-sm",
}

const authOptions = ref(sessionStatus.value === "unauthenticated"
  ? [{
      label: "Sign In",
      value: "sign-in",
      props: {
        ...commonProps,
        onClick: () => signIn("google"),
      },
    }]
  : [{
      label: "Sign Out",
      value: "sign-out",
      props: {
        ...commonProps,
        onClick: signOut,
      },
    }],
)

const options = computed(() => [
  {
    label: "Settings",
    value: "settings",
    props: commonProps,
  },
  {
    type: "divider",
    props: commonProps,
  },
  ...authOptions.value,
])

watch(
  () => colorMode.preference,
  (preference) => {
    isDark.value = preference === "dark"
  },
)

watch(
  () => sessionStatus.value,
  (status) => {
    authOptions.value = status === "unauthenticated"
      ? [{
          label: "Sign In",
          value: "sign-in",
          props: {
            ...commonProps,
            onClick: signIn,
          },
        }]
      : [{
          label: "Sign Out",
          value: "sign-out",
          props: {
            ...commonProps,
            onClick: signOut,
          },
        }]
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
      <span class="bg-gradient-to-br bg-clip-text text-transparent from-red-500 to-orange-300" @click="console.log(hello.data.value)">RegEx</span>Factory
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
      <n-dropdown trigger="click" :options="options" placement="bottom-end" :show-arrow="true" class="bg-primary-light-700 rounded-sm">
        <n-avatar round size="medium" :src="profilePicLink" class="ml-4" />
      </n-dropdown>
    </div>
  </div>
</template>
