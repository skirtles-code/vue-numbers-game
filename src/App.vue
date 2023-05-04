<script setup>
import { computed, reactive, ref, unref, watch } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseCard from './BaseCard.vue'
import NumberRack from './NumberRack.vue'
import RulesModal from './RulesModal.vue'
import SolutionStep from './SolutionStep.vue'
import { distance, DURATION, evaluateOperation, normalizeOps, solve } from './utils.js'

const FADE_IN = `fade-in ${DURATION}ms ease`
const DELAYED_FADE_IN = `delayed-fade-in ${DURATION * 1.25}ms ease`

const large = ref(1)

const startNumbers = ref(null)
const target = ref(null)
const nextStep = ref('')
const steps = reactive([])
const showRules = ref(false)
const hintIndex = ref(0)

startNewGame()

const isCompleteStep = (step) => step.length === 3 && step.every(value => value)

const solution = computed(() => solve(startNumbers, target))
const stillRemaining = computed(() => numbersRemaining(startNumbers, steps.filter(isCompleteStep)))
const closestDistance = computed(() => distance(solution.value[0], target))
const targetReached = computed(() => stillRemaining.value.some(num => distance(num, target) === closestDistance.value))

const allHints = computed(() => {
  const hints = []

  const [nearest, ...steps] = solution.value

  if (nearest === target.value) {
    hints.push(`The target value of ${nearest} is achievable`)
  } else {
    hints.push(`The closest you can get is ${closestDistance.value} away`)
  }

  const unused = numbersRemaining(startNumbers, steps).filter(n => n !== nearest)

  if (unused.length === 0) {
    hints.push('All of the start numbers need to be used')
  }

  unused.forEach((spare, index) => {
    if (startNumbers.value.indexOf(spare) === startNumbers.value.lastIndexOf(spare)) {
      hints.push(`The number ${spare} is not needed`)
    } else if (unused.indexOf(spare) === index) {
      hints.push(`One of the ${spare}s is not needed`)
    } else {
      hints.push(`Neither of the ${spare}s is needed`)
    }
  })

  const ordinals = ['first', 'second', 'third', 'fourth', 'fifth']

  steps.forEach((step, index) => {
    hints.push(`The ${ordinals[index]} step is ${step.join(' ')} = ${evaluateOperation(step)}`)
  })

  return hints
})

const hints = computed(() => allHints.value.slice(0, hintIndex.value))

watch(steps, () => {
  for (let index = 0; index < steps.length; ++index) {
    if (!isCompleteStep(steps[index])) {
      steps.length = index + 1
    }
  }

  const remaining = stillRemaining.value
  let addBlankRow = remaining.length > 1 && !targetReached.value

  if (addBlankRow && steps.length) {
    addBlankRow = isCompleteStep(steps[steps.length - 1])
  }

  if (addBlankRow) {
    steps.push([])
  }

  if (steps.length) {
    nextStep.value = steps[steps.length - 1].join(' ')
  }
}, { immediate: true })

function onInputKeyPress(event) {
  const { key } = event

  if (key === 'Enter') {
    onStepEnter()
    return
  }

  if (/^[^\d+\-×÷xX*/ ]$/.test(key)) {
    event.preventDefault()
  }
}

function onStepEnter() {
  const step = normalizeOps(nextStep.value.replace(/\s/g, ''))
  const match = step.match(/(\d+)([+\-×÷])(\d+)/)

  if (match) {
    const [_, num1Str, op, num2Str] = match
    const num1 = +num1Str
    const num2 = +num2Str

    const numbers = [...stillRemaining.value]
    const index1 = numbers.indexOf(num1)

    if (index1 !== -1) {
      numbers.splice(index1, 1)

      const index2 = numbers.indexOf(num2)

      if (index2 !== -1) {
        const result = evaluateOperation(num1, op, num2)

        if (result) {
          steps.pop()
          steps.push([num1, op, num2])
          nextStep.value = ''
        }
      }
    }
  }
}

