<script setup>
defineProps({
  numbers: Array
})
</script>

<template>
  <div class="rack">
    <div v-for="num in numbers">
      {{ num }}
    </div>
  </div>
</template>

<style scoped>
.rack {
  display: flex;
}

.rack > * {
  align-items: center;
  background: #383397;
  box-shadow: 2px 2px 2px rgba(0, 0, 0, 0.2) inset, 1px 1px 0 rgba(255, 255, 255, 0.1);
  color: #fff;
  display: flex;
  flex: none;
  font-size: 24px;
  font-weight: bold;
  height: 53px;
  justify-content: center;
  width: 53px;
}

.rack > * + * {
  margin-left: 10px;
}

@media (min-width: 610px) {
  .rack > * {
    font-size: 36px;
    height: 80px;
    width: 80px;
  }
}

@media (min-width: 730px) {
  .rack > * {
    box-shadow: 3px 3px 3px rgba(0, 0, 0, 0.2) inset, 1px 1px 0 rgba(255, 255, 255, 0.1);
    font-size: 48px;
    height: 100px;
    width: 100px;
  }
}
</style>
