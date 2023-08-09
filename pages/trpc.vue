<script setup lang="ts">
const { $client } = useNuxtApp()

const hello = await $client.test.useQuery()
</script>

<template>
  <div>
    <!-- As `superjson` is already pre-configured, we can use `time` as a `Date` object without further deserialization 🎉 -->
    tRPC Data: "{{ hello.data.value?.greeting }}" send at "{{ hello.data.value?.time.toLocaleDateString('en-EN') }}".
  </div>
</template>
