<template>
  <section class='slide'>
    <slot></slot>
  </section>
</template>

<script>
export default {
  name: 'Slide',
}
</script>

<style lang="scss">
.slide {
  height: 100%;
  width: 100%;
  overflow-y: auto;
}
</style>