function numbersRemaining(start, steps) {
  const newNums = [...unref(start)]

  for (const step of steps) {
    const index1 = newNums.indexOf(step[0])
    newNums.splice(index1, 1)
    const index2 = newNums.indexOf(step[2])
    newNums.splice(index2, 1)
    newNums.push(evaluateOperation(step))
  }

  newNums.sort((a, b) => b - a)

  return newNums
}

function pickOne(arr) {
  const index = Math.floor(Math.random() * arr.length)

  return arr.splice(index, 1)[0]
}

function startNewGame() {
  reset()
  hintIndex.value = 0

  const nums = []

  const largeNumbers = [25, 50, 75, 100]
  const smallNumbers = []

  for (let i = 1; i <= 10; ++i) {
    smallNumbers.push(i, i)
  }

  for (let i = 0; i < large.value; ++i) {
    nums.push(pickOne(largeNumbers))
  }

  for (let i = 0; i < 6 - large.value; ++i) {
    nums.push(pickOne(smallNumbers))
  }

  nums.sort((b, a) => a - b)

  startNumbers.value = nums

  target.value = Math.floor(Math.random() * 900 + 100)
}

function reset() {
  nextStep.value = ''
  steps.length = 0
}

function showHint() {
  hintIndex.value++
}
</script>

<template>
  <div class="outer">
    <BaseCard class="new-game-ct">
      <span>How many large numbers?</span>
      <select v-model="large">
        <option v-for="(_, n) in 5" :value="n">
          {{ n }}
        </option>
      </select>
      <BaseButton @click="startNewGame">
        New game
      </BaseButton>
    </BaseCard>
    <BaseCard class="game-ct">
      <div class="target">
        {{ target }}
      </div>
      <hr>
      <NumberRack :numbers="startNumbers" />
    </BaseCard>
    <BaseCard class="steps-ct">
      <div v-for="(step, index) in steps" class="step-row">
        <SolutionStep
          v-model:step="steps[index]"
          :still-remaining="numbersRemaining(startNumbers, steps.slice(0, index))"
        />
        <template v-if="isCompleteStep(step)">
          <div class="square-box">
            =
          </div>
          <div class="square-box">
            {{ evaluateOperation(step) }}
          </div>
        </template>
        <template v-if="index === steps.length - 1">
          <div v-if="targetReached" class="target-achieved">
            <svg height="11" width="14" viewBox="0 0 28 22" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <polyline points="4,12 10,18 24,4" stroke="#090" stroke-width="7" />
              <polyline points="4,12 10,18 24,4" stroke="#7c7" stroke-width="4.24" />
            </svg>
            <span v-if="closestDistance === 0">Target achieved</span>
            <span v-else>{{ closestDistance }} away is optimal</span>
          </div>
          <div v-else-if="stillRemaining.length === 1" class="target-achieved">
            <svg height="12" width="12" viewBox="0 0 24 24" stroke-linecap="round" stroke-linejoin="round" fill="none">
              <g stroke="#900" stroke-width="7">
                <polyline points="4,4 20,20" />
                <polyline points="4,20 20,4" />
              </g>
              <g stroke="#c77" stroke-width="4.24">
                <polyline points="4,4 20,20" />
                <polyline points="4,20 20,4" />
              </g>
            </svg>
            <span>{{ distance(stillRemaining[0], target) }} away</span>
          </div>
        </template>
        <BaseButton v-if="index === 0 && isCompleteStep(step)" class="reset-button" @click="reset">
          Reset
        </BaseButton>
      </div>
      <input
        v-if="stillRemaining.length !== 1 && !targetReached"
        v-model="nextStep"
        class="step-input"
        :placeholder="steps.length === 1 ? `e.g. ${startNumbers[0]} + ${startNumbers[1]}` : null"
        @keypress="onInputKeyPress"
      >
    </BaseCard>
    <BaseCard>
      <div class="bottom-button-bar">
        <BaseButton :disabled="hintIndex === allHints.length" @click="showHint">
          Show hint
        </BaseButton>
        <BaseButton @click="showRules = true">
          Show rules
        </BaseButton>
      </div>
      <ul v-if="hints.length" class="hints-list">
        <li v-for="hint in hints">
          <strong>Hint:</strong> {{ hint }}
        </li>
      </ul>
    </BaseCard>
    <a href="https://github.com/skirtles-code/vue-numbers-game" target="_blank" class="github-link" title="View GitHub repository">
      <img src="./github-mark.svg">
    </a>
  </div>
  <RulesModal v-model:visible="showRules" />
