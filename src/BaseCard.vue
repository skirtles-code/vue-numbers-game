<script setup>
import { onMounted, onUnmounted, onUpdated, ref } from 'vue'
import { DURATION } from './utils.js'

const card = ref()
let height = null

onMounted(fixHeight)
onUpdated(fixHeight)

window.addEventListener('resize', fixHeight)
onUnmounted(() => window.removeEventListener('resize', fixHeight))

function fixHeight() {
  const el = card.value

  el.style.transition = 'none'
  el.style.height = 'auto'

  const newHeight = el.offsetHeight

  el.style.height = height + 'px'
  el.style.transition = ''

  if (newHeight !== height) {
    String(el.offsetHeight)
    height = newHeight
    el.style.height = height + 'px'
  }
}
</script>

<template>
  <div class="card" ref="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: #fff;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  padding: 15px;
  position: relative;
  transition: v-bind('`height ${DURATION}ms ease`');
}

@media (min-width: 610px) {
  .card {
    padding: 20px;
  }
}
</style>
