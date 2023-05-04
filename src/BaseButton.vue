<template>
  <button class="base-button">
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  background: #f2f2f2;
  border: 1px solid #777;
  border-radius: 2px;
  color: #222;
  cursor: pointer;
  font-size: 16px;
  margin: 0;
  padding: 5px;
}

.base-button:hover:not(:disabled) {
  background: #e2e2e2;
}

.base-button:active:not(:disabled) {
  background: #ddd;
}

.base-button:disabled {
  color: #777;
  cursor: default;
}
</style>
