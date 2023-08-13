<script lang="ts" setup>
export interface EditableTextProps {
  modelValue: string
}

const props = defineProps<EditableTextProps>()
const emit = defineEmits(["update:modelValue"])

const isEditing = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)
const dummyLetter = ref<HTMLSpanElement | null>(null)
const { width: letterWidth } = useElementSize(dummyLetter)

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit("update:modelValue", value)
  },
})

function beginEditing() {
  isEditing.value = true
  nextTick(() => inputRef.value?.focus())
}

function finishEditing() {
  isEditing.value = false
  if (!value.value) {
    emit("update:modelValue", "Untitled Rule Set")
  }
}
</script>

<template>
  <div class="after:w-full after:h-[1px] after:bg-primary-dark-border after:content-[''] after:absolute after:left-0 after:bottom-0 relative cursor-text" @click="() => console.info('clicked')">
    <input
      v-if="isEditing"
      ref="inputRef"
      v-model="value"
      type="text"
      placeholder="Input"
      class="w-full h-full bg-primary-light-700 focus-visible:outline-none dark:bg-primary-dark-700 text-primary-light-icon dark:text-primary-dark-icon transition-colors duration-300 fill-mode-forward border-primary-light-border dark:border-primary-dark-border rounded-sm border grow"
      autofocus
      @keyup.enter.prevent="finishEditing"
      @focusout="finishEditing"
    >
    <TruncText v-else class="font-mono text-primary-light-icon dark:text-primary-dark-icon" :text="value" :letter-width="letterWidth" @click="beginEditing" />
    <span ref="dummyLetter" class="font-mono text-transparent absolute z-0 left-0 top-0">a</span>
  </div>
</template>
