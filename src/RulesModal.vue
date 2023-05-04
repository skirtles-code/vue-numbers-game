<script setup>
import { watchEffect } from 'vue'
import BaseButton from './BaseButton.vue'
import { DURATION } from './utils.js'

const props = defineProps({
  visible: {
    required: true,
    type: Boolean
  }
})

const emit = defineEmits(['update:visible'])

watchEffect(() => {
  document.body.style.overflow = props.visible ? 'hidden' : ''
})

function close() {
  emit('update:visible', false)
}
</script>

<template>
  <div v-if="visible" class="backdrop" @click.self="close">
    <div class="modal">
      <div class="modal-section center">
        <h2>The Numbers Game</h2>
      </div>
      <div class="modal-section modal-body">
        <p>
          This game is from the British TV show <a href="https://en.wikipedia.org/wiki/Countdown_(game_show)" target="_blank">Countdown</a>, based on an earlier French game show.
        </p>
        <ul>
          <li>
            A target number between 100 and 999 inclusive is selected at random.
          </li>
          <li>
            The six other numbers shown below the target must be manipulated to reach the target number.
          </li>
          <li>
            Only the four basic arithmetic operations are allowed: +, -, &times; and &divide;.
          </li>
          <li>
            Each number can only be used once in a solution, but the numbers don't all have to be used.
          </li>
          <li>
            Each step of the calculation must yield a positive, whole number. Division must be exact, without remainders or fractions.
          </li>
          <li>
            The six numbers are drawn at random from an initial set of 24. These consist of the 'small' numbers 1 to 10, each occurring twice, and four 'large' numbers: 25, 50, 75 and 100.
          </li>
          <li>
            The player may choose how many large numbers they want, from 0 to 4. They must make that decision without knowing the target number.
          </li>
          <li>
            In the TV show, players have 30 seconds to reach the target. There is no timer in the version presented here.
          </li>
          <li>
            The target cannot always be reached. The objective is to get as close as possible.
          </li>
        </ul>
        <p>
          You can enter the steps of your solution by clicking the buttons. <span class="input-instructions">Alternatively, you can type a step into the box and press <strong>Enter</strong>.</span> Each step should include two numbers and an operator. If you wish to combine three numbers, e.g. 1 + 2 + 3, then you'll need to break it down into two steps.
        </p>
        <p>
          The <strong>Show hint</strong> button can be used to reveal hints, guiding you to the optimal solution.
        </p>
      </div>
      <div class="modal-section center">
        <BaseButton @click="close">Close</BaseButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  align-items: start;
  animation: v-bind('`fade-in ${DURATION / 2}ms ease`');
  background: rgba(222, 222, 232, 0.9);
  bottom: 0;
  display: flex;
  justify-content: center;
  left: 0;
  overflow: auto;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 10;
}

.modal {
  background: #fff;
  box-shadow: 4px 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  line-height: 1.3;
  max-height: 100vh;
}

li {
  font-size: 14px;
}

li + li {
  margin-top: 6px;
}

.modal-section {
  flex: none;
  padding: 15px;
}

.modal-section + .modal-section {
  border-top: 1px solid #ccc;
}

.modal-section :first-child {
  margin-top: 0;
}

.modal-section :last-child {
  margin-bottom: 0;
}

.modal-body {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

.center {
  align-items: center;
  display: flex;
  justify-content: center;
}

.input-instructions {
  display: none;
}

@media (min-width: 610px) {
  .backdrop {
    align-items: center;
  }

  .modal {
    max-height: 95vh;
    width: 550px;
  }

  .modal-section {
    padding: 20px;
  }

  .input-instructions {
    display: inline;
  }
}

@media (min-width: 730px) {
  .modal {
    width: 670px;
  }
}
</style>
