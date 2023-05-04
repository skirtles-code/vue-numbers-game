<script setup>
import BaseButton from './BaseButton.vue'

defineProps({
  selected: Boolean
})
</script>

<template>
  <BaseButton
    class="input-button"
    :class="{ 'input-button-selected': selected }"
  >
    <slot />
  </BaseButton>
</template>

<style scoped>
.input-button {
  margin-right: 10px;
  min-height: 36px;
  min-width: 36px;
  padding: 2px;
}

.input-button-selected {
  background: #d7d7d7;
  color: #000;
}

.input-button-selected:hover {
  background: #d2d2d2;
}

.input-button-selected:active {
  background: #d0d0d0;
}
</style>
