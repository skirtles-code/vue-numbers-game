<script setup>
import { onMounted, reactive, ref, watch } from 'vue'
import { DURATION } from './utils.js'

defineProps({
  active: Boolean
})

const DURATION_40 = DURATION * 0.4
const DURATION_50 = DURATION * 0.5
const DURATION_60 = DURATION * 0.6

const initialRender = ref(true)
const el = ref()

const positionChildren = () => {
  const duration = DURATION_60
  const delay = DURATION_40

  const children = [...el.value.children]
  const widths = children.map(child => child.offsetWidth)

  let offset = 0
  let childrenRemaining = 0

  for (let index = 0; index < children.length; ++index) {
    const child = children[index]

    if (leftChildren.has(child)) {
      continue
    }

    if (leavingChildren.has(child)) {
      leftChildren.add(child)

      child.style.transition = `opacity ${duration}ms ease`
      child.style.opacity = 0

      const done = leavingChildren.get(child)

      setTimeout(() => done(), DURATION)
    } else {
      if (enteringChildren.has(child)) {
        child.style.opacity = 0
        getComputedStyle(child).opacity
        child.style.transition = `opacity ${duration}ms ease ${delay}ms`
        child.style.opacity = 1
      } else if(!initialRender.value) {
        if (leavingChildren.size) {
          child.style.transition = `transform ${duration}ms ease`
        } else {
          child.style.transition = `transform ${duration}ms ease ${delay}ms`
        }
      }

      child.style.transform = `translate(${offset}px)`
      offset += widths[index] + 10
      ++childrenRemaining
    }
  }

  // The width doesn't impact the buttons in this container, but it does determine where the next container will be
  // positioned. That container is only shown in cases where this container has a single child.
  if (childrenRemaining === 1) {
    el.value.style.width = `${offset}px`
  }

  el.value.style.setProperty('--underline-width', `${offset - 10}px`)

  leavingChildren.clear()
  enteringChildren.clear()
}

const leavingChildren = reactive(new Map())
const enteringChildren = reactive(new Set())
const leftChildren = reactive(new WeakSet())

watch([leavingChildren, enteringChildren], () => {
  if (leavingChildren.size || enteringChildren.size) {
    positionChildren()
  }
}, { flush: 'post' })

onMounted(() => {
  positionChildren()
  initialRender.value = false
})

const listeners = {
  enter(el) {
    enteringChildren.add(el)
  },

  leave(el, done) {
    leavingChildren.set(el, done)
  }
}
</script>

<template>
  <div ref="el" class="button-container" :class="{ 'button-container-active': active && !initialRender }">
    <transition-group :duration="DURATION" :css="false" v-on="listeners">
      <slot />
    </transition-group>
  </div>
</template>

<style scoped>
.button-container {
  overflow: visible;
  position: relative;
  width: 0;
}

.button-container-active {
  z-index: 1;
}

.button-container > :deep(*) {
  left: 0;
  position: absolute;
  top: 0;
}

.button-container::after {
  background: #89ddff;
  content: "";
  display: block;
  height: 2px;
  margin-right: 10px;
  margin-top: 40px;
  opacity: 0;
  transform: scaleX(0.5);
  transform-origin: 0 0;
  width: var(--underline-width, 0);
}

.button-container-active::after {
  opacity: 1;
  transform: scaleX(1);
  transition: v-bind('`transform ${DURATION_60}ms ease ${DURATION_50}ms, opacity ${DURATION_50}ms ease ${DURATION_50}ms`');
}
</style>