</template>

<style scoped>
.outer {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  min-height: 100vh;
  min-width: 398px;
}

.outer > * + * {
  margin-top: 20px;
}

.new-game-ct {
  align-items: center;
  display: flex;
}

.new-game-ct > * {
  margin-right: 10px;
}

.new-game-ct select {
  font-size: 16px;
  height: 30px;
  min-width: 50px;
}

.game-ct {
  align-items: center;
  background: #365b9a;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.game-ct > * + * {
  margin-top: 10px;
}

.target {
  background: #222;
  box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2) inset, 1px 1px 0 rgba(255, 255, 255, 0.1);
  color: #4f0;
  font-size: 30px;
  font-weight: bold;
  letter-spacing: 0.09em;
  padding: 10px 15px;
}

hr {
  align-self: stretch;
  border: 0 none;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  border-top: 1px solid rgba(0, 0, 0, 0.15);
  margin: 0;
}

.steps-ct {
  background-image: repeating-linear-gradient(to right, transparent 0, transparent 20px, rgba(0, 0, 255, 0.05) 20px, rgba(0, 0, 255, 0.05) 21px), repeating-linear-gradient(to bottom, transparent 0, transparent 20px, rgba(0, 0, 255, 0.05) 20px, rgba(0, 0, 255, 0.05) 21px);
  margin-top: 10px;
  min-height: 100px;
}

.step-row {
  align-items: center;
  display: flex;
  margin-bottom: 2px;
}

.step-row + .step-row {
  animation: v-bind(DELAYED_FADE_IN);
}

.step-input {
  display: none;
  font-size: 24px;
  margin-left: auto;
  padding: 2px 5px;
  position: absolute;
  right: 20px;
  top: 20px;
  transform: v-bind('`translateY(${(steps.length - 1) * 44}px)`');
  transition: v-bind('`transform ${DURATION}ms ease`');
  width: 170px;
}

.square-box {
  align-items: center;
  align-self: start;
  animation: v-bind(DELAYED_FADE_IN);
  color: #222;
  display: flex;
  font-size: 16px;
  justify-content: center;
  margin-right: 10px;
  min-height: 36px;
  min-width: 36px;
  padding: 2px;
}

.reset-button {
  animation: v-bind(DELAYED_FADE_IN);
  margin-left: auto;
}

.target-achieved {
  align-items: center;
  align-self: start;
  animation: v-bind(DELAYED_FADE_IN);
  display: flex;
  height: 36px;
  margin-left: 10px;
}

.target-achieved > * + * {
  margin-left: 7px;
}

.bottom-button-bar {
  align-items: center;
  display: flex;
}

.bottom-button-bar > * + * {
  margin-left: auto;
}

.hints-list {
  margin-bottom: 0;
}

.hints-list li {
  animation: v-bind(FADE_IN);
  line-height: 1.4;
}

.github-link {
  align-self: flex-end;
  margin-right: 20px;
  opacity: 0.8;
}

.github-link:hover {
  opacity: 1;
}

@media (min-width: 820px) {
  .github-link {
    display: flex;
    margin: 0;
    position: absolute;
    right: 20px;
    top: 20px;
  }
}

.github-link img {
  height: 24px;
}

@media (min-width: 610px) {
  .outer {
    padding: 20px 0;
    width: 570px;
  }

  .target {
    font-size: 36px;
  }

  .step-input {
    display: inline-block;
  }
}

@media (min-width: 730px) {
  .outer {
    width: 690px;
  }

  .target {
    font-size: 48px;
  }
}
</style>
