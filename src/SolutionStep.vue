<script setup>
import { computed, ref, watchEffect } from 'vue'
import ButtonContainer from './ButtonContainer.vue'
import InputButton from './InputButton.vue'
import { evaluateOperation } from './utils.js'

const props = defineProps({
  stillRemaining: {
    required: true,
    type: Array
  },
  step: {
    required: true,
    type: Array
  }
})

const emit = defineEmits(['update:step'])

const firstNumIndex = ref(null)
const secondNumIndex = ref(null)

const firstNum = computed(() => props.step[0])
const selectedOp = computed(() => props.step[1])
const secondNum = computed(() => props.step[2])

const getIndexedNumberList = () => {
  return props.stillRemaining.map((value, index) => ({
    value, index, selected: false
  }))
}

const firstNumberList = computed(() => {
  const numbers = getIndexedNumberList()

  const index = firstNumIndex.value

  if (index != null) {
    numbers[index].selected = true
    return [numbers[index]]
  }

  return numbers
})

const operatorsList = computed(() => {
  if (selectedOp.value) {
    return [selectedOp.value]
  }

  if (firstNum.value) {
    return validOperatorsFor(firstNum.value)
  }

  return []
})

const secondNumberList = computed(() => {
  if (!selectedOp.value) {
    return []
  }

  const numbers = getIndexedNumberList()

  const index = secondNumIndex.value

  if (index != null) {
    numbers[index].selected = true
    return [numbers[index]]
  } else {
    const index = firstNumIndex.value

    if (index != null) {
      numbers.splice(index, 1)
    }
  }

  const valid = validSecondNumbersFor(firstNum.value, selectedOp.value)

  return numbers.filter(({ value }) => valid.includes(value))
})

watchEffect(() => {
  const firstValue = firstNum.value
  const secondValue = secondNum.value
  const stillRemaining = [...props.stillRemaining]

  if (!firstValue) {
    firstNumIndex.value = null
  } else {
    if (firstNumIndex.value == null || stillRemaining[firstNumIndex.value] !== firstValue) {
      firstNumIndex.value = stillRemaining.indexOf(firstValue)
    }
  }

  if (!secondValue) {
    secondNumIndex.value = null
  } else {
    stillRemaining[firstNumIndex.value] = false

    if (secondNumIndex.value == null || stillRemaining[secondNumIndex.value] !== secondValue) {
      secondNumIndex.value = stillRemaining.indexOf(secondValue)
    }
  }
})

function updateStep(...step) {
  while (step.length && step[step.length - 1] == null) {
    step.pop()
  }

  emit('update:step', step)
}

function onFirstClick(index) {
  firstNumIndex.value = firstNumIndex.value === index ? null : index
  updateStep(props.stillRemaining[firstNumIndex.value])
}

function onOpClick(op) {
  const newOp = selectedOp.value === op ? null : op
  updateStep(firstNum.value, newOp)
}

function onSecondClick(index) {
  secondNumIndex.value = secondNumIndex.value === index ? null : index
  updateStep(firstNum.value, selectedOp.value, props.stillRemaining[secondNumIndex.value])
}

function validOperatorsFor(num) {
  return ['+', '×', '-', '÷'].filter(op => validSecondNumbersFor(num, op).length > 0)
}

function validSecondNumbersFor(num, op) {
  const remaining = [...props.stillRemaining]
  remaining.splice(remaining.indexOf(num), 1)

  return remaining.filter(num2 => {
    const result = evaluateOperation(num, op, num2)

    return result && result !== num && result !== num2
  })
}
</script>

<template>
  <div class="solution-step">
    <ButtonContainer :active="!firstNum">
      <InputButton
        v-for="({ value, index, selected }) in firstNumberList"
        :key="index"
        :selected="selected"
        @click="onFirstClick(index)"
      >
        {{ value }}
      </InputButton>
    </ButtonContainer>
    <ButtonContainer :active="firstNum && !selectedOp">
      <InputButton
        v-for="op in operatorsList"
        :key="op"
        :selected="selectedOp === op"
        @click="onOpClick(op)"
      >
        {{ op }}
      </InputButton>
    </ButtonContainer>
    <ButtonContainer :active="!!selectedOp && !secondNum">
      <InputButton
        v-for="({ value, index, selected }) in secondNumberList"
        :key="index"
        :selected="selected"
        @click="onSecondClick(index)"
      >
        {{ value }}
      </InputButton>
    </ButtonContainer>
  </div>
</template>

<style scoped>
.solution-step {
  align-items: start;
  display: flex;
}
</style>
